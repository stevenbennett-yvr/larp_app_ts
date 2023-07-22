import { Awakened } from '../data/Awakened'
import { Group, Card, Text, Center, Stack, Accordion, Button, Table, useMantineTheme, NumberInput } from '@mantine/core'
import { getFilteredMerits, meritData, Merit, defineMeritRating } from '../data/Merits'
import { currentGnosisLevel } from '../data/Gnosis'
import { useState } from 'react'
import { globals } from '../../../globals'

type MeritAssignerProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    nextStep: () => void
    backStep: () => void
}

const MeritAssigner = ({awakened, setAwakened, nextStep, backStep}: MeritAssignerProps) => {
    //const [ selectedMerits, setSelectedMerits ] = useState(awakened.merits);
    const { filteredMerits } = getFilteredMerits(awakened)
    const theme = useMantineTheme()

     const getRemainingPoints = (awakened: Awakened): number => {
        let totalCreationPoints = 0;
      
        Object.values(awakened.merits).forEach((merit) => {
          totalCreationPoints += merit.creationPoints === 5 ? 6 : merit.creationPoints;
        });
      
        return 7 - (awakened.gnosis.creationPoints + totalCreationPoints);
      };

/*     useEffect(() => {
        if (awakened.order !== 'Apostate') {
          const meritsToAdd = [
            { merit: 'High Speech' },
            { merit: 'Status (Order)' },
            { merit: 'Status (Consilium)' }
          ];
    
          const updatedMerits = [...selectedMerits];
    
          meritsToAdd.forEach((meritToAdd) => {
            const existingMerit = updatedMerits.find((m) => m.name === meritToAdd.merit);
    
            if (!existingMerit) {
              const merit = filteredMerits.find((m) => m.name === meritToAdd.merit);
              if (merit) {
                updatedMerits.push({ ...merit, freebiePoints: 1 });
              }
            }
          });
    
          setSelectedMerits(updatedMerits);
        }
      }, [awakened.order, filteredMerits, selectedMerits]); */

      const removeInvalidMerits = (filteredMerits: Merit[]): void => {
        const validMerits = awakened.merits.filter((merit) =>
          filteredMerits.some((fm) => fm.name !== merit.name)
        );
      };

      const MeritInput = ( merit : Merit ) => {
        const getMeritCreationPoints = (merit: Merit) => {
          const meritInfo = awakened.merits.find((m) => m.name === merit.name);
          const total = meritInfo ? meritInfo.creationPoints : 0;
          return total;
        };

        const { minCost, maxCost, orBool, plusBool} = defineMeritRating(merit.rating)

        const handleMeritChange = (merit: Merit, newCreationPoints: number): void => {
          const existingMerit = awakened.merits.find((m) => m.name === merit.name);
  
          if (existingMerit) {
            if (newCreationPoints === 0) {
              const updatedMerits = awakened.merits.filter((m) => m.name !== merit.name);
              setAwakened({ ...awakened, merits: updatedMerits });
            } else {
              const updatedMerits = awakened.merits.map((m) =>
              m.name === merit.name ? { ...m, creationPoints: newCreationPoints } : m
            ) ;
            setAwakened({ ...awakened, merits: updatedMerits });
          }} else {
            setAwakened({
              ...awakened,
              merits: [...awakened.merits, { ...merit, creationPoints: newCreationPoints }],
            });
          }
        };

        const getStep = (merit: Merit): number => {
          if (minCost === maxCost) {
            return minCost;
          } else if (orBool && getMeritCreationPoints(merit) < minCost) {
            return minCost;
          } else if (orBool && getMeritCreationPoints(merit) > 0) {
            return maxCost;
          } else if (plusBool && getMeritCreationPoints(merit) < minCost) {
            return minCost;
          } else {
            return 1;
          }
        };
        
        const step = getStep(merit)

        return (
            <div>
                <NumberInput
                  value={getMeritCreationPoints(merit)}
                  min={0}
                  max={defineMeritRating(merit.rating).maxCost}
                  step={step}
                  onChange={(val:number) => {
                    handleMeritChange(merit, val)
                    removeInvalidMerits(filteredMerits)
                  }}
                />
            </div>
        )

      };
    
      const createMeritAccordian = (type: string, showAllMerits: Boolean) => {
        
        let bgc = ""
        switch (type) {
            case "Mental merits":
              bgc = theme.fn.rgba(theme.colors.blue[8], 0.90)
              break;
            case "Physical merits":
              bgc = theme.fn.rgba(theme.colors.red[8], 0.90)
              break;
            case "Social merits":
              bgc =theme.fn.rgba(theme.colors.grape[8], 0.90)
              break;
            case "Mage merits":
              bgc = theme.fn.rgba(theme.colors.green[9], 0.90)
              break;
            case "Sanctum merits":
              bgc = theme.fn.rgba(theme.colors.gray[6], 0.90)
              break;
          }

        const sortedMerits = showAllMerits
          ? meritData.filter((merit) => merit.type.toLowerCase() === type.toLowerCase())
          : filteredMerits.filter((merit) => merit.type.toLowerCase() === type.toLowerCase());
      
        return (
          <div>
            <Accordion.Item value={type}>
                <Accordion.Control style={{ color: "white", backgroundColor: bgc }}>{type.toUpperCase()}</Accordion.Control>
                <Accordion.Panel>
                    <Table>
                    <thead>
                        <tr>
                        <th>Merit</th>
                        <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMerits.map((merit) => (
                        <tr key={`${merit.name} ${merit.type}`}>
                            <td style={{ minWidth: "150px" }}>
                            <Text>{merit.name} {merit.rating}</Text>
                            <Text>{merit.prerequisites? `PreReq: ${merit.prerequisites}`: ''}</Text>
                            {MeritInput(merit)}
                            </td>
                            <td dangerouslySetInnerHTML={{ __html: `${merit.description}` }} />
                        </tr>
                        ))}
                    </tbody>
                    </Table>
                </Accordion.Panel>
            </Accordion.Item>
          </div>
        );
      };
      
      const createGnosisAssigner = () => {

        const currentGnosis = currentGnosisLevel(awakened);
        const canDecreaseGnosis = currentGnosis.level > 1;
      
        const increaseGnosis = () => {
          if (getRemainingPoints(awakened) >= 3) {
            const updatedFormData = { ...awakened };
            updatedFormData.gnosis.creationPoints += 3;
            setAwakened(updatedFormData);
          }
        };
      
        const decreaseGnosis = () => {
          if (canDecreaseGnosis) {
            const updatedFormData = { ...awakened };
            updatedFormData.gnosis.creationPoints -= 3;
            setAwakened(updatedFormData);
          }
        };
      
        return (
          <Card style={{backgroundColor:"#996515", color: "white"}}>
            <Text fz={globals.smallFontSize}>Gnosis: {currentGnosis.level}</Text>
            <Text fz={globals.smallerFontSize}>3 merit points per dot of Gnosis</Text>
            <Button.Group>
              <Button style={{ margin: "5px" }} color="gray" disabled={getRemainingPoints(awakened) < 3} onClick={increaseGnosis}>Increase Gnosis</Button>
              <Button style={{ margin: "5px" }} color="gray" disabled={!canDecreaseGnosis} onClick={decreaseGnosis}>Decrease Gnosis</Button>
            </Button.Group>
          </Card>
        )
      }

      const isPhoneScreen = globals.isPhoneScreen
      const isSmallScreen = globals.isSmallScreen
      const [showAllMerits, setShowAllMerits] = useState(false);

      return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : undefined, paddingBottom: globals.isPhoneScreen ? '100px' : '100px'}}>
            <Stack>
              {createGnosisAssigner()}
            <Accordion w={globals.isSmallScreen ? "100%" : "600px"}>
            {
                ["Mental merits", "Physical merits", "Social merits", "Mage merits", "Sanctum merits"].map((t) => createMeritAccordian(t, showAllMerits))
            }
            </Accordion>
                  <Group style={{ position: "fixed", bottom: "0px",right: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%" }}>
                    <Card>
                      <Text style={{ margin: "0px" }}>Rote Points: 7/{getRemainingPoints(awakened)}</Text>
                    </Card>
                  </Group>
                <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%"}}>
                    <Button
                        style={{ margin: "5px" }}
                        color="gray"
                        onClick={backStep}
                    >
                        Back
                    </Button>
                    <Button
                        disabled={getRemainingPoints(awakened) > 0}
                        style={{ margin: "5px" }}
                        color="gray"
                        onClick={nextStep}
                    >
                        Next
                    </Button>
                    <Button
                    color="gray"
                    style={{ margin: "5px" }}
                    onClick={() => setShowAllMerits((prevShowAllMerits) => !prevShowAllMerits)}
                  >
                    {showAllMerits ? "Hide All" : "Show All"}
                  </Button>
                  </Button.Group>
            </Stack>
        </Center>
      )
      
}

export default MeritAssigner