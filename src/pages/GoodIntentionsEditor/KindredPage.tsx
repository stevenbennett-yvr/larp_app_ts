import { useParams } from "react-router-dom"
import { useCharacterDb } from "../../contexts/CharacterContext";
import { useAuth } from "../../contexts/AuthContext";
import { Kindred, getEmptyKindred } from "../../data/GoodIntentions/types/Kindred";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";
import { Center, Tabs, Stack, Button, Alert, } from "@mantine/core";
import { globals } from "../../assets/globals";
import PrintSheetCore from "../../components/GoodIntentions/PrintSheet/PrintSheetCore";
import V5XpInputs from "../../components/GoodIntentions/V5XpInputs";
import { GoodIntentionsVSSs } from "../../data/CaM/types/VSS";
import BackstoryTab from "../../components/GoodIntentions/V5BackstoryTab";
import changeLog from "../../utils/GoodIntentions/LoggingTool";
import { remainingExperience } from "../../data/GoodIntentions/types/V5Experience";
import ExperienceAside from "./ExperienceAside";

const KindredPage = () => {
  const { characterId } = useParams();
  const { getKindredById, updateKindred } = useCharacterDb();

  const { currentUser } = useAuth();

  const [initialKindred, setInitialKindred] = useLocalStorage<Kindred>({
    key: `initKindred id ${characterId}`,
    defaultValue: getEmptyKindred(),
  })
  const [kindred, setKindred] = useLocalStorage<Kindred>({
    key: `kindred id ${characterId}`,
    defaultValue: getEmptyKindred(),
  })

  console.log()

  useEffect(() => {
    if (characterId && !kindred.id) {
      getKindredById(characterId, setKindred)
      setInitialKindred(kindred)
    }
  })

  const venueData = GoodIntentionsVSSs.find(vss => vss.venueStyleSheet.id === kindred.vssId)

  const handleUpdate = () => {
    if (kindred.id && kindred !== initialKindred) {
      const updatedKindred = {
        ...kindred,
        changeLogs: {
          ...kindred.changeLogs,
          [new Date().toISOString()]: changeLog(initialKindred, kindred)
        }
      }

      updateKindred(kindred.id, updatedKindred)
      setKindred(updatedKindred)
      setInitialKindred(updatedKindred)
    }
  }

  if ((currentUser && kindred.uid !== currentUser.uid) || !currentUser || !venueData) {
    return null
  }

  return (
    <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
      <Tabs defaultValue="print sheet" orientation={globals.isPhoneScreen ? "vertical" : "horizontal"}>
        <Stack spacing="0">
          <Center>
            <Tabs.List style={{ paddingBottom: "10px" }}>
              <Tabs.Tab value="experience">XP Tab</Tabs.Tab>
              <Tabs.Tab value="background">Background</Tabs.Tab>
              <Tabs.Tab value="print sheet">Print Sheet</Tabs.Tab>
            </Tabs.List>
          </Center>

          <Tabs.Panel value="experience" pt="xs">
            {kindred ?
              <V5XpInputs kindred={kindred} setKindred={setKindred} venueData={venueData} />
              : null}
          </Tabs.Panel>

          <Tabs.Panel value="background" pt="xs">
            {kindred ?
              <BackstoryTab kindred={kindred} setKindred={setKindred} />
              : null}
          </Tabs.Panel>

          <Tabs.Panel value="print sheet" pt="xs">
            {kindred ?
              <PrintSheetCore kindred={kindred} vssId={kindred.vssId} />
              : null}
          </Tabs.Panel>

        </Stack>
      </Tabs>
      <ExperienceAside kindred={kindred} />
      <Button.Group style={{ position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen ? "15%" : "30%" }}>
        <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px" }}>
          <Button
            style={{ margin: "5px" }}
            color="gray"
            disabled={remainingExperience(kindred) < 0}
            onClick={() => handleUpdate()}>
            Update
          </Button>
        </Alert>
      </Button.Group>
    </Center>

  )

}

export default KindredPage