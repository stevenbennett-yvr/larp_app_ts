//technical imports
import React, { useState, forwardRef, useEffect } from "react";
import { useMantineTheme, Alert, Avatar, Button, Card, Center, Grid, Group, Image, Input, Select, Stack, Table, Text, Accordion } from "@mantine/core";
import { globals } from "../../../globals";

//data imports
import { Awakened } from "../data/Awakened";
import { Paths } from "../data/Path";
import { Orders } from "../data/Order";
import { AttributeCategory, findMaxAttribute, handleXpAttributeChange, AttributeNames, currentAttributeLevel } from "../data/Attributes";
import { SkillCategory, removeSpeciality, addSpeciality, findMaxSkill, handleXpSkillChange, SkillNames, currentSkillLevel} from "../data/Skills"
import { arcanaKeySchema, ArcanaKey, arcana, arcanaDescriptions, currentArcanumLevel, findMaxArcana, handleArcanumChange } from "../data/Arcanum";
import { roteData, Rote, getFilteredRotes, handleRoteChange, calculatePool } from "../data/Rotes";
import { meritData, getFilteredMerits, handleMeritChange, Merit, defineMeritRating, currentMeritLevel, findMaxMerit, handleXpMeritChange } from "../data/Merits";
import { currentGnosisLevel, handleGnosisChange, findMaxGnosis, Gnoses } from "../data/Gnosis";
import { handleWisdomChange, currentWisdomLevel, Wisdoms, findMaxWisdom } from "../data/Wisdom";
import { currentExperience } from "../data/Experience"
import ExperienceAside from "./components/experienceAside";

type AwakenedSheetProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    handleUpdate: () => void
    setShowRetire: any
}

const AwakenedSheet = ({awakened, setAwakened, handleUpdate, setShowRetire}: AwakenedSheetProps) => {

    const topSection = () => {
        return(
            <Grid columns={9}>
                <Grid.Col span={3} style={{ borderRight: "1px solid #ccc" }}>
                    <Center>
                        <Avatar
                            src={awakened.background.profilePic}
                            size={150}
                            style={{
                                backgroundImage: `linear-gradient(to bottom right, ${Paths[awakened.path].color}, ${Orders[awakened.order].color})`,
                            }}
                        />
                    </Center>
                </Grid.Col>
                <Grid.Col span={3} style={{ borderRight: "1px solid #ccc" }}>
                    <Stack>
                        <Text>Shadow Name: {awakened.name}</Text>
                        <Text>Concept: {awakened.concept}</Text>
                        <Group>
                            <Text>Order: {awakened.order}</Text>
                            <Image
                            fit="contain"
                            height={40}
                            width={40}
                            src={Orders[awakened.order].rune}
                            style={{
                                opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                            }}
                            />
                        </Group>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={3} >
                    <Stack>
                        <Text>Virtue: {awakened.virtue}</Text>
                        <Text>Vice: {awakened.vice}</Text>
                        <Group>
                            <Text>Path: {awakened.path}</Text>
                            <Image
                                fit="contain"
                                height={40}
                                width={40}
                                src={Paths[awakened.path].rune}
                                style={{
                                    opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                                  }}
                            />
                        </Group>
                    </Stack>
                </Grid.Col>
            </Grid>
        )
    }

    //OHTER SECTION

    const otherSection = () => {
        const dexterityLevel = currentAttributeLevel(awakened, 'dexterity').level;
        const strengthLevel = currentAttributeLevel(awakened, 'strength').level;
        const fleetOfFootMerit = awakened.merits.find(merit => merit.name === 'Fleet of Foot');
        const fleetOfFootLevel = fleetOfFootMerit ? currentMeritLevel(fleetOfFootMerit).level : 0;
        const calculatedSpeed = dexterityLevel + strengthLevel + 5 + fleetOfFootLevel;
        const calculateDefense = Math.min(currentAttributeLevel(awakened, 'dexterity').level, currentAttributeLevel(awakened, 'wits').level)

        const fastReflexMerit = awakened.merits.find(merit => merit.name === 'Fast Reflexes');
        const fastReflexLevel = fastReflexMerit ? currentMeritLevel(fastReflexMerit).level : 0;
        const calculateInit = currentAttributeLevel(awakened, 'dexterity').level + currentAttributeLevel(awakened, 'composure').level + fastReflexLevel

        return (
            <Center>
            <Table striped withBorder style={{ maxWidth: "400px" }}>
            <thead>
                <tr>
                <th>Size</th>
                <th>Speed</th>
                <th>Defense</th>
                <th>Init Mod</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td style={{ textAlign: 'center' }}>
                    {awakened.merits.some(merit => merit.name === "Giant") ? 6 : 5}
                </td>
                <td style={{ textAlign: 'center' }}>
                    {calculatedSpeed}
                </td>
                <td style={{ textAlign: 'center' }}>
                    {calculateDefense}
                </td>
                <td style={{ textAlign: 'center' }}>
                    {calculateInit}
                </td>
                </tr>
            </tbody>
            </Table>
            </Center>
        )
    }


    //ATTRIBUTE SECTION

    const orderedCategories = ['mental', 'physical', 'social'];
    const orderedAttributes = {
      'mental': ['intelligence', 'wits', 'resolve'],
      'physical': ['strength', 'dexterity', 'stamina'],
      'social': ["presence", 'manipulation', 'composure']
    } 
    const attributeXpInputs = orderedCategories.map((category) => {
        let categoryKey = category as AttributeCategory
        const attributesInfo = awakened.attributes[categoryKey]
        const orderedAttributesForCategory = orderedAttributes[categoryKey];

        return (
        <Grid.Col 
            span={globals.isPhoneScreen ? 8 : 4} 
            key={`${category} Attributes`}
        >
            <Text fs="italic" fw={700} ta="center">
            {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
            <hr />
            {Object.entries(attributesInfo)
                .sort(([a], [b]) => orderedAttributesForCategory.indexOf(a) - orderedAttributesForCategory.indexOf(b))
                .map(([attribute, attributeInfo]) => {
            const attributeName = attribute as AttributeNames;
            const { level, totalXpNeeded } = currentAttributeLevel(awakened, attribute);
            return (
                <Center>
                <Group key={`${attribute} input`}>
                    <Input.Wrapper 
                        label={`${attribute.charAt(0).toUpperCase() + attribute.slice(1)} ${level}`}
                        description={`Total XP for Next: ${totalXpNeeded}`}
                        >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            onClick={() => handleXpAttributeChange(awakened, setAwakened, attributeName, attributeInfo.experiencePoints - 1)}
                        >
                            -
                        </Button>
                        <Input
                            style={{ width: '60px', margin: '0 8px' }}
                            type="number"
                            key={`${category}-${attribute}`}
                            min={0}
                            max={findMaxAttribute(awakened, attribute)}
                            value={attributeInfo.experiencePoints}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = Number(e.target.value);
                            handleXpAttributeChange(awakened, setAwakened, attributeName, value);
                            }}
                        />
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            disabled={findMaxAttribute(awakened, attribute) === attributeInfo.experiencePoints}
                            onClick={() => handleXpAttributeChange(awakened, setAwakened, attributeName, attributeInfo.experiencePoints + 1)}
                        >
                            +
                        </Button>
                        </div>
                    </Input.Wrapper>
                </Group>
                </Center>
            );
            })}
        </Grid.Col>
        );
    });

    //SKILL SECTION

    const [specialitiesState, setSpecialitiesState] = useState<{ [key in SkillNames]?: string }>({});

    const skillXpInputs = orderedCategories.map((category) => {
        let categoryKey = category as SkillCategory
        const skillsInfo = awakened.skills[categoryKey]

        return (
        <Grid.Col span={globals.isPhoneScreen ? 8 : 4} key={`${category} Skills`}>
            <Text fs="italic" fw={700} ta="center">
            {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
            <hr />
            {Object.entries(skillsInfo)
                .sort(([skillA], [skillB]) => skillA.localeCompare(skillB))
                .map(([skill, skillInfo]) => {
                const skillName = skill as SkillNames;
                const { level, totalXpNeeded } = currentSkillLevel(awakened, skill);
                const specialities = skillInfo.specialities.map((spec) => spec.name);
                const selectedSpeciality = specialitiesState[skillName];

            return (
                <Center style={{ paddingBottom: '5px'}}>
                    <Alert color="gray">
                    <Stack>
                        <Group key={`${skill} input`}>
                            <Input.Wrapper 
                            label={`${skillInfo.roteSkill ? '🔷' : '☐'} ${skill.charAt(0).toUpperCase() + skill.slice(1)} ${level}`}
                            description={`Total XP for Next: ${totalXpNeeded}`}
                            >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                size="xs"
                                variant="outline"
                                color="gray"
                                onClick={() => handleXpSkillChange(awakened, setAwakened, skillName, skillInfo.experiencePoints - 1)}
                                >
                                -
                                </Button>
                                <Input
                                style={{ width: '60px', margin: '0 8px' }}
                                type="number"
                                key={`${category}-${skill}`}
                                min={0}
                                max={findMaxSkill(awakened, skill)}
                                value={skillInfo.experiencePoints}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = Number(e.target.value);
                                    handleXpSkillChange(awakened, setAwakened, skillName, value);
                                }}
                                />
                                <Button
                                size="xs"
                                variant="outline"
                                color="gray"
                                disabled={findMaxSkill(awakened, skill) === skillInfo.experiencePoints}
                                onClick={() => handleXpSkillChange(awakened, setAwakened, skillName, skillInfo.experiencePoints + 1)}
                                >
                                +
                                </Button>
                            </div>
                            </Input.Wrapper>
                        </Group>
                        <Group>
                        <Select
                                style={{ width: "70%", margin: '0 8px' }}
                                data={specialities}
                                placeholder={`${skill.charAt(0).toUpperCase() + skill.slice(1)} Specialities`}
                                searchable
                                creatable
                                allowDeselect 
                                getCreateLabel={(query) => `+ Create ${query}`}
                                value={selectedSpeciality}
                                onChange={(value) => {
                                    // Set the selected speciality for the corresponding skill
                                    setSpecialitiesState((prevSpecialitiesState) => ({
                                    ...prevSpecialitiesState,
                                    [skillName]: value as string,
                                    }));
                                }}
                                onCreate={(query) => {
                                    addSpeciality(awakened, setAwakened, skillName, query, 'experiencePoints');
                                    return query;
                                }}
                                />
                                {selectedSpeciality && !skillInfo.specialities.some((spec) => spec.name === selectedSpeciality && spec.creationPoints > 0) && (
                                <Button
                                    size="xs"
                                    variant="outline"
                                    color="blue"
                                    onClick={() => {
                                    // Remove the selected speciality
                                    removeSpeciality(awakened, setAwakened, skillName, selectedSpeciality)
                                    setSpecialitiesState((prevSpecialitiesState) => ({
                                        ...prevSpecialitiesState,
                                        [skillName]: '',
                                    }));
                                    }}
                                >
                                    X
                                </Button>
                                )}
                        </Group>
                    </Stack>
                    </Alert>
                </Center>
            );
            })}
        </Grid.Col>
        );
    });
      
    // ARCANA SECTION

    const theme = useMantineTheme()
    const c1 = "rgba(26, 27, 30, 0.90)"
    const rulingArcana = Paths[awakened.path].rulingArcana
    const inferiorArcana = Paths[awakened.path].inferiorArcana
    const otherArcana = arcana.filter((arcanaName) => !rulingArcana.includes(arcanaName));



    const arcanumXpInputs = (arcanum: ArcanaKey) => {
        const c2 = arcanaDescriptions[arcanum].color
        const bgColor = theme.fn.linearGradient(0, c1, c2)
        const isRuling = rulingArcana.includes(arcanum); 
        const isInferior =  inferiorArcana.includes(arcanum)

        
        return (
            <Grid.Col key={arcanum} span={2}>
                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    style={{ background: bgColor }}
                >
                    <Card.Section>
                        <Center>
                            <Image
                                fit="contain"
                                withPlaceholder
                                src={arcanaDescriptions[arcanum.toLowerCase() as ArcanaKey].logo}
                                height={50}
                                width={50}
                                alt="order"
                                style={{ filter: "brightness(0)" }} 
                            />
                        </Center>
                        <Center>
                        <Group>
                        <Input.Wrapper 
                            label={`${arcanaDescriptions[arcanum].name} : ${currentArcanumLevel(awakened, arcanum).level} ${isInferior? "Inferior" : isRuling? "Ruling" : ""}`}
                            description={`Total XP Needed ${currentArcanumLevel(awakened, arcanum).totalXpNeeded}`}
                            >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            onClick={() => {handleArcanumChange(awakened, setAwakened, arcanum, "experiencePoints", awakened.arcana[arcanum].experiencePoints - 1);}}
                        >
                            -
                        </Button>
                        <Input
                            style={{ width: '60px', margin: '0 8px' }}
                            type="number"
                            key={`${arcanum}`}
                            min={0}
                            max={findMaxArcana(awakened, arcanum)}
                            value={awakened.arcana[arcanum].experiencePoints}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = Number(e.target.value);
                            handleArcanumChange(awakened, setAwakened, arcanum, "experiencePoints", value);
                            }}
                        />
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            disabled={findMaxArcana(awakened, arcanum) === awakened.arcana[arcanum].experiencePoints}
                            onClick={() => {handleArcanumChange(awakened, setAwakened, arcanum, "experiencePoints", awakened.arcana[arcanum].experiencePoints + 1);}}
                        >
                            +
                        </Button>
                        </div>
                        </Input.Wrapper>
                        </Group>
                        </Center>
                    </Card.Section>
                </Card>
            </Grid.Col>
        )
    }
    
    // ROTES SECTION

    const [learnableRotes, setLearnableRotes] = useState<Rote[]>(getFilteredRotes(awakened, roteData));
    const [selectedRote, setSelectedRote] = useState<string | null>("");
    const [showAllRotes, setShowAllRotes] = useState(false)

    useEffect(() => {
        setLearnableRotes(getFilteredRotes(awakened, roteData))
    }, [awakened])

    const roteInputs = (learnableRotes:Rote[]) => {      
        const sortedRotes = learnableRotes.sort((a, b) => {
            const arcanumComparison = a.arcanum.localeCompare(b.arcanum);
            if (arcanumComparison !== 0) {
              return arcanumComparison;
            }
            if (a.level !== b.level) {
              return a.level - b.level;
            }
            return a.name.localeCompare(b.name);
          });
      
        // Filter out the rotes that also appear in awakened.rotes
        const filteredRotes = sortedRotes.filter((rote) => {
            return !awakened.rotes.some((existingRote) => existingRote.name === rote.name);
        });

        const allRotes = roteData.sort((a, b) => {
            const arcanumComparison = a.arcanum.localeCompare(b.arcanum);
            if (arcanumComparison !== 0) {
              return arcanumComparison;
            }
            if (a.level !== b.level) {
              return a.level - b.level;
            }
            return a.name.localeCompare(b.name);
        })

        const allFilteredRotes = allRotes.filter((rote) => {
            return !awakened.rotes.some((existingRote) => existingRote.name === rote.name);
        });

        const selectData = filteredRotes.map((rote) => ({
            value: `${rote.name}`,
            label: `${rote.arcanum} ${rote.level} - ${rote.name}`,
            image: `${arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey].logo}`,
            bgc: `${arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey]?.color}`
        }));

        const allData = allFilteredRotes.map((rote) => ({
            value: `${rote.name}`,
            label: `${rote.arcanum} ${rote.level} - ${rote.name}`,
            image: `${arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey].logo}`,
            bgc: `${arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey]?.color}`
        }));
      
        interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
            image: string;
            label: string;
            bgc: string;
          }
          

        const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
            ({ image, label, bgc, ...others }: ItemProps, ref) => (
              <div ref={ref} {...others} style={{backgroundColor:bgc, border: '1px solid white'}}>
                <Group noWrap>
                  <Avatar size={'sm'} src={image} />
                  <div>
                    <Text size="sm" color="white">{label}</Text>
                  </div>
                </Group>
              </div>
            )
          ); 

        const getSelectedRoteData = () => {
          if (selectedRote) {
            // Find the rote in the sortedRotes array that matches the selectedRote
            const selectedRoteData = roteData.find((rote) => rote.name === selectedRote);
            if (selectedRoteData) {
              return (
                <Table>
                    <thead>
                        <tr>
                            <th>Rote</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ backgroundColor: arcanaDescriptions[selectedRoteData.arcanum.toLowerCase() as ArcanaKey]?.color ?? "white" }}>
                                <Text fz={globals.smallerFontSize} style={{ color: "white" }}>{selectedRoteData.name}</Text>
                                <Image
                                    fit="contain"
                                    withPlaceholder
                                    src={arcanaDescriptions[selectedRoteData.arcanum.toLowerCase() as ArcanaKey].logo}
                                    height={30}
                                    width={30}
                                    alt="order"
                                    style={{ filter: "brightness(0)" }}
                                />
                                <p style={{ color: "white" }}>{selectedRoteData.arcanum} {selectedRoteData.level} {selectedRoteData.otherArcana ? `+ ${selectedRoteData.otherArcana}` : ""}</p>
                                <Button 
                                    color="gray" 
                                    disabled={!selectedRote || !learnableRotes.some(rote => rote.name === selectedRote)}
                                    onClick={() => {
                                    let xpCost = selectedRoteData.level * 2;
                                    handleRoteChange(awakened,setAwakened,selectedRoteData, "experiencePoints", xpCost)
                                    setSelectedRote("")
                                }}>Buy</Button>
                            </td>
                            <td dangerouslySetInnerHTML={{ __html: `${selectedRoteData.description} <p>Rote Pool: ${selectedRoteData.rotePool} ${calculatePool(selectedRoteData.rotePool, awakened)}</p>` }} />
                        </tr>
                    </tbody>
                </Table>

              );
            }
          }
          return null;
        };

        const roteArcanaSet = new Set(Object.values(awakened.rotes).map((rote) => rote.arcanum));
        const roteArcana = Array.from(roteArcanaSet);
        roteArcana.sort()
        let isRoteOutOfOrder = (rote:Rote) => {
            return rote.level > currentArcanumLevel(awakened, rote.arcanum.toLowerCase() as ArcanaKey).level
        }
        const knownCreateRoteAccordian = (arcanum: ArcanaKey) => {
            const knownRotes = awakened.rotes.filter((rote) => rote.arcanum.toLowerCase() === arcanum.toLowerCase())

            knownRotes.sort((a, b) => {
                if (a.level !== b.level) {
                return a.level - b.level;
                }
                return a.name.localeCompare(b.name); 
            });
            
            let anyRoteOutOfOrder = knownRotes.some(
                (rote) => isRoteOutOfOrder(rote)
            );

            return(
                <div>
                <Accordion.Item value={arcanum}>
                <Accordion.Control icon={<Image height={20} width={20} src={arcanaDescriptions[arcanum.toLowerCase() as ArcanaKey].logo} />} style={{ color: "white", border: anyRoteOutOfOrder? '2px solid red' : 'none', backgroundColor: arcanaDescriptions[arcanum.toLowerCase() as ArcanaKey]?.color ?? "white" }}>{arcanum.toUpperCase()} {anyRoteOutOfOrder? "⚠️": ""}</Accordion.Control>
                    <Accordion.Panel>
                    <Table>
                        <thead>
                        <tr>
                            <th>Rote</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                            {knownRotes.map((rote) => {

                                return(
                                    <tr key={`${rote.name} ${rote.arcanum}`} style={{ border: isRoteOutOfOrder(rote) ? '2px solid red' : 'none' }}>
                                        <td style={{ backgroundColor: arcanaDescriptions[arcanum.toLowerCase() as ArcanaKey]?.color ?? "white" }}>
                                        <Text fz={globals.smallerFontSize} style={{ color: "white" }}>{rote.name} {isRoteOutOfOrder(rote)? "⚠️": ""}</Text>
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
                                        { rote.experiencePoints > 0?
                                        <Button color="gray" onClick={() => {
                                            handleRoteChange(awakened,setAwakened,rote, "experiencePoints", 0)
                                        }}>Remove</Button>
                                        :
                                        <></>
                                        }
                                        </td>
                                        <td dangerouslySetInnerHTML={{ __html: `${rote.description} <p>Rote Pool: ${rote.rotePool} ${calculatePool(rote.rotePool, awakened)}</p>` }} />
                                    </tr>
                            )})}
                        </tbody>
                    </Table>    
                    </Accordion.Panel>
                </Accordion.Item>
                </div>
            )
        }
        return (
          <div>
            <Group>
                <Button
                    color="gray"
                    style={{ margin: "5px" }}
                    onClick={() => setShowAllRotes((prevShowAllRotes) => !prevShowAllRotes)}
                    >
                        {showAllRotes ? "Hide All" : "Show All"}
                </Button>

                <Select
                    data={showAllRotes? allData: selectData} 
                    value={selectedRote}
                    onChange={(val) => setSelectedRote(val)} 
                    placeholder="Select Rote to Buy"
                    itemComponent={SelectItem}
                    searchable
                    allowDeselect
                    style={{width:'70%'}}
                />
            </Group>
            {getSelectedRoteData()}

            <Text>Known Rotes</Text>
            <Accordion>
                {
                    (roteArcana as ArcanaKey[]).map((a) => knownCreateRoteAccordian(a))
                }    
                </Accordion>
          </div>
        );
    };
    
    // MERIT SECTION

    const [buyableMerits, setBuyableMerits] = useState<Merit[]>(getFilteredMerits(awakened));
    const [selectedMerit, setSelectedMerit] = useState<string | null>("");
    const [showAllMerits, setShowAllMerits] = useState(false)

    useEffect(() => {
        setBuyableMerits(getFilteredMerits(awakened))
    }, [awakened])
    
    const meritInput = (buyableMerits:Merit[]) => {
        const customMeritOrder = ["Mental merits", "Physical merits", "Social merits", "Mage merits", "Sanctum merits"];
        const sortedMerits = buyableMerits.sort((a, b) => {
            // Compare the order of types defined in customMeritOrder
            const typeOrderA = customMeritOrder.indexOf(a.type);
            const typeOrderB = customMeritOrder.indexOf(b.type);
            // Sort by type order first, and then by name if the types are the same
            if (typeOrderA !== typeOrderB) {
                return typeOrderA - typeOrderB;
            } else {
                return a.name.localeCompare(b.name);
            }
        });

        const filteredMerits = sortedMerits.filter((merit) => {
            return merit.rating.includes("mult") || (!merit.description.includes("Character Creation only") && !awakened.merits.some((existingMerit) => existingMerit.name === merit.name))
          });
          
        const selectData = filteredMerits.map((merit) => ({
            value: `${merit.name}`,
            label: `${merit.name} ${merit.rating}`,
            bgc: `${merit.type==="Mental merits"? theme.fn.rgba(theme.colors.blue[8], 0.90): merit.type==="Physical merits"?theme.fn.rgba(theme.colors.red[8], 0.90):merit.type==="Social merits"?theme.fn.rgba(theme.colors.grape[8], 0.90):merit.type==="Mage merits"?theme.fn.rgba(theme.colors.green[9], 0.90):merit.type==="Sanctum merits"?theme.fn.rgba(theme.colors.gray[6], 0.90):""}` 
        }))


        const allSortedMerits = meritData.sort((a, b) => {
            // Compare the order of types defined in customMeritOrder
            const typeOrderA = customMeritOrder.indexOf(a.type);
            const typeOrderB = customMeritOrder.indexOf(b.type);
            // Sort by type order first, and then by name if the types are the same
            if (typeOrderA !== typeOrderB) {
                return typeOrderA - typeOrderB;
            } else {
                return a.name.localeCompare(b.name);
            }
        });

        const allFilteredMerits = allSortedMerits.filter((merit) => {
            return merit.rating.includes("mult") || (!merit.description.includes("Character Creation only") && !awakened.merits.some((existingMerit) => existingMerit.name === merit.name))
          });
          
        const allSelectData = allFilteredMerits.map((merit) => ({
            value: `${merit.name}`,
            label: `${merit.name} ${merit.rating}`,
            bgc: `${merit.type==="Mental merits"? theme.fn.rgba(theme.colors.blue[8], 0.90): merit.type==="Physical merits"?theme.fn.rgba(theme.colors.red[8], 0.90):merit.type==="Social merits"?theme.fn.rgba(theme.colors.grape[8], 0.90):merit.type==="Mage merits"?theme.fn.rgba(theme.colors.green[9], 0.90):merit.type==="Sanctum merits"?theme.fn.rgba(theme.colors.gray[6], 0.90):""}` 
        }))

        interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
            label: string;
            bgc: string;
        }
        const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
            ({ label, bgc, ...others }: ItemProps, ref) => (
                <div ref={ref} {...others} style={{backgroundColor:bgc, border: '1px solid white'}}>
                    <Group noWrap>
                    <div>
                        <Text size="sm" color="white">{label}</Text>
                    </div>
                    </Group>
                </div>
            )
        ); 

        const handleMeritBuy = (meritData: Merit) => {
            let {minCost, orBool, orToBool} = defineMeritRating(meritData.rating)
            
            let cost = 0
            if (orBool || orToBool) {
              cost = minCost * 2
            }
            else {
            for (let i = 0; i < minCost +1; i++) {
              cost = cost + (i * 2)
            }      
          }
          const newMerit = { ...meritData, id: `${meritData.id}-${Date.now()}`};
            handleMeritChange(awakened, setAwakened, newMerit, "experiencePoints", cost)        
            setSelectedMerit("");
        
          }

        const getSelectedMeritData = () => {
            if (selectedMerit) {
                const selectedMeritData = meritData.find((merit) => merit.name === selectedMerit);
                if (selectedMeritData) {
                    return (
                        <Table>
                            <thead>
                                <tr>
                                    <th>Merit</th>
                                    <th>Description</th>
                                </tr>

                            </thead>
                            <tbody>
                                <tr key={`${selectedMeritData.name} ${selectedMeritData.type}`}>
                                    <td 
                                        style={{
                                        minWidth: "150px",
                                        backgroundColor: selectedMeritData.type === "Mental merits" ? theme.fn.rgba(theme.colors.blue[8], 0.90) :
                                        selectedMeritData.type === "Physical merits" ? theme.fn.rgba(theme.colors.red[8], 0.90) :
                                        selectedMeritData.type === "Social merits" ? theme.fn.rgba(theme.colors.grape[8], 0.90) :
                                        selectedMeritData.type === "Mage merits" ? theme.fn.rgba(theme.colors.green[9], 0.90) :
                                        selectedMeritData.type === "Sanctum merits" ? theme.fn.rgba(theme.colors.gray[6], 0.90) :
                                        ""
                                    }}>
                                    <Text color="white">{selectedMeritData.name}</Text>
                                    <Text color="white">{selectedMeritData.rating}</Text>
                                    <Text color="white">{selectedMeritData.prerequisites? `PreReq: ${selectedMeritData.prerequisites}`: ''}</Text>
                                    <Button 
                                        color="gray" 
                                        disabled={!selectedMerit || !buyableMerits.some(merit => merit.name === selectedMerit)}
                                        onClick={() => {
                                        handleMeritBuy(selectedMeritData)
                                    }}>Buy</Button>                         </td>
                                    <td dangerouslySetInnerHTML={{ __html: `${selectedMeritData.description}` }} />
                                </tr>
                            </tbody>
                        </Table>
                    )
                }
            }
            return null;
        }

        const meritTypesSet = new Set(Object.values(awakened.merits).map((merit) => merit.type))
        const meritTypes = Array.from(meritTypesSet)
        meritTypes.sort((a, b) => {
            // Compare the order of types defined in customMeritOrder
            const typeOrderA = customMeritOrder.indexOf(a);
            const typeOrderB = customMeritOrder.indexOf(b);
            // Sort by type order first, and then by name if the types are the same
            if (typeOrderA !== typeOrderB) {
              return typeOrderA - typeOrderB;
            } else {
              return a.localeCompare(b);
            }
          });
          

        const createOwnedMeritAccordian = (type:string) => {
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
    
        
            const sortedMerits = awakened.merits.filter((merit) => merit.type.toLowerCase() === type.toLowerCase()).sort((a, b) => a.id.localeCompare(b.id))

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
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedMerits.map((merit: Merit) => {
                                return (
                                    <tr key={`${merit.name} ${merit.type}`}>
                                        <td style={{ minWidth: "150px" }}>
                                        <Text>{merit.name} {currentMeritLevel(merit).level}</Text>
                                        <Text>{merit.rating}</Text>
                                        <Text>{merit.prerequisites? `PreReq: ${merit.prerequisites}`: ''}</Text>                                        
                                        {merit.name ==="Status (Consilium)" || merit.name ==="Status (Order)"? <></>:
                                            <Group key={`${merit.name} input`}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Button
                                                    size="xs"
                                                    variant='outline'
                                                    color='gray'
                                                    onClick={() => handleXpMeritChange(awakened, setAwakened, merit, merit.experiencePoints - 1)}
                                                >
                                                -
                                                </Button>
                                                <Input
                                                    style={{ width: '60px', margin: '0 8px' }}
                                                    type="number"
                                                    key={`${merit.name}`}
                                                    min={0}
                                                    max={findMaxMerit(merit)}
                                                    value={merit.experiencePoints}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const value = Number(e.target.value);
                                                    handleXpMeritChange(awakened, setAwakened, merit, value);
                                                    }}
                                                />
                                                <Button
                                                    size="xs"
                                                    variant='outline'
                                                    color='gray'
                                                    disabled={findMaxMerit(merit) === merit.experiencePoints}
                                                    onClick={() => handleXpMeritChange(awakened, setAwakened, merit, merit.experiencePoints + 1)}
                                                >
                                                    +
                                                </Button>
                                                </div>
                                            </Group>
                                        }
                                        
                                        { merit.creationPoints === 0 && merit.freebiePoints === 0 ?
                                            <Button
                                                onClick={() => {
                                                    setAwakened({...awakened, merits: awakened.merits.filter((m) => !m.id.includes(merit.id))})
                                                }}
                                            >Remove Merit</Button>
                                            :
                                            <></>
                                        }
                                        </td>
                                        <td dangerouslySetInnerHTML={{ __html: `${merit.description}` }} />
                                    </tr>
                                )})}
                            </tbody>
                            </Table>
                        </Accordion.Panel>
                    </Accordion.Item> 
                </div>
            )
        }

        return (
            <div>
                <Group>
                    <Button
                        color="gray"
                        style={{ margin: "5px" }}
                        onClick={() => setShowAllMerits((prevShowAllMerits) => !prevShowAllMerits)}
                    >
                        {showAllMerits ? "Hide All" : "Show All"}
                    </Button>
                    <Select
                        data={showAllMerits? allSelectData: selectData}
                        value={selectedMerit}
                        onChange={(val) => setSelectedMerit(val)}
                        placeholder="Select Merit to Buy"
                        itemComponent={SelectItem}
                        searchable
                        allowDeselect
                        style={{width:'70%'}}
                    />
                </Group>
                {getSelectedMeritData()}
                <Text>Owned Merits</Text>
                <Accordion>
                    {
                        (meritTypes).map((a) => createOwnedMeritAccordian(a))
                    }
                </Accordion>
            </div>
        )
    }

    // GNOSIS SECTION

    const gnosisInput = () => {

        return (
            <div>
                <Center>
                    <Input.Wrapper 
                        label={`Gnosis ${currentGnosisLevel(awakened).level}`}
                        description={`Total XP for Next: ${currentGnosisLevel(awakened).totalXpNeeded}`}
                        >
                        <Group>
                            <Button
                                size="xs"
                                variant='outline'
                                color='gray'
                                onClick={() => handleGnosisChange(awakened, setAwakened, "experiencePoints", awakened.gnosis.experiencePoints - 1)}
                            >
                                -
                            </Button>
                            <Input
                                style={{ width: '60px', margin: '0 8px' }}
                                type="number"
                                key={`Gnosis`}
                                min={0}
                                max={findMaxGnosis(awakened)}
                                value={awakened.gnosis.experiencePoints}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = Number(e.target.value);
                                handleGnosisChange(awakened, setAwakened, "experiencePoints", value);
                                }}
                            />
                            <Button
                                size="xs"
                                variant='outline'
                                color='gray'
                                disabled={currentGnosisLevel(awakened).level >=6}
                                onClick={() => handleGnosisChange(awakened, setAwakened, "experiencePoints", awakened.gnosis.experiencePoints + 1)}
                            >
                                +
                            </Button>
                        </Group>
                    </Input.Wrapper>
                </Center>

                <Table striped withColumnBorders fontSize="xs">
                    <thead>
                        <tr>
                            <th>
                                Mana Max/Per Turn  
                            </th>
                            <th>
                                Active Spells
                            </th>
                            {Gnoses[currentGnosisLevel(awakened).level].aura!==""?<th>Aura</th>:<></>}
                            <th>
                                Paradox Pool
                            </th>
                            <th>
                                Extended Casting Time/Breaks
                            </th>
                            {Gnoses[currentGnosisLevel(awakened).level].combinedSpells!==0?<th>Combined Spells</th>:<></>}
                            <th>Aimed Spell <p/>(Short/Med -2/ Long -4)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{Gnoses[currentGnosisLevel(awakened).level].mana}</td>
                            <td>{Gnoses[currentGnosisLevel(awakened).level].activeSpells}</td>
                            {Gnoses[currentGnosisLevel(awakened).level].aura!==""?<td>{Gnoses[currentGnosisLevel(awakened).level].aura}</td>:<></>}
                            <td>{Gnoses[currentGnosisLevel(awakened).level].paradoxPool}</td>
                            <td>{Gnoses[currentGnosisLevel(awakened).level].extendedCasting}</td>
                            {Gnoses[currentGnosisLevel(awakened).level].combinedSpells!==0?<td>{Gnoses[currentGnosisLevel(awakened).level].combinedSpells}</td>:<></>}
                            <td>{Gnoses[currentGnosisLevel(awakened).level].aimedSpell}</td>
                        </tr>
                        <tr>
                        <td colSpan={8}>Arcana Mastery: {Gnoses[currentGnosisLevel(awakened).level].arcanaMastery.join(" ● ")}</td>
                        </tr>
                    </tbody>
                </Table>

            </div>
        )
    }

    // WISDOM Section

    const wisdomInput = () => {
        return(
            <div>
                <Center>
                    <Input.Wrapper 
                        label={`Wisdom ${currentWisdomLevel(awakened).level}`}
                        description={`Total XP for Next: ${currentWisdomLevel(awakened).totalXpNeeded}`}
                        >
                        <Group>
                            <Button
                                size="xs"
                                variant='outline'
                                color='gray'
                                onClick={() => handleWisdomChange(awakened, setAwakened, "experiencePoints", awakened.wisdom.experiencePoints - 1)}
                            >
                                -
                            </Button>
                            <Input
                                style={{ width: '60px', margin: '0 8px' }}
                                type="number"
                                key={`Wisdom`}
                                min={0}
                                max={findMaxWisdom(awakened)}
                                value={awakened.wisdom.experiencePoints}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = Number(e.target.value);
                                handleWisdomChange(awakened, setAwakened, "experiencePoints", value);
                                }}
                            />
                            <Button
                                size="xs"
                                variant='outline'
                                color='gray'
                                disabled={currentWisdomLevel(awakened).level >=10}
                                onClick={() => handleWisdomChange(awakened, setAwakened, "experiencePoints", awakened.wisdom.experiencePoints + 1)}
                            >
                                +
                            </Button>
                        </Group>
                    </Input.Wrapper>
                </Center>

                <Table striped withColumnBorders fontSize="xs">
                    <thead>
                        <tr>
                            <th>Bedlam Duration</th>
                            <th>Paradox Duration</th>
                            <th>Spirit/Abyssal Modifier</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{Wisdoms[currentWisdomLevel(awakened).level].bedlamDuration}</td>
                            <td>{Wisdoms[currentWisdomLevel(awakened).level].paradoxDuration}</td>
                            <td>{Wisdoms[currentWisdomLevel(awakened).level].spiritMod}</td>
                        </tr>
                        {Object.entries(Wisdoms)
                            .slice(0, currentWisdomLevel(awakened).level + 1)
                            .reverse()
                            .map(([level, wisdom]) => (
                            <tr key={level}>
                                <td colSpan={8}><u>Act of Hubris:</u> {wisdom.hubris} (Roll {wisdom.diceRoll} die)</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        )
    }

    // END RETURN SECTION

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
            <Stack>

                {topSection()}

                {otherSection()}

                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Attributes</Text>
                <hr style={{width:"50%"}}/>
                    <Grid gutter="lg" justify="center">
                        {attributeXpInputs}
                    </Grid>

                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Skills</Text>
                <hr style={{width:"50%"}}/>
                    <Grid gutter="lg" justify="center">
                        {skillXpInputs}
                    </Grid>

                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Arcana</Text>
                <hr style={{width:"50%"}}/>
                    <Grid columns={10} grow m={0}>
                        {
                            rulingArcana.map((o) => arcanaKeySchema.parse(o)).map((arcanum) => arcanumXpInputs(arcanum))
                        }{
                            otherArcana.map((o) => arcanaKeySchema.parse(o)).map((arcanum) => arcanumXpInputs(arcanum))
                        }
                    </Grid>
                
                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Rotes</Text>
                <hr style={{width:"50%"}}/>
                    {roteInputs(learnableRotes)}

                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Merits</Text>
                <hr style={{width:"50%"}}/>
                    {meritInput(buyableMerits)}

                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Gnosis</Text>
                <hr style={{width:"50%"}}/>
                    {gnosisInput()}

                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Wisdom</Text>
                <hr style={{width:"50%"}}/>
                    {wisdomInput()}

            <Alert color={0 > currentExperience(awakened)?"red":"dark"} variant="outline" radius="xs" style={{padding:"0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen? "15%" : "30%"}}>
              <Group>
                <Button.Group>
                <Button 
                style={{ margin: "5px" }}
                color="gray"
                disabled={0 > currentExperience(awakened)} 
                onClick={() => handleUpdate()}>
                  Update
                </Button>    
                   <Text fz={globals.smallerFontSize} style={{ margin: "10px"}} color={0 > currentExperience(awakened)?"#FF6B6B":"white"}>Remaining Experience: {currentExperience(awakened)}</Text>
                <Button 
                style={{ margin: "5px" }}
                color="gray"
                onClick={() => setShowRetire(true)}>
                  Retire
              </Button>
              </Button.Group>
            </Group>
            </Alert>
            </Stack>
            <ExperienceAside awakened={awakened}></ExperienceAside>

        </Center>
    )
}

export default AwakenedSheet