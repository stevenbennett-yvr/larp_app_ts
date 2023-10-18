//Technical Imports
import { Navbar, Center, ScrollArea, Stack, Grid, Title, Text, Group } from '@mantine/core';
import { useEffect, useState } from 'react'
//Asset Imports
import { globals } from '../../../../assets/globals';
//Data Imports
import { Kindred } from '../../../../data/GoodIntentions/types/Kindred';
import { v5AttributesCheckTotalPoints, V5AttributesKey, v5AttributeLevel } from '../../../../data/GoodIntentions/types/V5Attributes';
import { v5SkillsCheckTotalPoints, V5SkillsKey, v5SkillLevel } from '../../../../data/GoodIntentions/types/V5Skills';
//Util Imports
import Tally from '../../../../utils/talley';

export type SideSheetProps = {
    kindred: Kindred
}

const SideSheet = ({ kindred }: SideSheetProps) => {

    const textStyle: React.CSSProperties = {
        fontFamily: "Courier New"
    }

    const characterDisplay = () => {


        return (
            <ScrollArea h={height - 60} type="never">
                <Stack style={{ paddingBottom: "50px" }}>
                    <Stack>
                        <Group>
                        {kindred.sect !== "" ? (
                            <Text fz="xl">
                                <Center>{kindred.sect}</Center>
                            </Text>
                        ) : null}
                        {kindred.clan !== "" ? (
                            <Text fz="xl">
                                <Center>{kindred.clan}</Center>
                            </Text>
                        ) : null}
                        </Group>
                        {v5AttributesCheckTotalPoints(kindred) ?
                            <>
                                <Grid>
                                <Grid.Col span={4}>
                                        <Title order={4}>Physical</Title>
                                        {["strength", "dexterity", "stamina"].map((attribute) => {
                                            const attributeName = attribute as V5AttributesKey
                                            return (<Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: <Tally n={v5AttributeLevel(kindred, attributeName).level} /></Text>)
                                        })}
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Title order={4}>Social</Title>
                                        {["charisma", "manipulation", "composure"].map((attribute) => {
                                            const attributeName = attribute as V5AttributesKey
                                            return (<Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: <Tally n={v5AttributeLevel(kindred, attributeName).level} /></Text>)
                                        })}
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Title order={4}>Mental</Title>
                                        {["intelligence", "wits", "resolve"].map((attribute) => {
                                            const attributeName = attribute as V5AttributesKey
                                            return (<Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: <Tally n={v5AttributeLevel(kindred, attributeName).level} /></Text>)
                                        })}
                                    </Grid.Col>
                                </Grid>
                            </>
                            : <></>}
                    </Stack>
                    <Stack>
                        {v5SkillsCheckTotalPoints(kindred) ?
                            <>
                                <Title order={3}>Skills</Title>
                                <Grid>
                                    <Grid.Col span={4}>
                                        {["athletics",
                                            "brawl",
                                            "craft",
                                            "drive",
                                            "firearms",
                                            "melee",
                                            "larceny",
                                            "stealth",
                                            "survival"].map((skill) => {
                                                let skillName = skill as V5SkillsKey
                                                return (<Text style={textStyle} key={skill}>{skill.slice(0, 4)}: <Tally n={v5SkillLevel(kindred, skillName).level} /></Text>)
                                            })}
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        {["animal ken",
                                            "etiquette",
                                            "insight",
                                            "intimidation",
                                            "leadership",
                                            "performance",
                                            "persuasion",
                                            "streetwise",
                                            "subterfuge",].map((skill) => {
                                                let skillName = skill as V5SkillsKey
                                                return (<Text style={textStyle} key={skill}>{skill.slice(0, 4)}: <Tally n={v5SkillLevel(kindred, skillName).level} /></Text>)
                                            })}
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        {["academics",
                                            "awareness",
                                            "finance",
                                            "investigation",
                                            "medicine",
                                            "occult",
                                            "politics",
                                            "science",
                                            "technology",].map((skill) => {
                                                let skillName = skill as V5SkillsKey
                                                return (<Text style={textStyle} key={skill}>{skill.slice(0, 4)}: <Tally n={v5SkillLevel(kindred, skillName).level} /></Text>)
                                            })}
                                    </Grid.Col>
                                </Grid>
                            </>
                            : <></>}
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
            {showAsideBar ?
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