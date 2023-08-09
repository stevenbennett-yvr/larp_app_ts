//technical imports
import { useState } from "react";
import { Avatar, useMantineTheme, Alert, Button, Center, Grid, Group, Image, Select, Stack, Table, Text, Accordion } from "@mantine/core";
import { globals } from "../../../globals";

//data imports
import { Awakened } from "../data/Awakened";
import { Paths } from "../data/Path";
import { Orders } from "../data/Order";
import { currentAttributeLevel } from "../data/Attributes";
import { SkillNames, currentSkillLevel} from "../data/Skills"
import { arcanaKeySchema, ArcanaKey, arcana, arcanaDescriptions, currentArcanumLevel } from "../data/Arcanum";
import { Rote, calculatePool } from "../data/Rotes";
import { Merit, currentMeritLevel } from "../data/Merits";
import { currentGnosisLevel, Gnoses } from "../data/Gnosis";
import { currentWisdomLevel, Wisdoms } from "../data/Wisdom";
import { currentExperience } from "../data/Experience"

type PrintSheetProps = {
    awakened: Awakened,
    backStep: () => void
    submit: () => void
}

const PrintSheet = ({awakened, backStep, submit}: PrintSheetProps) => {

    const topSection = () => {
        return(
            <Grid columns={9}>
                <Grid.Col span={3} style={{ borderRight: "1px solid #ccc" }}>
                    <Center>
                        <Avatar
                            src={awakened.background.profilePic}
                            size={100}
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

    //ATTRIBUTE SECTION

    const attributeDisplay = Object.entries(awakened.attributes).map(([category, attributesInfo]) => {
        return (
        <Grid.Col 
            span={globals.isPhoneScreen ? 8 : 4} 
            key={`${category} Attributes`}
        >
            <Text fs="italic" fw={700} ta="center">
            {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
            <hr />
            {Object.entries(attributesInfo).map(([attribute]) => {
            const { level } = currentAttributeLevel(awakened, attribute);
            return (
                <Group key={`${attribute} input`}>
                    <Text>{`${attribute.charAt(0).toUpperCase() + attribute.slice(1)}`}</Text>
                    {Array.from({ length: level }, (_, index) => (
                            <span
                                key={index}
                            >
                                ●
                            </span>
                        ))}
                </Group>
            );
            })}
        </Grid.Col>
        );
    });

    //SKILL SECTION

    const [specialitiesState] = useState<{ [key in SkillNames]?: string }>({});

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
                            <Text>{`${skillInfo.roteSkill ? '🔷' : '☐'} ${skill.charAt(0).toUpperCase() + skill.slice(1)}`}</Text>
                            {Array.from({ length: level }, (_, index) => (
                            <span
                                key={index}
                            >
                                ●
                            </span>
                            ))}
                        </Group>
                        <Select
                            variant="unstyled"
                            size="xs"
                            data={specialities}
                            allowDeselect
                            defaultValue={specialities[0]}
                            value={selectedSpeciality}
                            />
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
    const rulingArcana = Paths[awakened.path].rulingArcana
    const otherArcana = arcana.filter((arcanaName) => !rulingArcana.includes(arcanaName));

    const getColorByArcanum = (arcanum: ArcanaKey) => {
        return arcanaDescriptions[arcanum].color;
    };

    const arcanumXpInputs = (arcanum: ArcanaKey, c2: string) => {
        
        return (
            <Grid.Col key={arcanum} span={4}> {/* Adjust the span value as needed */}
              <Center>
                <Group>
                  <Image
                    fit="contain"
                    withPlaceholder
                    src={arcanaDescriptions[arcanum.toLowerCase() as ArcanaKey].logo}
                    height={30}
                    width={30}
                    alt="order"
                    style={{ filter: 'brightness(0)' }}
                  />
                  <Text ta="center" color="white">
                    {arcanaDescriptions[arcanum].name}
                  </Text>
                  {Array.from({ length: currentArcanumLevel(awakened, arcanum).level }, (_, index) => (
                    <span key={index} style={{ color: c2 }}>
                      ●
                    </span>
                  ))}
                </Group>
              </Center>
            </Grid.Col>
          );
        
    }
    
    // ROTES SECTION

    const roteInputs = () => {  
      
        // Filter out the rotes that also appear in awakened.rotes

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
    
    const meritInput = () => {
        const customMeritOrder = ["Mental merits", "Physical merits", "Social merits", "Mage merits", "Sanctum merits"];


          
          //merit.description.includes("Character Creation only") || !merit.rating.includes("multi") || 


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
                    <Text>{`Gnosis ${currentGnosisLevel(awakened).level}`}</Text>
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
                    <Text>{`Wisdom ${currentWisdomLevel(awakened).level}`}</Text>
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
                <Alert color="gray">
                </Alert>

                {topSection()}

                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Attributes</Text>
                <hr style={{width:"50%"}}/>
                    <Grid gutter="lg" justify="center">
                        {attributeDisplay}
                    </Grid>

                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Skills</Text>
                <hr style={{width:"50%"}}/>
                    <Grid gutter="lg" justify="center">
                        {skillXpInputs}
                    </Grid>

                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Arcana</Text>
                <hr style={{width:"50%"}}/>
                    <Grid columns={2} grow m={0}>
                        {
                            rulingArcana.map((o) => arcanaKeySchema.parse(o)).map((arcanum) => arcanumXpInputs(arcanum, getColorByArcanum(arcanum)))
                        }{
                            otherArcana.map((o) => arcanaKeySchema.parse(o)).map((arcanum) => {
                                return currentArcanumLevel(awakened, arcanum).level > 0 ? arcanumXpInputs(arcanum, getColorByArcanum(arcanum)) : null;
                            })                        
                        }
                    </Grid>
                
                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Rotes</Text>
                <hr style={{width:"50%"}}/>
                    {roteInputs()}

                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Merits</Text>
                <hr style={{width:"50%"}}/>
                    {meritInput()}

                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Gnosis</Text>
                <hr style={{width:"50%"}}/>
                    {gnosisInput()}

                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Wisdom</Text>
                <hr style={{width:"50%"}}/>
                    {wisdomInput()}

                    <Alert color="dark" variant="filled" radius="xs" style={{padding:"0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen? "15%" : "30%"}}>
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
                        onClick={submit}
                        disabled={currentExperience(awakened) > 10}
                    >
                        Submit
                    </Button>
              </Button.Group>
            </Group>
            </Alert>
            </Stack>
        </Center>
    )
}

export default PrintSheet