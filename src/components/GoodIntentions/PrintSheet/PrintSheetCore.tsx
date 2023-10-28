import React from "react";

// Mantine components
import {
    Center,
    Grid,
    Avatar,
    Stack,
    Text,
    Title,
    Group,
    Card,
    Table,
    Divider,
    List,
    Checkbox,
    ScrollArea
} from "@mantine/core";

// FontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons";

// Data and types
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { generations } from "../../../data/GoodIntentions/types/V5Generation";
import { ClanName, Clans } from "../../../data/GoodIntentions/types/V5Clans";
import { v5AttributeLevel, V5AttributesKey } from "../../../data/GoodIntentions/types/V5Attributes";
import { v5SkillLevel, V5SkillsKey } from "../../../data/GoodIntentions/types/V5Skills";
import { v5DisciplineLevel, allDisciplines, DisciplineKey } from "../../../data/GoodIntentions/types/V5Disciplines";
import { allPowers } from "../../../data/GoodIntentions/types/V5Powers";
import { upcase } from "../../../utils/case";
import { Rituals } from "../../../data/GoodIntentions/types/V5Rituals";
import { Ceremonies } from "../../../data/GoodIntentions/types/V5Ceremonies";
import { V5BackgroundRef, backgroundData, v5BackgroundLevel, v5AdvantageLevel, kindredBackgrounds } from "../../../data/GoodIntentions/types/V5Backgrounds";
import { v5GetMeritByName, v5MeritLevel } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws";
import { GoodIntentionsVSSs } from "../../../data/CaM/types/VSS";
import { v5HumanityLevel } from "../../../data/GoodIntentions/types/V5Humanity";

// Utility functions and components
import Dots from "../../../utils/dots";
import { globals } from "../../../assets/globals";
import { v5BloodPotencyLevel } from "../../../data/GoodIntentions/types/V5BloodPotency";
import { Formulae } from "../../../data/GoodIntentions/types/V5Formulae";

type PrintSheetProps = {
    kindred: Kindred,
    vssId: string | undefined,
}

const flawIcon = () => {
    return <FontAwesomeIcon icon={faCircleDown} style={{ color: "#e03131" }} />
}
const meritIcon = () => {
    return <FontAwesomeIcon icon={faCircleUp} style={{ color: "rgb(47, 158, 68)", }} />
}

/* function renderCheckboxes(number: number, set: boolean) {
    const checkboxes = [];
    for (let i = 0; i < number; i++) {
        checkboxes.push(
            <Checkbox defaultChecked={set} key={i} color="red" indeterminate />
        );

        // Check if the current checkbox should start a new row
        if (i > 0 && (i + 1) % 5 === 0) {
            checkboxes.push(<br key={`br-${i}`} />); // Add a line break to start a new row
        }
    }
    return checkboxes;
} */


function renderCheckboxes(number: number, set: boolean) {
    const groups = [];

    for (let i = 0; i < number; i += 5) {
        const groupCheckboxes = [];
        for (let j = 0; j < 5 && i + j < number; j++) {
            groupCheckboxes.push(
                <Checkbox defaultChecked={set} key={i + j} color="red" indeterminate />
            );
        }

        groups.push(
            <Group key={i} spacing={2}>
                {groupCheckboxes}
            </Group>
        );
    }

    return (
        <Stack spacing="xs">
            {groups}
        </Stack>
    );
}

function renderHumanityCheckboxes(humanity: number) {
    const groups = [];

    for (let i = 0; i < 10; i += 5) {
        const groupCheckboxes = [];
        for (let j = 0; j < 5 && i + j < 10; j++) {
            groupCheckboxes.push(
                <Checkbox
                    key={i + j}
                    color="violet"
                    indeterminate
                    disabled={i + j < humanity}
                />
            );
        }

        groups.push(
            <Group key={i} spacing={2}>
                {groupCheckboxes}
            </Group>
        );
    }

    return (
        <Stack spacing="xs">
            {groups}
        </Stack>
    );
}

const PrintSheetCore = ({ kindred, vssId }: PrintSheetProps) => {
    const venueData = GoodIntentionsVSSs.find((venue) => venue.venueStyleSheet.id === vssId);
    if (!venueData) { return null }

    const topSection = () => {
        const name = kindred.name
        const concept = kindred.concept
        const clan = kindred.clan
        const venueName = venueData.venueStyleSheet.name
        const generation = generations[kindred.generation].generation
        const predatorType = kindred.predatorType

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
                        <Text fz="sm">Concept: {concept}</Text>
                        <Text fz="sm">Venue: {venueName}</Text>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Stack align="center">
                        <Text fz="sm">Clan: {clan}</Text>
                        <Text fz="sm">Generation: {generation}</Text>
                        <Text fz="sm">Predator Type: {predatorType}</Text>
                    </Stack>
                </Grid.Col>
            </Grid>
        )
    }

    const middleSection = () => {
        const tenants = venueData?.goodIntentionsVariables.tenants
        let clanBane = Clans[kindred.clan].bane
        const isCursed = kindred.meritsFlaws.find((m) => m.name === "Clan Curse")
        if (isCursed) {
            clanBane = Clans[(isCursed.note as ClanName)].bane
        }
        return (
            <div>
                <Divider my="sm" labelPosition="center" />

                <Grid columns={globals.isPhoneScreen ? 3 : 9}>
                    <Grid.Col span={3} style={{ borderRight: !globals.isPhoneScreen ? "1px solid #ccc" : "none" }}>
                        <Stack>
                            <Title order={4} align="center">Tenants</Title>
                            <Center>
                                <List>
                                    {Object.entries(tenants).map(([key, value]) => (
                                        <List.Item key={key} fz="sm"><b>{upcase(key)}</b>: {value}</List.Item>
                                    ))}
                                </List>
                            </Center>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={3} style={{ borderRight: !globals.isPhoneScreen ? "1px solid #ccc" : "none" }}>
                        <Stack>
                            <Title order={4} align="center">Touchstones</Title>
                            <Center>
                                <List size="sm">
                                    {kindred.touchstones.map((stone, i) => {
                                        return (
                                            <List.Item
                                                icon={
                                                    <Avatar radius="xs" src={stone.pic} />
                                                }
                                                key={i}>
                                                <Text>
                                                    <b>{stone.name}</b>
                                                </Text>
                                                <List.Item>
                                                    <Text c="dimmed" align="center">
                                                        {stone.conviction}
                                                    </Text>
                                                </List.Item>
                                            </List.Item>
                                        )
                                    })}
                                </List>
                            </Center>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Stack>
                            <Title order={4} align="center">Clan Bane</Title>
                            <Text fz="sm">{clanBane}</Text>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </div>

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
                <Grid columns={globals.isPhoneScreen ? 4 : 12}>
                    <Grid.Col span={4} key={'physical-skills'}>
                        <Title order={4} align='center'>physical</Title>
                        {["athletics", "brawl", "crafts", "drive", "firearms", "melee", "larceny", "stealth", "survival"].map((skill) => {
                            let skillName = skill as V5SkillsKey;
                            return (
                                <Center key={skillName}>
                                    <Group>{skill.slice(0, 4)}: <Dots n={v5SkillLevel(kindred, skillName).level} /></Group>
                                </Center>
                            );
                        })}
                    </Grid.Col>
                    <Grid.Col span={4} key={'social-skills'}>
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

        const health = v5AttributeLevel(kindred, "stamina").level + 3



        const willpower = v5AttributeLevel(kindred, "resolve").level + v5AttributeLevel(kindred, "composure").level
        const humanity = v5HumanityLevel(kindred).level
        const bloodPotency = v5BloodPotencyLevel(kindred).level

        const disciplineTable = (discipline: DisciplineKey) => {
            const disciplineLevel = v5DisciplineLevel(kindred, discipline).level

            return (
                <Card>
                    <Table fz="sm">
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
                                            <td>{powerInfo.level} {powerInfo.name}</td>
                                        </tr>
                                    );
                                } else {
                                    return <></>;
                                }
                            })}
                        </tbody>
                    </Table>
                </Card>
            )
        }

        const disciplineColumn = (disciplines: DisciplineKey[]) => {
            //const disciplineInfo = disciplines[discipline]

            return (
                <Grid.Col span={4}>
                    <Stack>
                        {
                            (disciplines as DisciplineKey[]).map((d) => disciplineTable(d))
                        }
                    </Stack>
                </Grid.Col>
            );
        }

        const coreVals = () => {

            return (
                <Grid.Col span={4}>
                    <Stack>
                        <Title order={5} align="center">Health</Title>
                        <Center>
                            {renderCheckboxes(health, false)}
                        </Center>
                        <Title order={5} align="center">Willpower</Title>
                        <Center>
                            {renderCheckboxes(willpower, true)}
                        </Center>
                        <Title order={5} align="center">Humanity/Stains</Title>
                        <Center>
                            {renderHumanityCheckboxes(humanity)}
                        </Center>
                        <Title order={5} align="center">Blood Potency</Title>
                        <Center>
                            <Dots n={bloodPotency} />
                        </Center>
                    </Stack>
                </Grid.Col>
            )

        }


        const rituals = kindred.rituals
        const ceremonies = kindred.ceremonies
        const formulae = kindred.formulae

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
                                    <tr key={ritual.name}>
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
                                    <tr key={ceremony.name}>
                                        <Group>{ritualInfo.name} {ritualInfo.level}</Group>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Card>
            )
        }

        const formulaCard = () => {
            return (
                <Card>
                    <Table>
                        <thead>
                            <tr>
                                <td>
                                    Formulae
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {formulae.map((formula) => {
                                const ritualInfo = Formulae.find((f) => f.name === formula.name)
                                if (!ritualInfo) { return null }
                                return (
                                    <tr key={formula.name}>
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
                        disciplineColumn(knownInClan as DisciplineKey[])
                    }
                    {
                        disciplineColumn(knownOutClan as DisciplineKey[])
                    }
                    {
                        coreVals()
                    }
                </Grid>


                {kindred.rituals.length === 0 && kindred.ceremonies.length === 0 && kindred.formulae.length === 0 ? <></>
                    :
                    <>
                        <Divider my="sm" label="Rituals/Ceremonies" labelPosition="center" />
                        <Group>
                            {kindred.rituals.length > 0 ?
                                <>{ritualCard()}</>
                                : <></>}
                            {kindred.ceremonies.length > 0 ?
                                <>{ceremonyCard()}</>
                                : <></>}
                            {kindred.formulae.length > 0 ?
                                <>{formulaCard()}</>
                                : <></>}
                        </Group>
                    </>
                }
            </div>
        )

    }

    const backgroundSection = () => {
        const sortedBackgrounds = kindredBackgrounds(kindred)

        const backgroundCard = (background: V5BackgroundRef) => {
            const backgroundInfo = backgroundData.find((b) => b.name === background.name)
            if (!backgroundInfo) { return null }
            return (
                <Grid.Col span={4} key={background.id}>

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
                                    if (!backgroundInfo.advantages || v5AdvantageLevel(advantage).level < 1) { return null }
                                    const advantageInfo = backgroundInfo.advantages.find((a) => a.name === advantage.name)
                                    const icon = advantageInfo?.type === "disadvantage" ? flawIcon() : meritIcon()
                                    return (
                                        <tr key={advantage.name}>
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

        const loresheetCard = () => {
            return (
                <div>
                    {
                        kindred.loresheet.benefits.length > 0 ?
                            <Stack>
                                <Text><b>Loresheet:</b> {kindred.loresheet.name}</Text>
                                <List>
                                    {kindred.loresheet.benefits.map((benefit) => {
                                        return (
                                            <List.Item key={benefit.name}>
                                                <Text>{benefit.name}</Text>
                                            </List.Item>
                                        )
                                    })}
                                </List>
                            </Stack>
                            : <></>
                    }
                </div>
            )
        }

        return (
            <div>
                <Divider my="sm" label="Backgrounds" labelPosition="center" />
                <Grid columns={12}>
                    <Grid.Col span={4}>
                        {
                            loresheetCard()
                        }
                    </Grid.Col>
                    <Grid columns={8}>
                        {
                            sortedBackgrounds.map((b) => backgroundCard(b))
                        }
                    </Grid>
                </Grid>
            </div>

        )

    }

    const meritFlawSection = () => {
        const sortedFlaws = kindred.meritsFlaws.filter((merit) => v5GetMeritByName(merit.name)?.type.toLocaleLowerCase() === "flaw".toLowerCase()).sort((a, b) => a.id.localeCompare(b.id))
        const sortedMerits = kindred.meritsFlaws.filter((merit) => v5GetMeritByName(merit.name)?.type.toLocaleLowerCase() === "merit".toLowerCase()).sort((a, b) => a.id.localeCompare(b.id))

        const flawCard = () => {

            return (
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
                                <tr key={flaw.name}>
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

            return (
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
                                <tr key={flaw.id}>
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
                    {sortedMerits.length > 0 ?
                        <>{meritCard()}</>
                        : <></>}
                    {sortedFlaws.length > 0 ?
                        <>{flawCard()}</>
                        : <></>}
                </Group>
            </div>
        )
    }

    const height = globals.viewportHeightPx

    return (
        <ScrollArea h={height - 220} pb={20}>
        <Stack>
            {topSection()}

            {attributeSection()}

            {skillSection()}

            {middleSection()}

            {disciplineSection()}

            {backgroundSection()}

            {kindred.meritsFlaws.length > 0 ?
                <>{meritFlawSection()}</>
                : <></>}

        </Stack>
        </ScrollArea>
    )


}

export default PrintSheetCore