import { Text, Center, Grid, Tooltip, Image, Card, Title, NumberInput, Stack } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { Clans } from "../../../data/GoodIntentions/types/V5Clans"
import { DisciplineName, disciplines, disciplineKeySchema, DisciplineKey, allDisciplines } from "../../../data/GoodIntentions/types/V5Disciplines"
import { upcase } from "../../../utils/case"
import { useState } from "react"

type DisciplineGridProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
}

const DisciplineGrid = ({ kindred, setKindred }: DisciplineGridProps) => {
    const isPhoneScreen = globals.isPhoneScreen

    let mostDisciplines = allDisciplines.filter((disciplineName) => {
        return disciplineName !== "thin-blood alchemy";
    })

    const disciplinesForClan = kindred.clan === "Caitiff" ? mostDisciplines : Clans[kindred.clan].disciplines;
    const otherDisciplines = mostDisciplines.filter((disciplineName) => {
        // Add a condition to filter out "thin blood alchemy"
        return !disciplinesForClan.includes(disciplineName);
    });

    const [inClanFirst, inClanSecond, inClanThird] = disciplinesForClan;

    const [inClanDots, setInClanDots] = useState<number[]>(
        [kindred.disciplines[inClanFirst].creationPoints, kindred.disciplines[inClanSecond].creationPoints, kindred.disciplines[inClanThird].creationPoints]
    );

    const handleDisciplineCreationPointChange = (discipline: DisciplineKey, val: number): void => {

        const updatedDisciplines = {
            ...kindred.disciplines,
            [discipline]: {
                ...kindred.disciplines[discipline],
                creationPoints: val
            }
        }

        setInClanDots(
            [updatedDisciplines[inClanFirst].creationPoints, updatedDisciplines[inClanSecond].creationPoints, updatedDisciplines[inClanThird].creationPoints]
        )

        setKindred({
            ...kindred,
            disciplines: updatedDisciplines,
            powers: []
        })
    }

    const createDisciplinePicker = (discipline: DisciplineName, inClan: boolean) => {
        const totalPoints = Object.values(kindred.disciplines).reduce(
            (acc, d) => acc + d.creationPoints,
            0
        );
        const isMaxedOut = totalPoints === 4;

        const isCategoryCreationPointsZero = kindred.disciplines[discipline].creationPoints === 0;

        const isDisabled = isMaxedOut && isCategoryCreationPointsZero ? true : (!inClan && !(inClanDots.includes(1) && inClanDots.includes(2)));
        const maxPoints = isMaxedOut ? 0 : inClanDots.includes(2) ? 1 : 2;


        return (
            <Grid.Col key={`${discipline} Card`} span={2}>
                <Tooltip
                    multiline
                    width={220}
                    withArrow
                    transitionProps={{ duration: 400 }} // Adjust the duration as needed
                    label={disciplines[discipline].summary}
                    position={globals.isPhoneScreen ? "bottom" : "top"}
                    events={{ hover: true, focus: false, touch: false }}
                >
                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                    >
                        <Card.Section>
                            <Center>
                                <Image
                                    fit="contain"
                                    withPlaceholder
                                    src={disciplines[discipline].logo}
                                    height={50}
                                    width={50}
                                    alt="order"
                                    style={isDisabled ? { filter: "brightness(0)" } : {}}
                                />
                            </Center>
                            <Center>
                                <Title h={30} size="sm" color="dimmed" ta="center">
                                    {upcase(discipline)}
                                </Title>
                            </Center>
                            <NumberInput
                                key={`${discipline} input`}
                                min={0}
                                max={maxPoints}
                                disabled={isDisabled}
                                value={kindred.disciplines[discipline].creationPoints}
                                onChange={(val: number) =>
                                    handleDisciplineCreationPointChange(discipline, val)
                                }
                            >
                            </NumberInput>
                        </Card.Section>
                    </Card>
                </Tooltip>
            </Grid.Col>
        )
    }

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '60px', paddingBottom: globals.isPhoneScreen ? '120px' : '60px' }}>
            <Stack mt={"xl"} align="center" spacing="xl">
                {kindred.clan === "Caitiff" ?
                    <Grid key="Caitiff disciplines" columns={isPhoneScreen ? 4 : 8} grow m={0}>
                        {
                            disciplinesForClan.map((o) => disciplineKeySchema.parse(o)).map((discipline) => createDisciplinePicker(discipline, true))
                        }
                    </Grid>
                    :
                    <div>
                        <Grid columns={isPhoneScreen ? 4 : 6} grow m={0}>
                            {
                                disciplinesForClan.map((o) => disciplineKeySchema.parse(o)).map((discipline) => createDisciplinePicker(discipline, true))
                            }
                        </Grid>
                        <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">Out-of-Clan</Text>

                        <Grid columns={isPhoneScreen ? 4 : 8} grow m={0}>
                            {
                                otherDisciplines.map((o) => disciplineKeySchema.parse(o)).map((discipline) => createDisciplinePicker(discipline, false))
                            }
                        </Grid>
                    </div>
                }
            </Stack>
        </Center>

    )
}

export default DisciplineGrid