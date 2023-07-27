import { Awakened } from '../data/Awakened'
import { Group, Text, Center, Stack, Accordion, Button, Table, useMantineTheme, NumberInput, Alert } from '@mantine/core'
import { getFilteredMerits, meritData, Merit, defineMeritRating, handleMeritChange } from '../data/Merits'
import { currentGnosisLevel } from '../data/Gnosis'
import { useState, useEffect } from 'react'
import { globals } from '../../../globals'

type MeritAssignerProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    nextStep: () => void
    backStep: () => void
    showInstructions: boolean
    setShowInstructions: (showInstruction: boolean) => void
}

const MeritAssigner = ({awakened, setAwakened, nextStep, backStep, showInstructions, setShowInstructions}: MeritAssignerProps) => {
    const filteredMerits = getFilteredMerits(awakened)
    const theme = useMantineTheme()
    const freebieMerits = [
      { name: 'Status (Order)' },
      { name: 'Status (Consilium)' }
    ];

    useEffect(() => {
      if (awakened.order !== 'Apostate') {
        const meritsToAdd = [
          { merit: 'High Speech' },
          { merit: 'Status (Order)' },
          { merit: 'Status (Consilium)' }
        ];
  
        const updatedMerits = [...awakened.merits];
  
        meritsToAdd.forEach((meritToAdd) => {
          const existingMerit = updatedMerits.find((m) => m.name === meritToAdd.merit);
  
          if (!existingMerit) {
            const merit = filteredMerits.find((m) => m.name === meritToAdd.merit);
            if (merit) {
              updatedMerits.push({ ...merit, freebiePoints: 1 });
            }
          }
        });
  
        setAwakened({...awakened, merits: updatedMerits});
      }
    }, [awakened.order, filteredMerits]);

     const getRemainingPoints = (awakened: Awakened): number => {
        let totalCreationPoints = 0;
      
        Object.values(awakened.merits).forEach((merit) => {
          totalCreationPoints += merit.creationPoints === 5 ? 6 : merit.creationPoints;
        });
      
        return 7 - (awakened.gnosis.creationPoints + totalCreationPoints);
      };


      const MeritInput = ( merit : Merit, type: any ) => {
        const getMeritPoints = (merit: Merit) => {
          const meritInfo = awakened.merits.find((m) => m.name === merit.name);
          const creation = meritInfo ? meritInfo.creationPoints : 0
          const freebie = meritInfo ? meritInfo.freebiePoints : 0
          const total = creation + freebie
          return total;
        };

        const { minCost, maxCost, orBool, plusBool} = defineMeritRating(merit.rating)

        const getStep = (merit: Merit): number => {
          if (minCost === maxCost) {
            return minCost;
          } else if (orBool && getMeritPoints(merit) < minCost) {
            return minCost;
          } else if (orBool && getMeritPoints(merit) > 0) {
            return maxCost;
          } else if (plusBool && getMeritPoints(merit) < minCost) {
            return minCost;
          } else {
            return 1;
          }
        };
        
        const step = getStep(merit)

        return (
            <div>
                <NumberInput
                  value={getMeritPoints(merit)}
                  min={type==="freebiePoints"?1:0}
                  max={type==="freebiePoints"?2:defineMeritRating(merit.rating).maxCost}
                  step={step}
                  onChange={(val:number) => {
                    handleMeritChange(awakened, setAwakened, merit, type, val)
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
          ? meritData
              .filter((merit) => merit.type.toLowerCase() === type.toLowerCase())
              .sort((a, b) => a.name.localeCompare(b.name))
          : filteredMerits
              .filter((merit) => merit.type.toLowerCase() === type.toLowerCase())
              .sort((a, b) => a.name.localeCompare(b.name));
        
      
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
                        {sortedMerits.map((merit) => {
                          const isFreebieMerit = freebieMerits.some((item) => item.name === merit.name);
                          return (
                            <tr key={`${merit.name} ${merit.type}`}>
                                <td style={{ minWidth: "150px" }}>
                                <Text>{merit.name}</Text>
                                <Text>{merit.rating}</Text>
                                <Text>{merit.prerequisites? `PreReq: ${merit.prerequisites}`: ''}</Text>
                                {isFreebieMerit? MeritInput(merit, "freebiePoints"):MeritInput(merit, "creationPoints")}
                                </td>
                                <td dangerouslySetInnerHTML={{ __html: `${merit.description}` }} />
                            </tr>
                          )})}
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
          <Alert w={globals.isSmallScreen ? "100%" : "600px"} style={{backgroundColor:"#996515", color: "white"}}>
            <Text fz={globals.smallFontSize}>Gnosis: {currentGnosis.level}</Text>
            <Text fz={globals.smallerFontSize}>3 merit points per dot of Gnosis</Text>
            <Button.Group>
              <Button style={{ margin: "5px" }} color="gray" disabled={getRemainingPoints(awakened) < 3} onClick={increaseGnosis}>Increase Gnosis</Button>
              <Button style={{ margin: "5px" }} color="gray" disabled={!canDecreaseGnosis} onClick={decreaseGnosis}>Decrease Gnosis</Button>
            </Button.Group>
          </Alert>
        )
      }

      const isPhoneScreen = globals.isPhoneScreen
      const isSmallScreen = globals.isSmallScreen
      const [showAllMerits, setShowAllMerits] = useState(false);

      const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
      };

      return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '100px' : '100px'}}>
            <Stack>
              <Alert color='gray'>
              <Text mt={"xl"} ta="center" fz="xl" fw={700}>Merits</Text>
              <Button color="gray" onClick={toggleInstructions}>
                    {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                </Button>
                    {showInstructions && (
                    <div>
                        <p>{`Merits are special capabilities or qualities that add individuality to your character. Some are intrinsic, developed early in life, others can be acquired through trial and error, training and other efforts.`}</p>
                        <p>{`Each merit has a number of dots associated with it. These dots represent the number of points that need to be spent to purchase it.`}</p>
                        <p>{`As a member of one of the five Pentacle Orders, you are taught the rudiments of Atlantean High Speech and gain that merit for free. You also gain up to two free dots of Status (Order) and Status (Consilium) to represent your rank in Mage society.`}</p>
                        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Gnosis</Text>
                        <p>{`A Mage's empowered will is measured by their Gnosis. As a Mage, you start with one dot in Gnosis by default.`}</p>
                        <p>{`The Gnosis trait is rated from 1 to 10 dots. It has the following game effects:`}</p>
                        <ul>
                          <li>{`Gnosis determines a character's potential to gain master of an Arcanum and successive Arcana. See "Arcana Mastery", M:ta pg. 76`}</li>
                          <li>{`A Mage roll Gnosis + Arcanum when casting improvised spells.`}</li>
                          <li>{`The higher a mage’s Gnosis, the more quickly they can cast elaborate or powerful spells.`}</li>
                          <li>{`Gnosis affects how many points of Mana a mage can spend in a single turn and how much Mana they can store.`}</li>
                          <li>{`A Mages can maintain only a certain number of active spells simultaneously, equal to Gnosis +3.`}</li>
                          <li>{`Mages can combine spells into a single casting, with the total number limited by Gnosis.`}</li>
                        </ul>
                        <p>{`You can spend 3 merit points here to purchase additional dots of Gnosis.`}</p>
                      </div>
                    )}
              </Alert>
              <Center>
              {createGnosisAssigner()}
              </Center>
              <Center>
                <Accordion w={globals.isSmallScreen ? "100%" : "600px"}>
                {
                    ["Mental merits", "Physical merits", "Social merits", "Mage merits", "Sanctum merits"].map((t) => createMeritAccordian(t, showAllMerits))
                }
                </Accordion>
            </Center>
          </Stack>

            <Alert color="gray" radius="xs" style={{padding:"0px", position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%"}}>
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
                  <Text fz={globals.smallerFontSize} style={{ margin: "10px"}}>Rote Points: 7/{getRemainingPoints(awakened)}</Text>
              </Button.Group>
            </Group>
            </Alert>
        </Center>
      )
      
}

export default MeritAssigner