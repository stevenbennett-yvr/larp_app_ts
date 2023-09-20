import { Text, Center, Grid, Tooltip, Image, Card, Title, NumberInput, Stack, Alert, Group, Button } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { Clans } from "../../../data/GoodIntentions/types/V5Clans"
import { DisciplineName, allDisciplines, disciplines, disciplineKeySchema } from "../../../data/GoodIntentions/types/V5Disciplines"
import { upcase } from "../../../utils/case"

type DisciplinesPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    backStep: () => void
}

const DisciplinesPicker = ({ kindred, setKindred, nextStep, backStep }: DisciplinesPickerProps) => {
    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const disciplinesForClan = Clans[kindred.clan].disciplines
    const otherDisciplines = allDisciplines.filter((disciplineNAme) => !disciplinesForClan.includes(disciplineNAme))

    const createDisciplinePicker = (discipline: DisciplineName, inClan: boolean) => {

        return (
            <Grid.Col key={discipline} span={2}>
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
                                    style={!inClan ? { filter: "brightness(0)" } : {}}
                                />
                            </Center>
                            <Center>
                                <Title h={30} size="sm" color="dimmed" ta="center">
                                    {upcase(discipline)}
                                </Title>
                            </Center>
                            <NumberInput
                                key={`${discipline}`}
                                min={0}
                                max={2}
                                disabled={!inClan}
                                value={kindred.disciplines[discipline].creationPoints}
                                onChange={(val: number) =>
                                    setKindred({
                                        ...kindred,
                                        disciplines: {
                                            ...kindred.disciplines,
                                            [discipline]: {
                                                ...kindred.disciplines[discipline],
                                                creationPoints: val
                                            }
                                        }
                                    })
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

                <Group ta={"center"}>
                    <Text >
                        One In-Clan discipline at 2;
                    </Text>
                    <Text >
                        One In-Clan discipline at 1;
                    </Text>
                    <Text >
                        and one In-Clan or Out-of-Clan Discipline at 1;
                    </Text>
                </Group>
                <Text mt={"xl"} ta="center" fz="xl" fw={700} c="red">In-Clan</Text>

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
                        >
                            Next
                        </Button>
                    </Button.Group>
                </Group>
            </Alert>
        </Center>

    )
}

export default DisciplinesPicker