
import { Text, Center, Input, Group, Button, Table } from "@mantine/core";
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { v5HumanityLevel, findMaxHumanity, handleHumanityChange, humanities } from "../../../data/GoodIntentions/types/V5Humanity";

type V5BloodPotenceXpInputProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
}

const V5HumanityXpInput = ({kindred, setKindred}:V5BloodPotenceXpInputProps) => {

    return (
        <div>
            <Text mt={"xl"} ta="center" fz="xl" fw={700}>Humanity</Text>
            <Center>
                <Input.Wrapper
                    label={`Humanity ${v5HumanityLevel(kindred).level}`}
                >
                    <Text size="12px" color="gray.6">Xp for Next: {v5HumanityLevel(kindred).totalXpNeeded - kindred.humanity.experiencePoints}</Text>
                    <Text size="12px" color="gray.6">Total XP Needed {v5HumanityLevel(kindred).totalXpNeeded}</Text>
                    <Group>
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            disabled={kindred.generation <= 9 && kindred.humanity.experiencePoints <= 20}
                            onClick={() => handleHumanityChange(kindred, setKindred, "experiencePoints", kindred.humanity.experiencePoints - 1)}
                        >
                            -
                        </Button>
                        <Input
                            style={{ width: '60px', margin: '0 8px' }}
                            type="number"
                            key={`Gnosis`}
                            min={kindred.generation <= 9? 20:0}
                            max={findMaxHumanity(kindred)}
                            value={kindred.humanity.experiencePoints}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = Number(e.target.value);
                                handleHumanityChange(kindred, setKindred, "experiencePoints", value);
                            }}
                        />
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            disabled={v5HumanityLevel(kindred).level >= 10}
                            onClick={() => handleHumanityChange(kindred, setKindred, "experiencePoints", kindred.humanity.experiencePoints + 1)}
                        >
                            +
                        </Button>
                    </Group>
                </Input.Wrapper>
            </Center>
            <Table striped highlightOnHover withColumnBorders>
                    <thead>
                        <tr>
                            <td>Frenzy Resist</td>
                            <td>Topor Length</td>
                            <td>Details</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{humanities[v5HumanityLevel(kindred).level].frenzyResist}</td>
                            <td>{humanities[v5HumanityLevel(kindred).level].toporLength}</td>
                            <td dangerouslySetInnerHTML={{ __html: `${humanities[v5HumanityLevel(kindred).level].other}</p>` }} />

                        </tr>
                    </tbody>
                </Table>
        </div>
    )
}

export default V5HumanityXpInput