import { Awakened } from "../../data/Awakened"
import { attributeExperience, arcanaExperience, meritExperience, roteExperience, skillExperience, specialityExperience, spentExperience, currentExperience, totalExperience, calculateFloorXp, calculateMaxXp } from "../../data/Experience"
import { Navbar, Table, Stack } from "@mantine/core"
import { useEffect, useState } from "react"
import { globals } from "../../../../globals"

//meritExperience, roteExperience, skillExperience, specialityExperience

type ExperienceAsideProps = {
    awakened: Awakened
}

const ExperienceAside = ({awakened}: ExperienceAsideProps) => {

    const [showAsideBar, setShowAsideBar] = useState(!globals.isSmallScreen)
    useEffect(() => { setShowAsideBar(!globals.isSmallScreen) }, [globals.isSmallScreen])

    return (
        <>
        {showAsideBar? 
        <Navbar width={{ base: 300 }} height={"100%"} p="xs">
            <Stack>
            <Table>
                <thead>
                    <th>Category</th>
                    <th>Spent</th>
                    <th></th>
                </thead>
                <tbody>
                <tr>
                    <td>Attributes</td>
                    <td>{attributeExperience(awakened)}</td>
                    <td>{((attributeExperience(awakened) / spentExperience(awakened)) * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>Arcana</td>
                    <td>{arcanaExperience(awakened)}</td>
                    <td>{((arcanaExperience(awakened) / spentExperience(awakened)) * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>Gnosis</td>
                    <td>{awakened.gnosis.experiencePoints}</td>
                    <td>{((awakened.gnosis.experiencePoints / spentExperience(awakened)) * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>Merit</td>
                    <td>{meritExperience(awakened)}</td>
                    <td>{((meritExperience(awakened) / spentExperience(awakened)) * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>Rotes</td>
                    <td>{roteExperience(awakened)}</td>
                    <td>{((roteExperience(awakened) / spentExperience(awakened)) * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>Skills</td>
                    <td>{skillExperience(awakened)}</td>
                    <td>{((skillExperience(awakened) / spentExperience(awakened)) * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>Specialities</td>
                    <td>{specialityExperience(awakened)}</td>
                    <td>{((specialityExperience(awakened) / spentExperience(awakened)) * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>Wisdom</td>
                    <td>{awakened.wisdom.experiencePoints}</td>
                    <td>{((awakened.wisdom.experiencePoints / spentExperience(awakened)) * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>Total Spent</td>
                    <td>{spentExperience(awakened)}</td>
                    <td>{((spentExperience(awakened) / spentExperience(awakened)) * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>Remaining</td>
                    <td>{currentExperience(awakened)}</td>
                    <td></td>
                </tr>
                </tbody>
            </Table>
            <Table>
                <thead>
                    <th>Category</th>
                    <th>Ammount</th>
                    <th></th>
                </thead>
                <tbody>
                    <tr>
                        <td>Earned Experience</td>
                        <td>{totalExperience(awakened)}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Experience Ceiling</td>
                        <td>{50 + calculateMaxXp()}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Experience Floor</td>
                        <td>{50 + calculateFloorXp()}</td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
            </Stack>
        </Navbar>
        : <></>}
        </>
    )
}

export default ExperienceAside