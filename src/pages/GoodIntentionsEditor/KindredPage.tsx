import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "@mantine/hooks";
import { Center, Tabs, Stack, Button, Alert } from "@mantine/core";
import { v4 as uuidv4 } from 'uuid';
// Context
import { useCharacterDb } from "../../contexts/CharacterContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCoterieDb } from "../../contexts/CoterieContext";
// Data
import { Kindred, getEmptyKindred } from "../../data/GoodIntentions/types/Kindred";
import { GoodIntentionsVSSs } from "../../data/CaM/types/VSS";
import { remainingExperience } from "../../data/GoodIntentions/types/V5Experience";
// Components
import ExperienceAside from "./ExperienceAside";
import PrintSheetCore from "../../components/GoodIntentions/PrintSheet/PrintSheet";
import V5XpInputs from "../../components/GoodIntentions/V5XpInputs";
import BackstoryTab from "../../components/GoodIntentions/V5BackstoryTab";
import RetireModal from "../../components/GoodIntentions/Editor/RetireModal";
import CoterieSheet from "../../components/GoodIntentions/Coterie/coterieSheet";

import changeLog from "../../utils/GoodIntentions/LoggingTool";
import { globals } from "../../assets/globals";
import { Coterie, getEmptyCoterie } from "../../data/GoodIntentions/types/Coterie";


const KindredPage = () => {
  const { characterId } = useParams();
  const { getKindredById, updateKindred } = useCharacterDb();
  const [showRetire, setShowRetire] = useState<boolean>(false);
  const { writeCoterieData, getCoterieData } = useCoterieDb()
  const { currentUser } = useAuth();

  const [coterie, setCoterie] = useState(getEmptyCoterie())
  const [initialKindred, setInitialKindred] = useLocalStorage<Kindred>({
    key: `initKindred id ${characterId}`,
    defaultValue: getEmptyKindred(),
  })
  const [kindred, setKindred] = useLocalStorage<Kindred>({
    key: `kindred id ${characterId}`,
    defaultValue: getEmptyKindred(),
  })

  useEffect(() => {
    if (characterId && !kindred.id) {
      getKindredById(characterId, setKindred)
    }
    if (initialKindred.uid === "") {
      setInitialKindred(kindred)
    }
    getCoterieData(kindred.coterie.id, kindred.vssId, setCoterie)
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

  async function handleCreateCoterie(kindred: Kindred, coterie: Coterie) {
    try {
      if (kindred.id) {
        const idString = uuidv4();
        const updatedKindred = { ...kindred, coterie: { ...kindred.coterie, id: idString } }
        updateKindred(kindred.id, updatedKindred)
        setKindred(updatedKindred)
        setInitialKindred(updatedKindred)
        writeCoterieData(idString, coterie)
      }
    } catch {
      console.log("Failed to create coterie")
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
            <Tabs.List className="no-print">
              <Tabs.Tab value="experience">XP Tab</Tabs.Tab>
              <Tabs.Tab value="background">Background</Tabs.Tab>
              <Tabs.Tab value="print sheet">Print Sheet</Tabs.Tab>
            </Tabs.List>
          </Center>

          <Tabs.Panel value="coterie" pt="xs">
            {kindred ?
              <CoterieSheet kindred={kindred} coterie={coterie} handleCreateCoterie={handleCreateCoterie} />
              : null}
          </Tabs.Panel>

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
      <RetireModal kindred={kindred} showRetire={showRetire} setShowRetire={setShowRetire} />
      <ExperienceAside kindred={kindred} />
      <Button.Group className="no-print" style={{ position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen ? "15%" : "30%" }}>
        <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px" }}>
          <Button
            style={{ margin: "5px" }}
            color="gray"
            disabled={remainingExperience(kindred) < 0}
            onClick={() => handleUpdate()}>
            Update
          </Button>
          <Button
            style={{ margin: "5px" }}
            color="gray"
            onClick={() => setShowRetire(true)}
          >
            Retire
          </Button>
        </Alert>
      </Button.Group>
    </Center>

  )

}

export default KindredPage