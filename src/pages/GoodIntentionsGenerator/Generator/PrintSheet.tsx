import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { generations } from "../../../data/GoodIntentions/types/V5Generation"
import { ClanName, Clans } from "../../../data/GoodIntentions/types/V5Clans"
import { Center, Grid, Avatar, Stack, Text, Title, Group, Alert, Button, Card, Table, Divider } from "@mantine/core"
import { globals } from "../../../assets/globals"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons";
import Dots from "../../../utils/dots"
import { v5AttributeLevel, V5AttributesKey } from "../../../data/GoodIntentions/types/V5Attributes"
import { v5SkillLevel, V5SkillsKey } from "../../../data/GoodIntentions/types/V5Skills"
import { v5DisciplineLevel, allDisciplines, DisciplineKey } from "../../../data/GoodIntentions/types/V5Disciplines"
import { allPowers } from "../../../data/GoodIntentions/types/V5Powers"
import { upcase } from "../../../utils/case"
import { v5HumanityLevel } from "../../../data/GoodIntentions/types/V5Humanity"
import { Rituals } from "../../../data/GoodIntentions/types/V5Rituals"
import { Ceremonies } from "../../../data/GoodIntentions/types/V5Ceremonies"
import { V5BackgroundRef, backgroundData, v5BackgroundLevel, v5AdvantageLevel } from "../../../data/GoodIntentions/types/V5Backgrounds"
import { v5GetMeritByName, v5MeritLevel } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws"

type PrintSheetProps = {
    kindred: Kindred,
    backStep: () => void,
}

const flawIcon = () => {
    return <FontAwesomeIcon icon={faCircleDown} style={{ color: "#e03131" }} />
}
const meritIcon = () => {
    return <FontAwesomeIcon icon={faCircleUp} style={{ color: "rgb(47, 158, 68)", }} />
}

const V5PrintSheet = ({ kindred, backStep }: PrintSheetProps) => {

    const topSection = () => {
        const name = kindred.name
        const clan = kindred.clan
        const generation = generations[kindred.generation].generation
        const predatorType = kindred.predatorType
        const compulsion = Clans[kindred.clan].compulsion
        let clanBane = Clans[kindred.clan].bane
        const health = v5AttributeLevel(kindred, "stamina").level + 3
        const willpower = v5AttributeLevel(kindred, "resolve").level + v5AttributeLevel(kindred, "composure").level
        const humanity = v5HumanityLevel(kindred).level
        const isCursed = kindred.meritsFlaws.find((m) => m.name === "Clan Curse")
        if (isCursed) {
            clanBane = Clans[(isCursed.note as ClanName)].bane
        }
        
        return (
            <Grid columns={globals.isPhoneScreen ? 3 : 9}>
                <Grid.Col span={3} style={{ borderRight: !globals.isPhoneScreen ? "1px solid #ccc" : "none" }}>
                    <Center style={{ height: "100%" }}>
                        {kindred.backstory.profilePic === "" ?
                            <FontAwesomeIcon icon={faUser} className="fa-6x" />
                            :
                            <Avatar
                                src={kindred.backstory.profilePic}
                                size={100}
                            />
                        }
                    </Center>
                </Grid.Col>
                <Grid.Col span={3} style={{ borderRight: !globals.isPhoneScreen ? "1px solid #ccc" : "none" }}>
                    <Stack align="center">
                        <Text fz="sm">Name: {name}</Text>
                        <Text fz="sm">Predator Type: {predatorType}</Text>
                        <Text fz="sm">Generation: {generation}</Text>
                        <Text fz="sm">Health: {health}</Text>
                        <Text fz="sm">Willpower: {willpower}</Text>
                        <Text fz="sm">Humanity: {humanity}</Text>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Stack align="center">
                        <Text fz="sm">Clan: {clan}</Text>
                        <Text fz="sm">Compulsion: {compulsion}</Text>
                        <Text fz="sm">Clan Bane: {clanBane}</Text>
                    </Stack>
                </Grid.Col>
            </Grid>
        )
    }

    const attributeSection = () => {
        const textStyle: React.CSSProperties = {
            fontFamily: "Courier New"
        }
        return (
            <Stack>
                <Divider my="sm" label="Attributes" labelPosition="center" />

                <Grid columns={globals.isPhoneScreen ? 4 : 12}>
                    <Grid.Col span={4}>
                        <Title order={4} align="center">Physical</Title>
                        {["strength", "dexterity", "stamina"].map((attribute) => {
                            return (<Center key={attribute}><Group align="center"><Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: </Text><Dots n={v5AttributeLevel(kindred, attribute as V5AttributesKey).level} /> </Group></Center>)
                        })}
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Title order={4} align="center">Social</Title>
                        {["charisma", "manipulation", "composure"].map((attribute) => {
                            return (<Center key={attribute}><Group align="center"><Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: </Text><Dots n={v5AttributeLevel(kindred, attribute as V5AttributesKey).level} /> </Group></Center>)
                        })}
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Title order={4} align="center">Mental</Title>
                        {["intelligence", "wits", "resolve"].map((attribute) => {
                            return (<Center key={attribute}><Group align="center"><Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: </Text><Dots n={v5AttributeLevel(kindred, attribute as V5AttributesKey).level} /> </Group></Center>)
                        })}
                    </Grid.Col>
                </Grid>
            </Stack>
        )
    }

    const skillSection = () => {

        return (
            <Stack>
                <Divider my="sm" label="Skills" labelPosition="center" />
                <Grid columns={12}>
                    <Grid.Col span={4} key={'mental-skills'}>
                        <Title order={4} align='center'>physical</Title>
                        {["athletics", "brawl", "craft", "drive", "firearms", "melee", "larceny", "stealth", "survival"].map((skill) => {
                            let skillName = skill as V5SkillsKey;
                            return (
                                <Center key={skillName}>
                                    <Group>{skill.slice(0, 4)}: <Dots n={v5SkillLevel(kindred, skillName).level} /></Group>
                                </Center>
                            );
                        })}
                    </Grid.Col>
                    <Grid.Col span={4} key={'mental-skills'}>
                        <Title order={4} align='center'>Social</Title>
                        {["animal ken",
                            "etiquette",
                            "insight",
                            "intimidation",
                            "leadership",
                            "performance",
                            "persuasion",
                            "streetwise",
                            "subterfuge",].map((skill) => {
                                let skillName = skill as V5SkillsKey;
                                return (
                                    <Center key={skillName}>
                                        <Group>{skill.slice(0, 4)}: <Dots n={v5SkillLevel(kindred, skillName).level} /></Group>
                                    </Center>
                                );
                            })}
                    </Grid.Col>
                    <Grid.Col span={4} key={'mental-skills'}>
                        <Title order={4} align='center'>Mental</Title>
                        {["academics",
                            "awareness",
                            "finance",
                            "investigation",
                            "medicine",
                            "occult",
                            "politics",
                            "science",
                            "technology",].map((skill) => {
                                let skillName = skill as V5SkillsKey;
                                return (
                                    <Center key={skillName}>
                                        <Group>{skill.slice(0, 4)}: <Dots n={v5SkillLevel(kindred, skillName).level} /></Group>
                                    </Center>
                                );
                            })}
                    </Grid.Col>
                </Grid>
            </Stack>
        );
    };

    const disciplineSection = () => {

        const knownDisciplines = Object.keys(kindred.disciplines).filter((disciplineKey) => {
            const discipline = disciplineKey as DisciplineKey
            return v5DisciplineLevel(kindred, discipline).level > 0;
        })
        let mostDisciplines = allDisciplines.filter((disciplineName) => {
            return disciplineName !== "thin-blood alchemy";
        })
        const disciplinesForClan = kindred.clan === "Caitiff" ? mostDisciplines : Clans[kindred.clan].disciplines;
        const knownInClan = knownDisciplines.filter((disciplineName) => {
            const discipline = disciplineName as DisciplineKey
            return disciplinesForClan.includes(discipline)
        })
        const knownOutClan = knownDisciplines.filter((disciplineName) => {
            const discipline = disciplineName as DisciplineKey
            return !disciplinesForClan.includes(discipline)
        })

        const disciplineCard = (discipline: DisciplineKey) => {
            //const disciplineInfo = disciplines[discipline]
            const disciplineLevel = v5DisciplineLevel(kindred, discipline).level

            return (
                <Grid.Col span={4}>
                    <Card>
                        <Table>
                            <thead>
                                <tr>
                                    <th>
                                        <Group>
                                            {upcase(discipline)} <Dots n={disciplineLevel} />
                                        </Group>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {kindred.powers.map((power, index) => {
                                    let powerInfo = allPowers.find((p) => p.name === power.name);
                                    if (powerInfo?.discipline === discipline) {
                                        return (
                                            <tr key={index}>
                                                <td>{powerInfo.name}</td>
                                            </tr>
                                        );
                                    } else {
                                        return <></>;
                                    }
                                })}
                            </tbody>
                        </Table>
                    </Card>
                </Grid.Col>
            );
        }

        const rituals = kindred.rituals
        const ceremonies = kindred.ceremonies

        const ritualCard = () => {

            return (
                <Card>
                    <Table>
                        <thead>
                            <tr>
                                <td>
                                    Rituals
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {rituals.map((ritual) => {
                                const ritualInfo = Rituals.find((r) => r.name === ritual.name)
                                if (!ritualInfo) { return null }
                                return (
                                    <tr>
                                        <td>
                                            <Group>{ritualInfo.name} {ritualInfo.level}</Group>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Card>
            )
        }

        const ceremonyCard = () => {

            return (
                <Card>
                    <Table>
                        <thead>
                            <tr>
                                <td>
                                    Ceremonies
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {ceremonies.map((ceremony) => {
                                const ritualInfo = Ceremonies.find((r) => r.name === ceremony.name)
                                if (!ritualInfo) { return null }
                                return (
                                    <tr>
                                        <Group>{ritualInfo.name} {ritualInfo.level}</Group>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Card>
            )
        }

        return (
            <div>
                <Divider my="sm" label="Disciplines" labelPosition="center" />

                <Grid columns={12}>
                    {
                        (knownInClan as DisciplineKey[]).map((d) => disciplineCard(d))
                    }
                    {
                        (knownOutClan as DisciplineKey[]).map((d) => disciplineCard(d))
                    }
                </Grid>
                <Divider my="sm" label="Rituals/Ceremonies" labelPosition="center" />
                <Group>
                    {kindred.rituals.length > 0 ?
                        <>{ritualCard()}</>
                        : <></>}
                    {kindred.ceremonies.length > 0 ?
                        <>{ceremonyCard()}</>
                        : <></>}
                </Group>
            </div>
        )

    }

    const backgroundSection = () => {
        const sortedBackgrounds = kindred.backgrounds.sort((a, b) => a.id.localeCompare(b.id))

        const backgroundCard = (background: V5BackgroundRef) => {
            const backgroundInfo = backgroundData.find((b) => b.name === background.name)
            if (!backgroundInfo) { return null }
            return (
                <Grid.Col span={4}>

                    <Card>
                        <Table>
                            <thead>
                                <tr>
                                    <td>
                                        {backgroundInfo.name} {v5BackgroundLevel(background).level}
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {background.advantages.map((advantage) => {
                                    if (!backgroundInfo.advantages) { return null }
                                    const advantageInfo = backgroundInfo.advantages.find((a) => a.name === advantage.name)
                                    const icon = advantageInfo?.type === "disadvantage" ? flawIcon() : meritIcon()
                                    return (
                                        <tr>
                                            <td>
                                                <Text align="center">{icon} &nbsp;{advantage.name} {v5AdvantageLevel(advantage).level}</Text>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Card>
                </Grid.Col>
            )
        }

        return (
            <div>
                <Divider my="sm" label="Backgrounds" labelPosition="center" />
                <Grid columns={12}>
                    {
                        sortedBackgrounds.map((b) => backgroundCard(b))
                    }
                </Grid>
            </div>

        )

    }

    const meritFlawSection = () => {
        const sortedFlaws = kindred.meritsFlaws.filter((merit) => v5GetMeritByName(merit.name)?.type.toLocaleLowerCase() === "flaw".toLowerCase()).sort((a, b) => a.id.localeCompare(b.id))
        const sortedMerits = kindred.meritsFlaws.filter((merit) => v5GetMeritByName(merit.name)?.type.toLocaleLowerCase() === "merit".toLowerCase()).sort((a, b) => a.id.localeCompare(b.id))

        const flawCard = () => {

            return(
                <Card>
                    <thead>
                        <tr>
                            <td>
                                <Text>Flaws</Text>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFlaws.map((flaw) => {
                            return (
                                <tr>
                                    <td>
                                        <Text>{flaw.name} {v5MeritLevel(flaw).level}</Text>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Card>
            )
        }

        const meritCard = () => {

            return(
                <Card>
                    <thead>
                        <tr>
                            <td>
                                <Text>Merits</Text>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMerits.map((flaw) => {
                            return (
                                <tr>
                                    <td>
                                        <Text>{flaw.name} {v5MeritLevel(flaw).level}</Text>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Card>
            )
        }

        return (
            <div>
                <Divider my="sm" label="Merits/Flaws" labelPosition="center" />
                <Group>
                    {sortedMerits.length > 0?
                    <>{meritCard()}</>
                    :<></>}
                    {sortedFlaws.length > 0?
                    <>{flawCard()}</>
                    :<></>}
                </Group>
            </div>
        )
    }

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
            <Stack>
                {topSection()}

                {attributeSection()}

                {skillSection()}

                {disciplineSection()}

                {backgroundSection()}

                {kindred.meritsFlaws.length > 0?
                <>{meritFlawSection()}</>
                :<></>}

            </Stack>
            <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen ? "15%" : "30%" }}>
                <Group>
                    <Button.Group>
                        <Button
                            style={{ margin: "5px" }}
                            color="gray"
                            onClick={backStep}
                        >
                            Back
                        </Button>
                    </Button.Group>
                </Group>
            </Alert>

        </Center>
    )


}

export default V5PrintSheet