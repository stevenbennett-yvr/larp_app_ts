import { useMantineTheme, Alert, Avatar, Button, Card, Center, Grid, Group, Image, Input, Select, Stack, Table, Text, Title, Accordion } from "@mantine/core";
import { Awakened } from "../data/Awakened";
import { globals } from "../../../globals";
import { findMaxAttribute, handleXpAttributeChange, AttributeNames, currentAttributeLevel } from "../data/Attributes";
import { removeSpeciality, addSpeciality, findMaxSkill, handleXpSkillChange, SkillNames, currentSkillLevel} from "../data/Skills"
import { Paths } from "../data/Path";
import { arcanaKeySchema, ArcanaKey, arcana, arcanaDescriptions, currentArcanumLevel, findMaxArcana, handleArcanumChange } from "../data/Arcanum";
import React, { useState, forwardRef, useEffect } from "react";
import { roteData, Rote, getFilteredRotes, handleRoteChange } from "../data/Rotes";
import { getFilteredMerits, handleMeritChange, Merit, defineMeritRating, currentMeritLevel, findMaxMerit, handleXpMeritChange } from "../data/Merits";
import { currentGnosisLevel, handleGnosisChange, findMaxGnosis, Gnoses } from "../data/Gnosis";
import { handleWisdomChange, currentWisdomLevel, Wisdoms, findMaxWisdom } from "../data/Wisdom";

type ExperienceAssignerProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    nextStep: () => void
    backStep: () => void
    showInstructions: boolean
    setShowInstructions: (showInstruction: boolean) => void
}

const ExperienceAssigner = ({awakened, setAwakened, nextStep, backStep, showInstructions, setShowInstructions}: ExperienceAssignerProps) => {


    //ATTRIBUTE SECTION

    const attributeXpInputs = Object.entries(awakened.attributes).map(([category, attributesInfo]) => {
        return (
        <Grid.Col 
            span={globals.isPhoneScreen ? 8 : 4} 
            key={`${category} Attributes`}
        >
            <Text fs="italic" fw={700} ta="center">
            {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
            <hr />
            {Object.entries(attributesInfo).map(([attribute, attributeInfo]) => {
            const attributeName = attribute as AttributeNames;
            const { level } = currentAttributeLevel(awakened, attribute);
            return (
                <Center>
                <Group key={`${attribute} input`}>
                    <Input.Wrapper label={`${attribute.charAt(0).toUpperCase() + attribute.slice(1)} ${level}`}>
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

    const skillXpInputs = Object.entries(awakened.skills).map(([category, skillsInfo]) => {
        return (
        <Grid.Col span={globals.isPhoneScreen ? 8 : 4} key={`${category} Skills`}>
            <Text fs="italic" fw={700} ta="center">
            {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
            <hr />
            {Object.entries(skillsInfo).map(([skill, skillInfo]) => {
            const skillName = skill as SkillNames;
            const { level } = currentSkillLevel(awakened, skill);
            const specialities = skillInfo.specialities.map((spec) => spec.name);
            const selectedSpeciality = specialitiesState[skillName];

            return (
                <Center style={{ paddingBottom: '5px'}}>
                    <Alert color="gray">
                    <Stack>
                        <Group key={`${skill} input`}>
                            <Input.Wrapper label={`${skillInfo.roteSkill ? '☑️' : '☐'} ${skill.charAt(0).toUpperCase() + skill.slice(1)} ${level}`}>
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

    const getColorByArcanum = (arcanum: ArcanaKey) => {
        return arcanaDescriptions[arcanum].color;
    };

    const arcanumXpInputs = (arcanum: ArcanaKey, c2: string) => {
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
                            <Title h={30} size="sm" color="dimmed" ta="center">
                                {arcanaDescriptions[arcanum].name} : {currentArcanumLevel(awakened, arcanum).level} {isInferior? "Inferior" : isRuling? "Ruling" : ""}
                            </Title>
                        </Center>
                        <Center>
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
                        </Center>
                    </Card.Section>
                </Card>
            </Grid.Col>
        )
    }
    
    // ROTES SECTION

    const [learnableRotes, setLearnableRotes] = useState<Rote[]>(getFilteredRotes(awakened, roteData));
    const [selectedRote, setSelectedRote] = useState<string | null>("");

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

        const selectData = filteredRotes.map((rote) => ({
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
            const selectedRoteData = sortedRotes.find((rote) => rote.name === selectedRote);
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
                                <Button color="gray" onClick={() => {
                                    let xpCost = selectedRoteData.level * 2;
                                    handleRoteChange(awakened,setAwakened,selectedRoteData, "experiencePoints", xpCost)
                                    setSelectedRote("")
                                }}>Buy</Button>
                            </td>
                            <td dangerouslySetInnerHTML={{ __html: `${selectedRoteData.description} <p>Rote Pool: ${selectedRoteData.rotePool}</p>` }} />
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
                                        <td dangerouslySetInnerHTML={{ __html: `${rote.description} <p>Rote Pool: ${rote.rotePool}</p>` }} />
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
            <Select
                data={selectData} 
                value={selectedRote}
                onChange={(val) => setSelectedRote(val)} 
                placeholder="Select Rote to Buy"
                itemComponent={SelectItem}
                searchable
                allowDeselect
            />
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
          
          //merit.description.includes("Character Creation only") || !merit.rating.includes("multi") || 

        const selectData = filteredMerits.map((merit) => ({
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
                const selectedMeritData = sortedMerits.find((merit) => merit.name === selectedMerit);
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
                                    <Button color="gray" onClick={() => {
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
                <Select
                    data={selectData}
                    value={selectedMerit}
                    onChange={(val) => setSelectedMerit(val)}
                    placeholder="Select Merit to Buy"
                    itemComponent={SelectItem}
                    searchable
                    allowDeselect
                />
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
                    <Input.Wrapper label={`Gnosis ${currentGnosisLevel(awakened).level}`}>
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
                    <Input.Wrapper label={`Wisdom ${currentWisdomLevel(awakened).level}`}>
                        <Group>
                            <Button
                                size="xs"
                                variant='outline'
                                color='gray'
                                onClick={() => handleWisdomChange(awakened, setAwakened, "experiencePoints", awakened.gnosis.experiencePoints - 1)}
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
                                onClick={() => handleWisdomChange(awakened, setAwakened, "experiencePoints", awakened.gnosis.experiencePoints + 1)}
                            >
                                +
                            </Button>
                        </Group>
                    </Input.Wrapper>
                </Center>

                <Table striped withColumnBorders fontSize="xs">
                    <thead>
                        <tr>
                            <th>Hubris Roll</th>
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

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
      };

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
            <Stack>
                <Alert color="gray">
                <Button color="gray" onClick={toggleInstructions}>
                    {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                </Button>
                    {showInstructions && (
                    <div>
                        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Experience</Text>
                        <p>
                            Experience is a valuable resource that represents the growth and development of your character. This application will automatically calculate and update your experience based on your character creation date.
                        </p>
                        <Button variant='link' onClick={() => window.open("https://docs.google.com/document/d/1tGEVoGNRznyU0rvCDIXxGkX3kIO6RoDrEosl1t7-pfs/edit#heading=h.qpwncemu56lp")}>For more information on the experience system, click here.</Button>
                        <p>
                            XP serves as a currency that allows you to improve and customize your character over time. It provides opportunities to enhance your abilities, learn new skills, acquire additional powers and deepen your characters story.
                        </p>
                        <p>
                            Experience Point Costs are auto calculated below, but base costs are listed.
                        </p>
                        <ul>
                            <li><strong>Attributes and Skills:</strong> <i>New level x 5</i> for attributes and <i>New level x 3</i> for skills.</li>
                            <li><strong>Skill Specialty:</strong> Developing a skill specialty costs <i>3</i> XP.</li>
                            <li><strong>Ruling Arcana*:</strong> Advancing the ruling Arcana costs <i>New level x 6</i> XP.</li>
                            <li><strong>Common Arcana*:</strong> Advancing the common Arcana costs <i>New level x 7</i> XP.</li>
                            <li><strong>Inferior Arcanum*:</strong> Advancing the inferior Arcanum costs <i>New level x 8</i> XP.</li>
                            <li><strong>Rote:</strong> Purchasing a rote costs <i>2</i> XP per level.</li>
                            <li><strong>Merit:</strong> Acquiring a new merit costs <i>New level x 2</i> XP.</li>
                            <li><strong>Gnosis:</strong> Increasing Gnosis costs <i>New level x 8</i> XP.</li>
                            <li><strong>Wisdom:</strong> Increasing Wisdom costs <i>New level x 3</i> XP.</li>
                        </ul>
                    </div>
                    )}
                </Alert>

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
                            rulingArcana.map((o) => arcanaKeySchema.parse(o)).map((arcanum) => arcanumXpInputs(arcanum, getColorByArcanum(arcanum)))
                        }{
                            otherArcana.map((o) => arcanaKeySchema.parse(o)).map((arcanum) => arcanumXpInputs(arcanum, getColorByArcanum(arcanum)))
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

                <Button.Group style={{ position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen? "15%" : "30%"}}>
                <Alert color="dark" variant="filled" radius="xs" style={{padding:"0px"}}>
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
                </Alert>
                </Button.Group>

            </Stack>
        </Center>
    )
}

export default ExperienceAssigner