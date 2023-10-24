import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Center, Tabs, Stack, Alert, Group, Button, Text } from "@mantine/core"
import { globals } from "../../../assets/globals"
import BackgroundFull from "../../../components/GoodIntentions/Inputs/BackgroundFull"
import LoresheetInputs from "../../../components/GoodIntentions/Inputs/LoresheetPicker"
import { backgroundData } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS"


type BackgroundLoreTabsProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    backStep: () => void
    venueData: GoodIntentionsVenueStyleSheet
}

const BackgroundLoreTabs = ({kindred, setKindred, nextStep, backStep, venueData}:BackgroundLoreTabsProps) => {

    
    const getFlawPoints = (kindred: Kindred): number => {
        let totalFlawPoints = 0;

        Object.values(kindred.backgrounds).forEach((background) => {
            let backgroundInfo = backgroundData.find(entry => entry.name === background.name)

            Object.values(background.advantages).forEach((advantage) => {
                let advantageInfo = backgroundInfo?.advantages?.find(entry => entry.name === advantage.name)

                if (advantageInfo?.type === "disadvantage") {
                    totalFlawPoints += advantage.creationPoints
                }
            })

        });

        return Math.min(totalFlawPoints, 5);

    }

    const getTotalBackgroundPoints = (kindred: Kindred): number => {
        let totalAdvantagePoints = 0;

        Object.values(kindred.backgrounds).forEach((background) => {
            totalAdvantagePoints += background.creationPoints
        });

        return totalAdvantagePoints

    }

    const getRemainingPoints = (kindred: Kindred): number => {
        let totalBackgroundPoints = 0;

        Object.values(kindred.backgrounds).forEach((background) => {
            let backgroundInfo = backgroundData.find(entry => entry.name === background.name)

            totalBackgroundPoints += background.creationPoints;
            Object.values(background.advantages).forEach((advantage) => {
                let advantageInfo = backgroundInfo?.advantages?.find(entry => entry.name === advantage.name)

                if (advantageInfo?.type === "advantage") {
                    totalBackgroundPoints += advantage.creationPoints
                }
            })

        });

        let totalLoresheetPoints = 0

        Object.values(kindred.loresheet.benefits).forEach((benefit) => {
            totalLoresheetPoints += benefit.creationPoints
        })

        return 7 + getFlawPoints(kindred) - (totalBackgroundPoints + totalLoresheetPoints)
    }

    return(
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
        <Tabs defaultValue="background" orientation={globals.isPhoneScreen?"vertical":"horizontal"}>
          <Stack spacing="0">
          <Text fz={globals.largeFontSize} ta={"center"}>
                Remaining Points: {getRemainingPoints(kindred)}
            </Text>
          <Center>
            <Tabs.List style={{ paddingBottom: "10px"}}>
              <Tabs.Tab value="background">Backgrounds</Tabs.Tab>
              <Tabs.Tab value="loresheet">Loresheets</Tabs.Tab>
            </Tabs.List>
          </Center>
  
          <Tabs.Panel value="background" pt="xs">
            <BackgroundFull kindred={kindred} setKindred={setKindred} type="creationPoints" />
          </Tabs.Panel>
  
          <Tabs.Panel value="loresheet" pt="xs">
            <LoresheetInputs kindred={kindred} setKindred={setKindred} venueData={venueData} type="creationPoints" />
          </Tabs.Panel>

          </Stack>
        </Tabs>
        
        <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen ? "15%" : "30%" }}>
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
                                onClick={nextStep}
                                disabled={getRemainingPoints(kindred) !== 0 || getTotalBackgroundPoints(kindred) > 7}
                            >
                                Next
                            </Button>
                        </Button.Group>
                    </Group>
                </Alert>
      </Center>
    )

}

export default BackgroundLoreTabs