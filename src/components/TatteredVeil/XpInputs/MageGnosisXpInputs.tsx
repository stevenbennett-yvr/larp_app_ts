import { Center, Group, Button, Input, Table, Text } from "@mantine/core"
import { globals } from "../../../assets/globals"
//Data Imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened"
import { Gnoses, currentGnosisLevel, handleGnosisChange, findMaxGnosis } from "../../../data/TatteredVeil/types/Gnosis"

type MageGnosisXpInputsProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void,
}

const MageGnosisXpInputs = ({ awakened, setAwakened }: MageGnosisXpInputsProps) => {

    return (
        <div>
            <Text mt={"xl"} ta="center" fz="xl" fw={700}>Gnosis</Text>
            <hr style={{ width: "50%" }} />
            <Center>
                <Input.Wrapper
                    label={`Gnosis ${currentGnosisLevel(awakened).level}`}
                    description={`Total XP for Next: ${currentGnosisLevel(awakened).totalXpNeeded}`}
                >
                    <Group>
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            onClick={() => handleGnosisChange(awakened, setAwakened, "experiencePoints", awakened.gnosis.experiencePoints - 1)}
                        >
                            -
                        </Button>
                        <Input
                            style={{ width: '60px', margin: '0 8px' }}
                            type="number"
                            key={`Gnosis`}
                            min={0}
                            max={findMaxGnosis(awakened)}
                            value={awakened.gnosis.experiencePoints}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = Number(e.target.value);
                                handleGnosisChange(awakened, setAwakened, "experiencePoints", value);
                            }}
                        />
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            disabled={currentGnosisLevel(awakened).level >= 6}
                            onClick={() => handleGnosisChange(awakened, setAwakened, "experiencePoints", awakened.gnosis.experiencePoints + 1)}
                        >
                            +
                        </Button>
                    </Group>
                </Input.Wrapper>
            </Center>

                            <Center>
            {globals.isPhoneScreen ?
                <Table style={{maxWidth:"300px"}}>
                    <tbody>
                        <tr>
                            <td>Mana Max/Per Turn:</td>
                            <td>{Gnoses[currentGnosisLevel(awakened).level].mana}</td>
                        </tr>
                        <tr>
                            <td>Active Spells:</td>
                            <td>{Gnoses[currentGnosisLevel(awakened).level].activeSpells}</td>
                        </tr>
                        {Gnoses[currentGnosisLevel(awakened).level].aura !== "" ?
                            <tr>
                                <td>Aura:</td>
                                <td>{Gnoses[currentGnosisLevel(awakened).level].aura}</td>
                            </tr>
                            : <></>}
                        <tr>
                            <td>Paradox Pool:</td>
                            <td>{Gnoses[currentGnosisLevel(awakened).level].paradoxPool}</td>
                        </tr>
                        <tr>
                            <td>Extended Casting Time/Breaks:</td>
                            <td>{Gnoses[currentGnosisLevel(awakened).level].extendedCasting}</td>
                        </tr>
                        {Gnoses[currentGnosisLevel(awakened).level].combinedSpells !== 0 ?
                            <tr>
                                <td>Combined Spells: </td>
                                <td>{Gnoses[currentGnosisLevel(awakened).level].combinedSpells}</td>
                            </tr>
                            : <></>}
                        <tr>
                            <td>Aimed Spell:</td>
                            <td>{Gnoses[currentGnosisLevel(awakened).level].aimedSpell}</td>
                        </tr>
                    </tbody>
                </Table>
                :
                <Table striped withColumnBorders fontSize="xs">
                    <thead>
                        <tr>
                            <th>
                                Mana Max/Per Turn
                            </th>
                            <th>
                                Active Spells
                            </th>
                            {Gnoses[currentGnosisLevel(awakened).level].aura !== "" ? <th>Aura</th> : <></>}
                            <th>
                                Paradox Pool
                            </th>
                            <th>
                                Extended Casting Time/Breaks
                            </th>
                            {Gnoses[currentGnosisLevel(awakened).level].combinedSpells !== 0 ? <th>Combined Spells</th> : <></>}
                            <th>Aimed Spell <p />(Short/Med -2/ Long -4)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{Gnoses[currentGnosisLevel(awakened).level].mana}</td>
                            <td>{Gnoses[currentGnosisLevel(awakened).level].activeSpells}</td>
                            {Gnoses[currentGnosisLevel(awakened).level].aura !== "" ? <td>{Gnoses[currentGnosisLevel(awakened).level].aura}</td> : <></>}
                            <td>{Gnoses[currentGnosisLevel(awakened).level].paradoxPool}</td>
                            <td>{Gnoses[currentGnosisLevel(awakened).level].extendedCasting}</td>
                            {Gnoses[currentGnosisLevel(awakened).level].combinedSpells !== 0 ? <td>{Gnoses[currentGnosisLevel(awakened).level].combinedSpells}</td> : <></>}
                            <td>{Gnoses[currentGnosisLevel(awakened).level].aimedSpell}</td>
                        </tr>
                        <tr>
                            <td colSpan={8}>Arcana Mastery: {Gnoses[currentGnosisLevel(awakened).level].arcanaMastery.join(" ● ")}</td>
                        </tr>
                    </tbody>
                </Table>}
                </Center>


        </div>
    )
}

export default MageGnosisXpInputs