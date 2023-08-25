//Technical Imports
import { Navbar, Center, ScrollArea, Stack, Grid, Title, Text } from '@mantine/core';
import { useEffect, useState} from 'react'
//Asset Imports
import { globals } from '../../../../assets/globals';
//Data Imports
import { Awakened } from "../../../../data/TatteredVeil/types/Awakened"
import { currentAttributeLevel, attributesCreationPointsCheck } from '../../../../data/TatteredVeil/types/Attributes';
import { currentSkillLevel, SkillCreationPointsCheck } from '../../../../data/TatteredVeil/types/Skills';
import { currentArcanumLevel, ArcanaKey, checkArcanaCreationPointsTotal } from '../../../../data/TatteredVeil/types/Arcanum';
import { checkRoteCreationPoints } from '../../../../data/TatteredVeil/types/Rotes';
import { checkMeritCreationPoints, currentMeritLevel } from '../../../../data/TatteredVeil/types/Merits';
//Util Imports
import Tally from '../../../../utils/talley';

export type SideSheetProps = {
    awakened: Awakened
}

const SideSheet = ({awakened}: SideSheetProps) => {
    
    const textStyle: React.CSSProperties = {
        fontFamily: "Courier New"
    }

    const characterDisplay = () => {


        return (
        <ScrollArea h={height - 60} type="never">
            <Stack style={{paddingBottom:"50px"}}>
                <Stack>
                    {attributesCreationPointsCheck(awakened)?
                    <>
                        <Title order={3}>Attributes</Title>
                            <Grid>
                                <Grid.Col span={4}>
                                    <Title order={4}>Mental</Title>
                                    {["intelligence", "wits", "resolve"].map((attribute) => {
                                        return (<Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: <Tally n={currentAttributeLevel(awakened, attribute).level} /></Text>)
                                    })}
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <Title order={4}>Physical</Title>
                                    {["strength", "dexterity", "stamina"].map((attribute) => {
                                        return (<Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: <Tally n={currentAttributeLevel(awakened, attribute).level} /></Text>)
                                    })}
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <Title order={4}>Social</Title>
                                    {["presence", "manipulation", "composure"].map((attribute) => {
                                        return (<Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: <Tally n={currentAttributeLevel(awakened, attribute).level} /></Text>)
                                    })}
                                </Grid.Col>
                            </Grid>
                    </>
                    : <></>}
                </Stack>
                <Stack>
                    {SkillCreationPointsCheck(awakened)? 
                    <>
                    <Title order={3}>Skills</Title>
                    <Grid>
                        <Grid.Col span={4}>
                            <Title order={4}>Mental</Title>
                            {["academics", "computer", "crafts", "investigation", "medicine", "occult", "politics", "science"].map((skill) => {
                                return (<Text style={textStyle} key={skill}>{skill.slice(0, 4)}: <Tally n={currentSkillLevel(awakened, skill).level} /></Text>)
                            })}
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Title order={4}>Physical</Title>
                            {["athletics", "brawl", "drive", "firearms", "weaponry", "larceny", "stealth", "survival"].map((skill) => {
                                return (<Text style={textStyle} key={skill}>{skill.slice(0, 4)}: <Tally n={currentSkillLevel(awakened, skill).level} /></Text>)
                            })}
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Title order={4}>Social</Title>
                            {["animal_ken", "socialize", "empathy", "intimidation", "expression", "persuasion", "streetwise", "subterfuge"].map((skill) => {
                                return (<Text style={textStyle} key={skill}>{skill.slice(0, 4)}: <Tally n={currentSkillLevel(awakened, skill).level} /></Text>)
                            })}
                        </Grid.Col>
                    </Grid>
                    </>
                    :<></>}
                </Stack>
                <Stack>
                    {checkArcanaCreationPointsTotal(awakened)? 
                    <>
                    <Title order={3}>Arcana</Title>
                    <Grid>
                        <Grid.Col span={6}>
                            {["death", "fate", "forces", "life", "matter"].map((arcanum) => {
                                let arcanumName = arcanum as ArcanaKey
                                return (<Text style={textStyle} key={arcanum}>{arcanum.slice(0, 3)}: <Tally n={currentArcanumLevel(awakened, arcanumName).level} /></Text>)
                            })}
                        </Grid.Col>
                        <Grid.Col span={6}>
                            {["mind", "prime", "space", "spirit", "time"].map((arcanum) => {
                                let arcanumName = arcanum as ArcanaKey
                                return (<Text style={textStyle} key={arcanum}>{arcanum.slice(0, 3)}: <Tally n={currentArcanumLevel(awakened, arcanumName).level} /></Text>)
                            })}
                        </Grid.Col>
                    </Grid>
                    </>
                    :<></>}
                </Stack>
                <Stack>
                    {checkRoteCreationPoints(awakened)? 
                    <>
                    <Title order={3}>Rotes</Title>
                       <Grid>
                            <Grid.Col span={12}>
                                {
                                awakened.rotes.map((rote) => {
                                    return (<Text style={textStyle} key={rote.name}>{rote.arcanum.slice(0, 3)} {rote.level}: {rote.name}</Text>)
                                })
                                }
                            </Grid.Col>
                        </Grid> 
                    </>
                    :<></>}
                </Stack>
                <Stack>
                    {checkMeritCreationPoints(awakened)? 
                    <>
                    <Title order={3}>Merits</Title>
                       <Grid>
                            <Grid.Col span={12}>
                                {
                                awakened.merits.map((merit) => {
                                    return (<Text style={textStyle} key={merit.name}>{merit.name} {currentMeritLevel(merit).level}</Text>)
                                })
                                }
                            </Grid.Col>
                        </Grid> 
                    </>
                    :<></>}
                </Stack>
            </Stack>
        </ScrollArea>
        )
    }

    const [showAsideBar, setShowAsideBar] = useState(!globals.isSmallScreen)
    useEffect(() => { setShowAsideBar(!globals.isSmallScreen) }, [globals.isSmallScreen])

    const height = globals.viewportHeightPx
    const scrollerHeight = 900
    return (
        <>
        {showAsideBar? 
            <Navbar width={{ base: 300 }} height={"100%"} p="xs">
                <Center h={"100%"}>
                    {height <= scrollerHeight
                        ? <ScrollArea h={height - 100}>
                            {characterDisplay()}
                        </ScrollArea>
                        : <>{characterDisplay()}</>
                    }
                </Center>
            </Navbar>
        : <></>}
        </>
    )
}

export default SideSheet