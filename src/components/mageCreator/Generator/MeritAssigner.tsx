import { Awakened } from '../data/Awakened'
import { Text, Center, Stack, Accordion, Button, Table, useMantineTheme, NumberInput } from '@mantine/core'
import { getFilteredMerits, meritData, Merit, currentMeritLevel } from '../data/Merits'
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

    const getNumberBelow = (array: any, num: number) => {
        for (let i = 1; i < array.length; i++) {
          if (num < array[i]) {
            return array[i-1];
          }
        }
        return array[array.length-1];
      };


/*     const getRemainingPoints = (awakened: Awakened): number => {
        let totalCreationPoints = 0;
      
        Object.values(awakened.merits).forEach((merit) => {
          totalCreationPoints += merit.creationPoints === 5 ? 6 : merit.creationPoints;
        });
      
        return 7 - (awakened.gnosis.creationPoints + totalCreationPoints);
      }; */

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

/*    const removeInvalidMerits = (selectedMerits: Merit[], filteredMerits: Merit[]) => {
        const validMerits = selectedMerits.filter((merit) =>
            filteredMerits.some((fm) => fm.name === merit.name)
        );
        return validMerits;
    }

     const handleFreebiePointsChange = (merit: Merit) => {
        setSelectedMerits((prevMerits) => {
          const existingMeritIndex = prevMerits.findIndex((m) => m.name === merit.name);

          if (existingMeritIndex >= 0) {
            const updatedMerits = [...prevMerits];
            updatedMerits[existingMeritIndex] = merit;
            const validMerits = removeInvalidMerits(updatedMerits, filteredMerits);
            return validMerits;
          } else {
            const validMerits = removeInvalidMerits(prevMerits, filteredMerits);
            return [...validMerits, merit];      }
        });
      }; */

      const handleMeritCreationPointChange = (value: any, merit: Merit) => {
        const merits = [...awakened.merits];
        let { totalXpNeeded, pastXpNeeded } = currentMeritLevel(merit);
        let oldCreationPoints = merit.creationPoints;
        merit.creationPoints = parseInt(value) > oldCreationPoints ? totalXpNeeded : getNumberBelow(pastXpNeeded, parseInt(value));
        setAwakened({ ...awakened, merits });
      }

      const meritInput = ( merit : Merit ) => {
        const getMeritCreationPoints = (merit: Merit) => {
          const meritInfo = awakened.merits.find((m) => m.name === merit.name);
          const total = meritInfo ? meritInfo.creationPoints : 0;
          return total;
        };

        return (
            <div>
                <NumberInput
                    value={getMeritCreationPoints(merit)}
                    onChange={(value) =>
                    handleMeritCreationPointChange(
                        value,
                        merit,
                    )}
                    min={0}
                    max={5}
                    onWheel={(event) => {
                        event.currentTarget.blur();
                        event.preventDefault();
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
        /* "Mental merits" - #6D9EEB
        "Physical merits" - #A0DDFF
        "Social merits" - #FFC48C
        "Mage merits" - #FFA07A
        "Sanctum merits" - #D6A5C9 */

        const sortedMerits = showAllMerits
          ? meritData.filter((merit) => merit.type.toLowerCase() === type.toLowerCase())
          : filteredMerits.filter((merit) => merit.type.toLowerCase() === type.toLowerCase());
      
        return (
          <div>
            <Accordion.Item value={type} key={type} >
                <Accordion.Control style={{ color: "white", backgroundColor: bgc }}>{type}</Accordion.Control>
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
                            {meritInput(merit)}
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
      

      const isPhoneScreen = globals.isPhoneScreen
      const isSmallScreen = globals.isSmallScreen
      const [showAllMerits, setShowAllMerits] = useState(false);

      return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : undefined, paddingBottom: globals.isPhoneScreen ? '100px' : '100px'}}>
            <Stack>
                <Text>This is a test</Text>
            <Accordion w={globals.isSmallScreen ? "100%" : "600px"}>
            {
                ["Mental merits", "Physical merits", "Social merits", "Mage merits", "Sanctum merits"].map((t) => createMeritAccordian(t, showAllMerits))
            }
            </Accordion>

                <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%"}}>
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