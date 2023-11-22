import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "@mantine/hooks";
import { Center, Tabs, Stack, Button, Alert, Text, useMantineTheme } from "@mantine/core";
import _ from 'lodash';

// Context
import { useCharacterDb } from "../../contexts/CharacterContext";
import { useAuth } from "../../contexts/AuthContext";
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

import { globals } from "../../assets/globals";
import { getEmptyCoterie } from "../../data/GoodIntentions/types/Coterie";
import UpdateModal from "./UpdateModal";
import LogPage from "./LogPage";

const KindredPage = () => {
  const theme = useMantineTheme()

  const { characterId } = useParams();
  const { getKindredById } = useCharacterDb();
  const [showRetire, setShowRetire] = useState<boolean>(false);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
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
  })

  const venueData = GoodIntentionsVSSs.find(vss => vss.venueStyleSheet.id === kindred.vssId)


  if ((currentUser && kindred.uid !== currentUser.uid) || !currentUser || !venueData) {
    return null
  }

  if (JSON.stringify(initialKindred.touchstones) !== JSON.stringify(kindred.touchstones)) {
    console.log(JSON.stringify(initialKindred.touchstones), JSON.stringify(kindred.touchstones))
  }

  return (
    <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
      <Tabs variant="outline" defaultValue="print sheet" orientation={globals.isPhoneScreen ? "vertical" : "horizontal"}>
        <Stack spacing="0">
          <Center>
            <Tabs.List className="no-print">
              <Tabs.Tab value="coterie"><Text color={theme.colors.red[8]}>Coterie</Text></Tabs.Tab>
              <Tabs.Tab value="experience"><Text color={theme.colors.grape[8]}>XP Tab</Text></Tabs.Tab>
              <Tabs.Tab value="logs">Logs</Tabs.Tab>
              <Tabs.Tab value="background"><Text color={theme.colors.blue[8]}>Background</Text></Tabs.Tab>
              <Tabs.Tab value="print sheet"><Text color={theme.colors.green[9]}>Print Sheet</Text></Tabs.Tab>
            </Tabs.List>
          </Center>

          <Tabs.Panel value="coterie" pt="xs">
            {kindred ?
              <CoterieSheet kindred={kindred} setKindred={setKindred} initialKindred={initialKindred} setInitialKindred={setInitialKindred} coterie={coterie} setCoterie={setCoterie} />
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

          <Tabs.Panel value="logs" pt="xs">
            {kindred ?
              <LogPage kindred={kindred} />
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
      <UpdateModal showUpdate={showUpdate} setShowUpdate={setShowUpdate} kindred={kindred} setKindred={setKindred} initialKindred={initialKindred} setInitialKindred={setInitialKindred} />
      <ExperienceAside kindred={kindred} />
      <Button.Group className="no-print" style={{ position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen ? "15%" : "30%" }}>
        <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px" }}>
          <Button
            style={{ margin: "5px" }}
            color="gray"
            disabled={remainingExperience(kindred) < 0 || _.isEqual(initialKindred,kindred)}
            onClick={() => setShowUpdate(true)}>
            Update
          </Button>
          <Button
            style={{ margin: "5px" }}
            color="gray"
            onClick={() => { setShowRetire(true); }}
          >
            Retire
          </Button>
        </Alert>
      </Button.Group>
    </Center>

  )

}

export default KindredPage