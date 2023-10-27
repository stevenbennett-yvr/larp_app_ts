//Technical Imports
import { Navbar, Center, ScrollArea, Stack, Grid, Title, Text, Group, List } from '@mantine/core';
import { useEffect, useState } from 'react'
//Asset Imports
import { globals } from '../../../../assets/globals';
//Data Imports
import { Kindred } from '../../../../data/GoodIntentions/types/Kindred';
import { v5AttributesCheckTotalPoints, V5AttributesKey, v5AttributeLevel } from '../../../../data/GoodIntentions/types/V5Attributes';
import { v5SkillsCheckTotalPoints, V5SkillsKey, v5SkillLevel } from '../../../../data/GoodIntentions/types/V5Skills';
import { kindredBackgrounds } from '../../../../data/GoodIntentions/types/V5Backgrounds';
import { meritFlawData } from '../../../../data/GoodIntentions/types/V5MeritsOrFlaws';
import { PowerRef, allPowers } from '../../../../data/GoodIntentions/types/V5Powers';
import { v5AdvantageLevel, v5BackgroundLevel } from '../../../../data/GoodIntentions/types/V5Backgrounds';
import { v5MeritLevel } from '../../../../data/GoodIntentions/types/V5MeritsOrFlaws';
import { DisciplineName } from '../../../../data/GoodIntentions/types/V5Disciplines';
//Util Imports
import Tally from '../../../../utils/talley';
import { upcase } from '../../../../utils/case';

export type SideSheetProps = {
    kindred: Kindred
}

const SideSheet = ({ kindred }: SideSheetProps) => {

    const textStyle: React.CSSProperties = {
        fontFamily: "Courier New"
    }

    const powersByDisciplines = new Map<DisciplineName, PowerRef[]>()
    kindred.powers.forEach((powerRef) => {
        let powerInfo = allPowers.find(p => p.name === powerRef.name)
        if (!powerInfo) { return null }
        if (!powersByDisciplines.has(powerInfo.discipline)) {
            powersByDisciplines.set(powerInfo.discipline, [powerRef])
        } else {
            powersByDisciplines.set(powerInfo.discipline, [...powersByDisciplines.get(powerInfo.discipline)!, powerRef])
        }
    })


    const characterDisplay = () => {

        return (
            <ScrollArea h={height - 60} type="never">
                <Stack style={{ paddingBottom: "50px" }}>
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
                    {v5SkillsCheckTotalPoints(kindred) ?
                        <>
                            <Grid>
                                <Grid.Col span={4}>
                                    {["athletics",
                                        "brawl",
                                        "crafts",
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
                    {kindred.generation !== 0 ?
                        (<Text style={textStyle}>
                            <b>Generation:</b> {kindred.generation}
                        </Text>)
                        : null}
                    {kindred.predatorType !== "" ?
                        <Text style={textStyle}><b>Predator Type:</b> {kindred.predatorType}</Text>
                        : <></>}
                    {kindred.backgrounds.length > 0 ?
                        <Stack>
                            <Title order={4}>Backgrounds</Title>
                            <Grid>
                                <Grid.Col span={12}>
                                    <List>
                                        {kindredBackgrounds(kindred).map((background) => {
                                            return (
                                                <List.Item key={background.id}>
                                                    <Text style={textStyle}>{background.name}: <Tally n={v5BackgroundLevel(background).level} /></Text>
                                                    <List>
                                                        {background.advantages.map((advantage) => {
                                                            if (v5AdvantageLevel(advantage).level === 0) { return null }
                                                            return (
                                                                <List.Item key={advantage.name}>
                                                                    <Text style={textStyle}>{advantage.name}: <Tally n={v5AdvantageLevel(advantage).level}></Tally></Text>
                                                                </List.Item>
                                                            )
                                                        })}
                                                    </List>
                                                </List.Item>
                                            )
                                        })}
                                    </List>
                                </Grid.Col>
                            </Grid>
                        </Stack>
                        : <></>}
                    {kindred.loresheet.benefits.length > 0 ?
                        <Stack>
                            <Text style={textStyle}><b>Loresheet:</b> {kindred.loresheet.name}</Text>
                            <List>
                                {kindred.loresheet.benefits.map((benefit) => {
                                    return (
                                        <List.Item key={benefit.name}>
                                            <Text style={textStyle}>{benefit.name}</Text>
                                        </List.Item>
                                    )
                                })}
                            </List>
                        </Stack>
                        : <></>}
                    {kindred.meritsFlaws.length > 0 ?
                        <Stack>
                            <Group grow>
                                <Title order={4}>Merits</Title>
                                <Title order={4}>Flaws</Title>
                            </Group>
                            <Grid>
                                <Grid.Col span={6}>
                                    <List>
                                        {kindred.meritsFlaws.map((mf) => {
                                            let meritData = meritFlawData.find(data => mf.name === data.name)
                                            if (!meritData || meritData.type === "flaw") { return null }
                                            return (
                                                <List.Item key={mf.name}>
                                                    <Text style={textStyle}>{mf.name.slice(0, 7)}: <Tally n={v5MeritLevel(mf).level} /></Text>
                                                </List.Item>
                                            )
                                        })}
                                    </List>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <List>
                                        {kindred.meritsFlaws.map((mf) => {
                                            let meritData = meritFlawData.find(data => mf.name === data.name)
                                            if (!meritData || meritData.type === "merit") { return null }
                                            return (
                                                <List.Item key={mf.name}>
                                                    <Text style={textStyle}>{mf.name.slice(0, 7)}: <Tally n={v5MeritLevel(mf).level} /></Text>
                                                </List.Item>
                                            )
                                        })}
                                    </List>
                                </Grid.Col>
                            </Grid>
                        </Stack>
                        : <></>}
                    <Grid>
                        {Array.from(powersByDisciplines.entries()).map(([disciplineName, powers]) => {
                            return (
                                <Grid.Col span={6} key={disciplineName}>
                                    <Title order={4}>{upcase(disciplineName)}</Title>
                                    <List>
                                        {powers.map((power) => {
                                            return <List.Item key={power.name}>{power.name}</List.Item>
                                        })}
                                        {disciplineName === "blood sorcery"
                                            ? kindred.rituals.map((ritual) => {
                                                return (
                                                    <List.Item ml={"-3px"} icon={"⛤"} key={ritual.name}>
                                                        {ritual.name}
                                                    </List.Item>
                                                )
                                            })
                                            : null}
                                        {disciplineName === "oblivion"
                                            ? kindred.ceremonies.map((ceremony) => {
                                                return (
                                                    <List.Item ml={"-3px"} icon={"⛤"} key={ceremony.name}>
                                                        {ceremony.name}
                                                    </List.Item>
                                                )
                                            })
                                            : null}
                                    </List>
                                </Grid.Col>
                            )
                        })}
                        {kindred.formulae.length > 0 ?
                            <Grid.Col span={6} key={"thin-blood alchemy"}>
                                <Title order={4}>{upcase("thin-blood alchemy")}</Title>
                                <List>
                                    {kindred.formulae.map((power) => {
                                        return <List.Item icon={"⛤"} key={power.name}>{power.name}</List.Item>
                                    })}
                                </List>
                            </Grid.Col>
                            : <></>}
                    </Grid>
                    {kindred.touchstones.length > 0 ?
                        <Stack>
                            <Title order={2}>Touchstones</Title>
                            <List>
                                {kindred.touchstones.map((stone, i) => {
                                    return (
                                        <List.Item key={i}>
                                            <Text style={textStyle}>
                                                <b>{stone.name}</b>
                                            </Text>
                                            <Text style={textStyle} c="dimmed">
                                                {stone.conviction}
                                            </Text>
                                        </List.Item>
                                    )
                                })}
                            </List>
                        </Stack>
                        : <></>}
                </Stack>
            </ScrollArea>
        )
    }

    const [showAsideBar, setShowAsideBar] = useState(!globals.isSmallScreen)
    useEffect(() => { setShowAsideBar(!globals.isSmallScreen) }, [globals.isSmallScreen])

    const height = globals.viewportHeightPx
    return (
        <>
            {showAsideBar ?
                <Navbar width={{ base: 300 }} height={"100%"} p="xs">
                    {characterDisplay()}
                </Navbar>
                : <></>}
        </>
    )
}

export default SideSheet