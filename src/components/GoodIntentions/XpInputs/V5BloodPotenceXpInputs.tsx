
import { Text, Center, Input, Group, Button, Table } from "@mantine/core";
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { generations } from "../../../data/GoodIntentions/types/V5Generation";
import { bloodPotencies, v5BloodPotencyLevel, handleBloodPotencyChange } from "../../../data/GoodIntentions/types/V5BloodPotency";

type V5BloodPotenceXpInputProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
}

const V5BloodPotenceXpInput = ({kindred, setKindred}:V5BloodPotenceXpInputProps) => {

    let hasIronGullet = kindred.meritsFlaws.some((mf) => mf.name === "Iron Gullet")
    let hasFarmer = kindred.meritsFlaws.some((mf) => mf.name === "Farmer")

    let bp3 = hasIronGullet || hasFarmer

    let disabled = bp3? v5BloodPotencyLevel(kindred).level >= 2:v5BloodPotencyLevel(kindred).level >= generations[kindred.generation].max_bp

    return (
        <div>
            <Text mt={"xl"} ta="center" fz="xl" fw={700}>Blood Potency</Text>
            <Center>
                <Input.Wrapper
                    label={`Blood Potency ${v5BloodPotencyLevel(kindred).level}`}
                >
                    <Text size="12px" color="gray.6">Xp for Next: {v5BloodPotencyLevel(kindred).totalXpNeeded - kindred.bloodPotency.experiencePoints}</Text>
                    <Text size="12px" color="gray.6">Total XP Needed {v5BloodPotencyLevel(kindred).totalXpNeeded}</Text>
                    <Group>
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            disabled={kindred.generation <= 9 && kindred.bloodPotency.experiencePoints <= 20}
                            onClick={() => handleBloodPotencyChange(kindred, setKindred, "experiencePoints", kindred.bloodPotency.experiencePoints - 1)}
                        >
                            -
                        </Button>
                        <Input
                            style={{ width: '60px', margin: '0 8px' }}
                            type="number"
                            key={`Gnosis`}
                            min={kindred.generation <= 9? 20:0}
                            max={disabled?kindred.bloodPotency.experiencePoints:undefined}
                            value={kindred.bloodPotency.experiencePoints}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = Number(e.target.value);
                                handleBloodPotencyChange(kindred, setKindred, "experiencePoints", value);
                            }}
                        />
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            disabled={disabled}
                            onClick={() => handleBloodPotencyChange(kindred, setKindred, "experiencePoints", kindred.bloodPotency.experiencePoints + 1)}
                        >
                            +
                        </Button>
                    </Group>
                </Input.Wrapper>

            </Center>
            <Table striped highlightOnHover withColumnBorders>
                    <thead>
                        <tr>
                            <td>Blood Surge Bonus</td>
                            <td>Mending Damage</td>
                            <td>Disipline Defense</td>
                            <td>Disipline Rouse Bonus</td>
                            <td>Bane Severity</td>
                            <td>Penalty</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{bloodPotencies[v5BloodPotencyLevel(kindred).level].surgeBonus}</td>
                            <td>{bloodPotencies[v5BloodPotencyLevel(kindred).level].mend}</td>
                            <td>{bloodPotencies[v5BloodPotencyLevel(kindred).level].defnese}</td>
                            <td>{bloodPotencies[v5BloodPotencyLevel(kindred).level].rouseBonus}</td>
                            <td>{bloodPotencies[v5BloodPotencyLevel(kindred).level].baneSeverity}</td>
                            <td>{bloodPotencies[v5BloodPotencyLevel(kindred).level].feedingPenalty}</td>

                        </tr>
                    </tbody>
                </Table>
        </div>
    )
}

export default V5BloodPotenceXpInput