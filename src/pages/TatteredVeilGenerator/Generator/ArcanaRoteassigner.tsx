import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { Stack, Button, Text, Tooltip, Card, Center, Grid, Image, NumberInput, Title, useMantineTheme, Table, Accordion, Alert, Group } from "@mantine/core";
import { ArcanaKey, arcanaDescriptions, arcanaKeySchema, arcana, getArcanaLevels } from "../../../data/TatteredVeil/types/Arcanum";
import { globals } from "../../../assets/globals";
import { Paths } from "../../../data/TatteredVeil/types/Path";
import { useState, useEffect } from 'react';
import { removeRote, roteRefs, Rote, roteData, getFilteredRotes, handleRoteChange, calculatePool, getRoteByName } from "../../../data/TatteredVeil/types/Rotes";

type ArcanaRoteAssignerProps = {
  awakened: Awakened,
  setAwakened: (awakened: Awakened) => void
  nextStep: () => void
  backStep: () => void
  showInstructions: boolean
  setShowInstructions: (showInstruction: boolean) => void
}

const ArcanaRoteAssigner = ({ awakened, setAwakened, nextStep, backStep, showInstructions, setShowInstructions }: ArcanaRoteAssignerProps) => {
  const theme = useMantineTheme()

  const c1 = "rgba(26, 27, 30, 0.90)"

  const rulingArcana = Paths[awakened.path].rulingArcana
  const inferiorArcana = Paths[awakened.path].inferiorArcana
  const otherArcana = arcana.filter((arcanaName) => !rulingArcana.includes(arcanaName));
  const [rotePoints, setRotePoints] = useState(6)

  const getRotePoints = () => {
    const startingPoints = 6;
    let dotsTotal = 0;

    Object.values(awakened.rotes).forEach((rote) => {
      let dots = rote.creationPoints;
      dotsTotal += dots;
    });

    let newTotal = startingPoints - dotsTotal;
    setRotePoints(newTotal);
  };

  const [learnableRotes, setLearnableRotes] = useState<Rote[]>(getFilteredRotes(awakened));

  useEffect(() => {
    // When the component mounts or whenever the awakened.arcana state changes,
    // update the learnableRotes state with the filtered rotes
    getRotePoints()
    setLearnableRotes(getFilteredRotes(awakened));
  }, [awakened]);

  const [firstRuling, secondRuling] = rulingArcana;
  const [rulingDots, setRulingDots] = useState<{ first: [ArcanaKey | string, number]; second: [ArcanaKey | string, number] }>({
    first: [firstRuling, awakened.arcana[firstRuling].creationPoints],
    second: [secondRuling, awakened.arcana[secondRuling].creationPoints]
  });

  const [isImageHovered, setIsImageHovered] = useState<{ [key in ArcanaKey]: boolean }>({
    death: false,
    fate: false,
    forces: false,
    life: false,
    matter: false,
    mind: false,
    prime: false,
    space: false,
    spirit: false,
    time: false
  });

  const checkTotal = (awakened: Awakened) => {
    const arcana = awakened.arcana;
    let total = 0;
    Object.keys(arcana).forEach((arcanum) => {
      const dots = arcana[arcanum as ArcanaKey].creationPoints;
      total += dots;
    });
    return total;
  };

  const handleArcanumCreationPointChange = (arcanum: ArcanaKey, newCreationPoints: number): void => {
    const updatedArcana = {
      ...awakened.arcana,
      [arcanum]: {
        ...awakened.arcana[arcanum],
        creationPoints: newCreationPoints
      }
    };

    const rulingArcana = Paths[awakened.path].rulingArcana;
    const [firstRuling, secondRuling] = rulingArcana;
    setRulingDots({
      first: [firstRuling, updatedArcana[firstRuling].creationPoints],
      second: [secondRuling, updatedArcana[secondRuling].creationPoints]
    });

    setAwakened({ ...awakened, arcana: updatedArcana, rotes: [] });
  };

  const countArcanaWithCreationPoints = () => {
    const arcanaValues = Object.values(awakened.arcana);
    const count = arcanaValues.reduce((accumulator, arcana) => {
      if (arcana.creationPoints > 0) {
        return accumulator + 1;
      }
      return accumulator;
    }, 0);

    return count;
  };

  const createArcanaPrompter = (awakened: Awakened) => {
    const levelsArray = getArcanaLevels(awakened)
    const isRulingSet =  ((rulingDots.first[1] !== 1 && rulingDots.first[1] !== 2) || (rulingDots.second[1] !== 2 && rulingDots.second[1] !== 3 && rulingDots.second[1] !== 2)) && ((rulingDots.second[1] !== 1 && rulingDots.second[1] !== 2) || (rulingDots.first[1] !== 2 && rulingDots.first[1] !== 3 && rulingDots.first[1] !== 2))
    const firstTwoSet = !(levelsArray[0] >= 2)
    const secondTwoSet = !(levelsArray[1] >= 2)
    const oneSet = !(levelsArray[2] >= 1)
    const freeSet = !(levelsArray[0] >= 3 || levelsArray[2] >= 2 || levelsArray[3] >= 1)

    const rulingStyle = isRulingSet ? { fontSize: globals.largeFontSize } : { fontSize: globals.smallFontSize, color: "grey" }
    const firstTwoStyle = firstTwoSet ? { fontSize: globals.largeFontSize } : { fontSize: globals.smallFontSize, color: "grey" }
    const secondTwoStyle = secondTwoSet ? { fontSize: globals.largeFontSize } : { fontSize: globals.smallFontSize, color: "grey" }
    const oneStyle = oneSet ? { fontSize: globals.largeFontSize } : { fontSize: globals.smallFontSize, color: "grey" }
    const freeStyle = freeSet ? { fontSize: globals.largeFontSize } : { fontSize: globals.smallFontSize, color: "grey" }

    return (
      <div>
        <Text style={rulingStyle} ta={"center"}>{isRulingSet ? ">" : ""} Assign 2 and 1 points to your Ruling Arcana</Text>
        <Text style={firstTwoStyle} ta={"center"}>{firstTwoSet ? ">" : ""} Assign 2 Points</Text>
        <Text style={secondTwoStyle} ta={"center"}>{secondTwoSet ? ">" : ""} Assign 2 Points</Text>
        <Text style={oneStyle} ta={"center"}>{oneSet ? ">" : ""} Assign 1 Point</Text>
        <Text style={freeStyle} ta={"center"}>{freeSet ? ">" : ""} Assign 1 Free Point</Text>

      </div>
    )
  }

  const createArcanaPicker = (arcanum: ArcanaKey, c2: string) => {
    const bgColor = theme.fn.linearGradient(0, c1, c2)
    const totalDots = checkTotal(awakened)
    const isRuling = rulingArcana.includes(arcanum);
    const isInferior = inferiorArcana.includes(arcanum)
    const isThreeAssigned = Object.values(awakened.arcana).some((arcana) => arcana.creationPoints === 3);
    const isTotalFive = totalDots === 5 && getArcanaLevels(awakened)[3] >= 1
    const isTotalSix = totalDots === 6;
    const isRulingSet = (((rulingDots.first[1] !== 1 && rulingDots.first[1] !== 2) || (rulingDots.second[1] !== 2 && rulingDots.second[1] !== 3 && rulingDots.second[1] !== 2)) && ((rulingDots.second[1] !== 1 && rulingDots.second[1] !== 2) || (rulingDots.first[1] !== 2 && rulingDots.first[1] !== 3 && rulingDots.first[1] !== 2)))
    const isCategoryCreationPointsZero = awakened.arcana[arcanum].creationPoints === 0;
    const isArcanaWithCreationPointsMoreThan4 = countArcanaWithCreationPoints() >= 4;

    const levelsArray = getArcanaLevels(awakened)
    const firstTwoSet = !(levelsArray[0] >= 2)
    const secondTwoSet = !(levelsArray[1] >= 2)
    const oneSet = !(levelsArray[2] >= 1)

    const isInferiorDisabled = (
      firstTwoSet || secondTwoSet || oneSet
    )

    const isDisabled =
      (!isRuling &&
        isCategoryCreationPointsZero &&
        (isRulingSet)) || (isArcanaWithCreationPointsMoreThan4 && isCategoryCreationPointsZero) || (!isRuling && totalDots === 6 && isCategoryCreationPointsZero)

    return (
      <Grid.Col key={arcanum} span={2}>
        <Tooltip
          multiline
          width={220}
          withArrow
          transitionProps={{ duration: 400 }} // Adjust the duration as needed
          label={arcanaDescriptions[arcanum].summary}
          position={globals.isPhoneScreen ? "bottom" : "top"}
          opened={isImageHovered[arcanum]}
        >
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            style={{ background: !isDisabled ? bgColor : `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${bgColor}` }}
          >
            <Card.Section>
              <Center>
                <Image
                  fit="contain"
                  withPlaceholder
                  src={arcanaDescriptions[arcanum].logo}
                  height={50}
                  width={50}
                  alt="order"
                  style={{ filter: "brightness(0)" }}
                  onMouseEnter={() => setIsImageHovered({ ...isImageHovered, [arcanum]: true })}
                  onMouseLeave={() => setIsImageHovered({ ...isImageHovered, [arcanum]: false })}
                />
              </Center>
              <Center>
                <Title h={30} size="sm" color="dimmed" ta="center">
                  {arcanaDescriptions[arcanum].name} {isInferior ? "Inferior" : isRuling ? "Ruling" : ""}
                </Title>
              </Center>
              <NumberInput
                key={`${arcanum}`}
                min={0}
                max={isTotalSix ? 0 : isRulingSet && !isRuling ? 0 : isThreeAssigned || isTotalFive ? 2 : isInferior ? 1 : 3}
                value={awakened.arcana[arcanum].creationPoints}
                onChange={(val: number) =>
                  handleArcanumCreationPointChange(arcanum, val)
                }
                disabled={isInferior?isInferiorDisabled||isDisabled:isDisabled}
              >
              </NumberInput>
            </Card.Section>
          </Card>
        </Tooltip>
      </Grid.Col>
    );
  };

  const getColorByArcanum = (arcanum: ArcanaKey) => {
    return arcanaDescriptions[arcanum].color;
  };

  const createRoteAccordian = (arcanum: ArcanaKey, showAllRotes: Boolean) => {

    const filteredRotes = showAllRotes ? (roteData.filter((rote) => rote.arcanum.toLowerCase() === arcanum.toLowerCase())) : (learnableRotes.filter((rote) => rote.arcanum.toLowerCase() === arcanum.toLowerCase()))

    filteredRotes.sort((a, b) => {
      if (a.level !== b.level) {
        return a.level - b.level;
      }
      return a.name.localeCompare(b.name);
    });

    const handleSelect = (rote: Rote) => {
      const roteRef = roteRefs.find((r) => r.name === rote.name)
      if (roteRef && !awakened.rotes.some(existingRote => existingRote.name === rote.name)) {
        const roteLevel = rote.level;
        handleRoteChange(awakened, setAwakened, roteRef, "creationPoints", roteLevel);
      }
    }

    const handleDeselect = (rote: Rote) => {
      const roteRef = roteRefs.find((r) => r.name === rote.name)
      if (roteRef) {
        removeRote(awakened, setAwakened, roteRef)
      }
    };

    const isPhoneScreen = globals.isPhoneScreen

    return (
      <div>
        <Accordion.Item value={arcanum}>
          <Accordion.Control icon={<Image height={20} width={20} src={arcanaDescriptions[arcanum].logo} />} style={{ color: "white", backgroundColor: arcanaDescriptions[arcanum]?.color ?? "white" }}>{arcanum.toUpperCase()}</Accordion.Control>
          <Accordion.Panel>
            {isPhoneScreen ? (
              <Table>
                <tbody>
                  {filteredRotes.map((rote) => {
                    return (
                      <>
                        <tr>
                          <td style={{ backgroundColor: arcanaDescriptions[arcanum]?.color ?? "white" }}>
                            <Group grow>
                              <Stack spacing="xs" align="flex-start">
                                <Text fz={globals.smallerFontSize} style={{ color: "white" }}>{rote.name}</Text>
                                <Image
                                  fit="contain"
                                  withPlaceholder
                                  src={arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey].logo}
                                  height={30}
                                  width={30}
                                  alt="order"
                                  style={{ filter: "brightness(0)" }}
                                />
                                <p style={{ color: "white" }}>{rote.arcanum} {rote.level} {rote.otherArcana ? `+ ${rote.otherArcana}` : ""}</p>
                                <i style={{ color: "white" }}>{rote.source}</i>
                              </Stack>

                              {awakened.rotes.some((selectedRote) => (selectedRote.name === rote.name && getRoteByName(selectedRote.name).arcanum === rote.arcanum)) ? null :
                                rotePoints < rote.level || !learnableRotes.some(lr => lr.name === rote.name) ? <Button disabled>Select</Button> :
                                  (
                                    <Button color="gray" onClick={() => { handleSelect(rote); getRotePoints(); }}>Select</Button>

                                  )}
                              {awakened.rotes.some((selectedRote) => (selectedRote.name === rote.name && getRoteByName(selectedRote.name).arcanum === rote.arcanum)) && (
                                <Button color="red" onClick={() => { handleDeselect(rote); getRotePoints(); }}>Deselect</Button>
                              )}
                            </Group>
                          </td>
                        </tr>
                        <tr key={`${rote.name} ${rote.arcanum} phone`}>

                          <td dangerouslySetInnerHTML={{ __html: `${rote.description} <p>Rote Pool: ${rote.rotePool}  (${calculatePool(rote.rotePool, awakened)})</p>` }} />
                        </tr>
                      </>
                    )
                  })}
                </tbody>
              </Table>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Rote</th>
                    <th>Description</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRotes.map((rote) => (
                    <tr key={`${rote.name} ${rote.arcanum} desktop`}>
                      <td style={{ backgroundColor: arcanaDescriptions[arcanum]?.color ?? "white", minWidth: "150px" }}>
                        <Text fz={globals.smallerFontSize} style={{ color: "white" }}>{rote.name}</Text>
                        <Image
                          fit="contain"
                          withPlaceholder
                          src={arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey].logo}
                          height={30}
                          width={30}
                          alt="order"
                          style={{ filter: "brightness(0)" }}
                        />
                        <p style={{ color: "white" }}>{rote.arcanum} {rote.level} {rote.otherArcana ? `+ ${rote.otherArcana}` : ""}</p>
                        <i style={{ color: "white" }}>{rote.source}</i>
                      </td>
                      <td dangerouslySetInnerHTML={{ __html: `${rote.description} <p>Rote Pool: ${rote.rotePool}  (${calculatePool(rote.rotePool, awakened)})</p>` }} />
                      <td>
                        {awakened.rotes.some((selectedRote) => (selectedRote.name === rote.name && getRoteByName(selectedRote.name).arcanum === rote.arcanum)) ? null :
                          rotePoints < rote.level || !learnableRotes.some(lr => lr.name === rote.name) ? <Button disabled>Select</Button> :
                            (
                              <Button onClick={() => { handleSelect(rote); getRotePoints(); }}>Select</Button>
                            )}
                        {awakened.rotes.some((selectedRote) => (selectedRote.name === rote.name && getRoteByName(selectedRote.name).arcanum === rote.arcanum)) && (
                          <Button color="red" onClick={() => { handleDeselect(rote); getRotePoints(); }}>Deselect</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Accordion.Panel>
        </Accordion.Item>
      </div>
    )
  }

  const isPhoneScreen = globals.isPhoneScreen
  const isSmallScreen = globals.isSmallScreen
  const knownArcana = Object.keys(awakened.arcana).filter((arcanaKey) => {
    const arcana = awakened.arcana[arcanaKey as ArcanaKey];
    return arcana.creationPoints > 0;
  });
  const [showAllRotes, setShowAllRotes] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };


  arcana.sort((a, b) => {
    return a.localeCompare(b);
  });

  return (
    <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '60px', paddingBottom: globals.isPhoneScreen ? '120px' : '60px' }}>
      <Stack mt={"xl"} align="center" spacing="xl">

        <Alert color="gray">
          <Stack>
            <Text mt={"xl"} ta="center" fz="xl" fw={700} style={{ marginTop: "0px" }}>Arcana</Text>
            {showInstructions && (
              <div>
                <p>{`
                    Arcana are the ten spheres of magical influence. By improving their knowledge of the Arcana, a mage improves their skill at altering reality.  
                  `}</p>
                <p>{`
                    A mages Ruling Arcana, and the limits of their understanding, is determined by the Path.
                  `}</p>
                <p>{`
                    A mage can learn up to the fifth dot in their Ruling Arcana. Without aid, they can learn up to the fourth dot in other Arcana. Of their Inferior Arcanum, in which a mage is particularly weak, they can only learn the first two dots before needing assistance. Assistance comes from mages of other Paths with ruling Arcnaa of which the user wishes to learn.
                  `}</p>
                <p>
                  {`At creation, you gain 2 dots in one Arcanum, 2 dots in a second Arcanum and 1 dot in a third Arcanum. Two of these Arcana must be in your character's Path's Ruling Arcana. You can only have up to one point in your character's Path's Inferior Arcana. Finally you gain 1 dot you can place anywhere.`}
                </p>
              </div>
            )}
            <Center>
              <Button variant="outline" color="gray" onClick={toggleInstructions}>
                {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
              </Button>
            </Center>
          </Stack>
        </Alert>
        <Center>
          {createArcanaPrompter(awakened)}
        </Center>

        <Grid columns={isPhoneScreen ? 4 : 5} grow m={0}>
          {
            rulingArcana.map((o) => arcanaKeySchema.parse(o)).map((arcanum) => createArcanaPicker(arcanum, getColorByArcanum(arcanum)))
          }
        </Grid>
        <Grid columns={isPhoneScreen ? 4 : 8} grow m={0}>
          {
            otherArcana.map((o) => arcanaKeySchema.parse(o)).map((arcanum) => createArcanaPicker(arcanum, getColorByArcanum(arcanum)))
          }
        </Grid>
        {countArcanaWithCreationPoints() > 0 || showAllRotes ?
          <Alert color="gray">
            <Stack>
              <Text mt={"xl"} ta="center" fz="xl" fw={700} style={{ marginTop: "0px" }}>Rotes</Text>
              {showInstructions && (
                <div>
                  <p>{`Rotes are magical feats simplified into a recipe. They provide an easier and safer way for mages to perform magic compared to improvisational spells. `}</p>
                  <p>{`You may purchase up to 6 points of rotes. A rote's cost is equal to it's Arcanum rating. No rote can be rated higher than your character's level in that Arcanum. `}</p>
                </div>
              )}
              <Center>
                <Button variant="outline" color="gray" onClick={toggleInstructions}>
                  {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                </Button>
              </Center>
            </Stack>
          </Alert>
          : <></>}
          <Center>
            <Accordion w={globals.isSmallScreen ? "100%" : "600px"}>
              {showAllRotes ? (
                // Render all rotes
                (arcana as ArcanaKey[]).map((a) => createRoteAccordian(a, showAllRotes))
              ) : (
                // Render filtered rotes based on knownArcana
                (knownArcana as ArcanaKey[]).map((a) => createRoteAccordian(a, showAllRotes))
              )}
            </Accordion>
          </Center>
      </Stack>
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
              onClick={nextStep}
              disabled={rotePoints !== 0}
            >
              Next
            </Button>
            {globals.isPhoneScreen ? <></> :
              <Button
                color="gray"
                style={{ margin: "5px" }}
                onClick={() => setShowAllRotes((prevShowAllRotes) => !prevShowAllRotes)}
              >
                {showAllRotes ? "Hide All" : "Show All"}
              </Button>
            }
            <Text fz={globals.smallerFontSize} style={{ margin: "10px" }}>Rote Points: 6/{rotePoints}</Text>
          </Button.Group>
        </Group>
      </Alert>
    </Center>
  )
}

export default ArcanaRoteAssigner