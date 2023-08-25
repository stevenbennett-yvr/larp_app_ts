//Technical Imports
import { Center, Input, Group, Button, Table, Text } from "@mantine/core";
//Data Imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened"
import { currentWisdomLevel, handleWisdomChange, findMaxWisdom, Wisdoms } from "../../../data/TatteredVeil/types/Wisdom";

type MageWisdomXpInputsProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void,
}

export default function MageWisdomXpInputs({awakened, setAwakened}: MageWisdomXpInputsProps) {
    return(
        <div>
            <Text mt={"xl"} ta="center" fz="xl" fw={700}>Wisdom</Text>
            <hr style={{width:"50%"}}/>
            <Center>
                <Input.Wrapper 
                    label={`Wisdom ${currentWisdomLevel(awakened).level}`}
                    description={`Total XP for Next: ${currentWisdomLevel(awakened).totalXpNeeded}`}
                    >
                    <Group>
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            onClick={() => handleWisdomChange(awakened, setAwakened, "experiencePoints", awakened.wisdom.experiencePoints - 1)}
                        >
                            -
                        </Button>
                        <Input
                            style={{ width: '60px', margin: '0 8px' }}
                            type="number"
                            key={`Wisdom`}
                            min={0}
                            max={findMaxWisdom(awakened)}
                            value={awakened.wisdom.experiencePoints}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = Number(e.target.value);
                            handleWisdomChange(awakened, setAwakened, "experiencePoints", value);
                            }}
                        />
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            disabled={currentWisdomLevel(awakened).level >=10}
                            onClick={() => handleWisdomChange(awakened, setAwakened, "experiencePoints", awakened.wisdom.experiencePoints + 1)}
                        >
                            +
                        </Button>
                    </Group>
                </Input.Wrapper>
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