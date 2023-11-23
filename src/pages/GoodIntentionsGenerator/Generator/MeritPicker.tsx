import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import {
  Alert,
  Button,
  Stack,
  Center,
  Text,
  Group,
  ScrollArea,
} from "@mantine/core";
import { globals } from "../../../assets/globals";
import { v5MeritFlawFilter } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws";
import FormulaPicker from "./ThinBloodModal";
import { useState } from "react";
import { DisciplineKey } from "../../../data/GoodIntentions/types/V5Disciplines";
import MeritsGrid from "../../../components/GoodIntentions/Inputs/MeritsGrid";
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS";

type MeritPickerProps = {
  kindred: Kindred;
  setKindred: (kindred: Kindred) => void;
  nextStep: () => void;
  backStep: () => void;
  venueData: GoodIntentionsVenueStyleSheet;
};

const MeritPicker = ({ kindred, setKindred, nextStep, backStep, venueData }: MeritPickerProps) => {
  const meritFlawData = v5MeritFlawFilter(kindred);
  const [modalOpen, setModalOpen] = useState(false);

  const getThinBloodPoints = (kindred: Kindred) => {
    let totalFlawPoints = 0;
    let totalMeritPoints = 0;
    Object.values(kindred.meritsFlaws).forEach((mf) => {
      const meritFlawInfo = meritFlawData.find((entry) => entry.name === mf.name);
      if (meritFlawInfo) {
        if (meritFlawInfo.type === "flaw" && meritFlawInfo.category === "thin-blood") {
          totalFlawPoints += mf.creationPoints;
        }
        if (meritFlawInfo.type === "merit" && meritFlawInfo.category === "thin-blood") {
          totalMeritPoints += mf.creationPoints;
        }
      }
    });
    return { totalFlawPoints, totalMeritPoints };
  };

  const getTotalPoints = (kindred: Kindred) => {
    let totalFlawPoints = 0;
    let totalMeritPoints = 0;
    Object.values(kindred.meritsFlaws).forEach((mf) => {
      const meritFlawInfo = meritFlawData.find((entry) => entry.name === mf.name);
      if (meritFlawInfo) {
        if (meritFlawInfo.type === "flaw" && meritFlawInfo.category !== "thin-blood") {
          totalFlawPoints += mf.creationPoints;
        }
        if (meritFlawInfo.type === "merit" && meritFlawInfo.category !== "thin-blood") {
          totalMeritPoints += mf.creationPoints;
        }
      }
    });
    return { totalFlawPoints, totalMeritPoints };
  };


  const handleCloseModal = () => {
    setKindred({
      ...kindred,
      rituals: [],
      ceremonies: [],
    });
    setModalOpen(false);
  };

  const isPhoneScreen = globals.isPhoneScreen;
  const isSmallScreen = globals.isSmallScreen;
  const height = globals.viewportHeightPx;

  const thinBloodStyle =
    !(getThinBloodPoints(kindred).totalFlawPoints > 0 &&
      getThinBloodPoints(kindred).totalMeritPoints > 0 &&
      getThinBloodPoints(kindred).totalFlawPoints === getThinBloodPoints(kindred).totalMeritPoints)
      ? { fontSize: globals.smallFontSize }
      : { color: "grey" };

  const isAlchemist = kindred.meritsFlaws.some((m) => m.name === "Thin-Blood Alchemist");
  const isDiscipline = kindred.meritsFlaws.some((m) => m.name === "Discipline Affinity");
  const isCursed = kindred.meritsFlaws.some((m) => m.name === "Clan Curse");

  return (
    <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px' }}>
      <Stack>
        <ScrollArea h={height - 140} pb={20}>
          <Text align="center" mt={"xl"} ta="center" fz="xl" fw={700}>Merits & Flaws</Text>
          {kindred.clan === "Thin-Blood" ?
            <Stack>
              <Text style={thinBloodStyle}>
                Thin-blood characters must choose between 1 to 3 Thin-Blood Merits and an equal number of Thin-Blood Flaws.
              </Text>
              <Group position="apart">
                <Text><b>Thin-Blood Merits picked:</b> {getThinBloodPoints(kindred).totalMeritPoints}</Text>
                <Text><b>Thin-Blood Flaws picked:</b> {getThinBloodPoints(kindred).totalFlawPoints}</Text>
              </Group>
            </Stack> :
            <></>}
          <Center>
            <MeritsGrid kindred={kindred} setKindred={setKindred} type="creationPoints" venueData={venueData} />
          </Center>

          <FormulaPicker kindred={kindred} setKindred={setKindred} nextStep={nextStep} modalOpened={modalOpen} closeModal={handleCloseModal} />


        </ScrollArea>
        <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px", position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen ? "15%" : "30%" }}>
          <Group>
            <Button.Group>
              <Button
                style={{ margin: "5px" }}
                color="gray"
                onClick={backStep}
              >
                Back
              </Button>
              <Button
                style={{ margin: "5px" }}
                color="gray"
                onClick={() => {
                  if (kindred.clan === "Thin-Blood" && !isDiscipline) {
                    const updatedDisciplines = { ...kindred.disciplines };
                    for (const disciplineKey in updatedDisciplines) {
                      let key = disciplineKey as DisciplineKey
                      if (key !== "thin-blood alchemy") {
                        updatedDisciplines[key] = {
                          ...updatedDisciplines[key],
                          creationPoints: 0,
                          freebiePoints: 0,
                        };
                      }
                    }
                    setKindred({
                      ...kindred,
                      disciplines: updatedDisciplines,
                      powers: [],
                    });
                  } if (kindred.clan === "Thin-Blood" && !isAlchemist) {
                    const updatedDisciplines = { ...kindred.disciplines };
                    updatedDisciplines["thin-blood alchemy"] = {
                      ...updatedDisciplines["thin-blood alchemy"],
                      creationPoints: 0,
                      freebiePoints: 0,
                    };
                    setKindred({
                      ...kindred,
                      disciplines: updatedDisciplines,
                      formulae: [],
                    });
                  } if (kindred.clan === "Ghoul") {
                    // Handle the Ghoul case
                    //setGhoulModalOpen(true);
                  } if (!(isAlchemist || isDiscipline || isCursed)) {
                    // Handle other conditions
                    nextStep();
                  } else {
                    // Handle the default case
                    setModalOpen(true);
                  }
                }}
                disabled={getTotalPoints(kindred).totalMeritPoints > 10 || getTotalPoints(kindred).totalMeritPoints !== getTotalPoints(kindred).totalFlawPoints || getThinBloodPoints(kindred).totalFlawPoints !== getThinBloodPoints(kindred).totalMeritPoints || (kindred.clan === "Thin-Blood" && getThinBloodPoints(kindred).totalMeritPoints === 0 && getThinBloodPoints(kindred).totalFlawPoints === 0)}
              >
                Next
              </Button>
              <Text fz={globals.smallerFontSize} style={{ margin: "10px" }}>Total Merits: {getTotalPoints(kindred).totalMeritPoints}, Total Flaws: {getTotalPoints(kindred).totalFlawPoints}</Text>
            </Button.Group>
          </Group>
        </Alert>
      </Stack>
    </Center>
  )

}

export default MeritPicker