import { Aside, Center, ScrollArea, Stack, Table } from "@mantine/core"
import { bloodPotencyExperience, humanityExperience, ritualExperience, ceremonyExperience, formulaExperience, spentExperience, attributeExperience, skillExperience, backgroundExperience, calculateFloorXp, calculateXpCap, remainingExperience, meritExperience, disciplineExperience } from "../../data/GoodIntentions/types/V5Experience"
import { useState, useEffect } from "react"
import { globals } from "../../assets/globals"
import { Kindred } from "../../data/GoodIntentions/types/Kindred"

type AsideBarProps = {
    kindred: Kindred
}

const ExperienceAside = ({ kindred }: AsideBarProps) => {


    const height = globals.viewportHeightPx
    const scrollerHeight = 940

    const showInstrunctions = () => {

                return (
                    <div>
                        <Stack>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Spent</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Attributes</td>
                                        <td>{attributeExperience(kindred)}</td>
                                        <td>
                                            {spentExperience(kindred) !== 0 ?
                                                ((attributeExperience(kindred) / spentExperience(kindred)) * 100).toFixed(2) + "%" :
                                                "0.00%"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Skills</td>
                                        <td>{skillExperience(kindred)}</td>
                                        <td>
                                            {spentExperience(kindred) !== 0 ?
                                                ((skillExperience(kindred) / spentExperience(kindred)) * 100).toFixed(2) + "%" :
                                                "0.00%"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Backgrounds</td>
                                        <td>{backgroundExperience(kindred)}</td>
                                        <td>
                                            {spentExperience(kindred) !== 0 ?
                                                ((backgroundExperience(kindred) / spentExperience(kindred)) * 100).toFixed(2) + "%" :
                                                "0.00%"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Merits/Flaws</td>
                                        <td>{meritExperience(kindred)}</td>
                                        <td>
                                            {spentExperience(kindred) !== 0 ?
                                                ((meritExperience(kindred) / spentExperience(kindred)) * 100).toFixed(2) + "%" :
                                                "0.00%"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Disciplines</td>
                                        <td>{disciplineExperience(kindred)}</td>
                                        <td>
                                            {spentExperience(kindred) !== 0 ?
                                                ((disciplineExperience(kindred) / spentExperience(kindred)) * 100).toFixed(2) + "%" :
                                                "0.00%"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Rituals</td>
                                        <td>{ritualExperience(kindred)}</td>
                                        <td>
                                            {spentExperience(kindred) !== 0 ?
                                                ((ritualExperience(kindred) / spentExperience(kindred)) * 100).toFixed(2) + "%" :
                                                "0.00%"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Ceremonies</td>
                                        <td>{ceremonyExperience(kindred)}</td>
                                        <td>
                                            {spentExperience(kindred) !== 0 ?
                                                ((ceremonyExperience(kindred) / spentExperience(kindred)) * 100).toFixed(2) + "%" :
                                                "0.00%"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Formulae</td>
                                        <td>{formulaExperience(kindred)}</td>
                                        <td>
                                            {spentExperience(kindred) !== 0 ?
                                                ((formulaExperience(kindred) / spentExperience(kindred)) * 100).toFixed(2) + "%" :
                                                "0.00%"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Blood Potency</td>
                                        <td>{bloodPotencyExperience(kindred)}</td>
                                        <td>
                                            {spentExperience(kindred) !== 0 ?
                                                ((bloodPotencyExperience(kindred) / spentExperience(kindred)) * 100).toFixed(2) + "%" :
                                                "0.00%"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Humanity</td>
                                        <td>{humanityExperience(kindred)}</td>
                                        <td>
                                            {spentExperience(kindred) !== 0 ?
                                                ((humanityExperience(kindred) / spentExperience(kindred)) * 100).toFixed(2) + "%" :
                                                "0.00%"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Total Spent</td>
                                        <td>{spentExperience(kindred)}</td>
                                        <td>
                                            {spentExperience(kindred) !== 0 ?
                                                ((spentExperience(kindred) / spentExperience(kindred)) * 100).toFixed(2) + "%" :
                                                "0.00%"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Remaining</td>
                                        <td>{remainingExperience(kindred)}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Ammount</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Experience Ceiling</td>
                                        <td>{50 + calculateXpCap()}</td>
                                    </tr>
                                    <tr>
                                        <td>Experience Floor</td>
                                        <td>{50 + calculateFloorXp()}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Stack>
                    </div>
                )
    }

    const [showAsideBar, setShowAsideBar] = useState(!globals.isSmallScreen)
    useEffect(() => { setShowAsideBar(!globals.isSmallScreen) }, [globals.isSmallScreen])


    return (
        <>
            {showAsideBar ?
                <Aside className='no-print' p="md" hiddenBreakpoint="sm" width={{ xs: 300 }} style={{ zIndex: 0 }}>
                    <ScrollArea h={height - 60} type="never">
                        <Center h={"100%"}>
                            {height <= scrollerHeight ? <ScrollArea h={height - 100}>{showInstrunctions()}</ScrollArea> : <>{showInstrunctions()}</>}
                        </Center>
                    </ScrollArea>
                </Aside>
                : <></>}

        </>
    )
}

export default ExperienceAside