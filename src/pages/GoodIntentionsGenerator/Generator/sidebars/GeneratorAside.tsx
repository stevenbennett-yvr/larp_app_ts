import { Aside, Center, ScrollArea, Stack, Table, Title } from "@mantine/core"
import { globals } from "../../../../assets/globals"
import { Kindred } from "../../../../data/GoodIntentions/types/Kindred"
import { bloodPotencyExperience, humanityExperience, ritualExperience, ceremonyExperience, formulaExperience, spentExperience, attributeExperience, skillExperience, backgroundExperience, calculateFloorXp, calculateXpCap, remainingExperience, meritExperience, disciplineExperience } from "../../../../data/GoodIntentions/types/V5Experience"
import { useState, useEffect } from "react"

type AsideBarProps = {
    selectedStep: number
    kindred: Kindred
}

const AsideBar = ({ selectedStep, kindred }: AsideBarProps) => {


    const height = globals.viewportHeightPx
    const scrollerHeight = 940

    const showInstrunctions = () => {
        switch (selectedStep) {
            case 0:
                return (
                    <></>
                );
            case 1:
                return (
                    <div>
                        Select a clan that matches your overall concept and consider why a member of that clan would Embrace your character. Mechanically, your clan determines your character’s innate Disciplines and weaknesses, but, more importantly, clans have stereotypes and expectations placed upon them in the setting. Your character may not reflect those stereotypes based on who they are as a person, but being aware of what other characters will expect is important information.
                    </div>
                );
            case 2:
                return (
                    <div>
                        <p>
                            All characters have talents. All characters have weaknesses. Strengths and vulnerabilities help make them realistic, giving characters fodder for spectacular victories and personal challenges to overcome. By allocating your starting dots in Attributes, you determine what your character’s innate gifts and weaknesses are.
                        </p>
                        <p>
                            You should select your Attributes based on who your character is. Are they a brilliant but easily startled scientist with a manipulative streak? You might set your Intelligence to 4, your Composure to 1 and your Manipulation to 3. Are they a quick-witted street tough with no guile whatsoever? Perhaps they have Wits 3, Strength 4 and Manipulation 1. Remember that Attributes can be raised later by spending XP.
                        </p>
                    </div>
                )
            case 3:
                return (
                    <div>
                        <p>
                            Attributes represent the innate traits and talents a character possesses. However, real people are more than their innate capabilities. People learn, study, and practice various things that go beyond the intrinsic. These acquired Skills represent these personal experiences. A character’s performance in a task is usually tested by combining an innate characteristic (an Attribute) with their training in the relevant activity (a Skill). You can purchase up to five dots in each Skill.
                        </p>
                        <p>
                            You should select your character’s Skills based on their background. Their best Skills should receive high ratings, while Skills they enjoy in a more leisurely way should receive low ratings. Skills they have no training in should be set at zero.
                        </p>
                    </div>
                )
            case 4:
                return (
                    <div>
                        <p>
                            A Vampire’s Generation reflects how close in vampiric lineage they are to the first vampire, Caine. Characters in this system have a Generation one greater than their Sire. Player characters may have a Generation from 9th to 16th. Characters who are 14th through 16th Generation are always thin-blooded.
                        </p>
                        <p>
                            Blood Potency measures how supernaturally strong a vampire’s Blood is. Characters with high Blood Potency can use it to gain bonuses on tests, mend damage more quickly, and occasionally ignore the Hunger cost of using certain powers
                        </p>
                        <p>
                            However, there are drawbacks to high Blood Potency. Potent vampires have increased minimum Hunger scores, more severe Banes, and eventually lose the ability to feed from animals. Eventually, a vampire gains so much Blood Potency that they will even struggle to reduce their Hunger by drinking mortal blood
                        </p>
                    </div>
                )
            case 5:
                return (
                    <div>
                        Each predator in the game has a preferred hunting routine, but they can adapt when necessary. By default, your hunting abilities are based on your Predator Type. Changing your Predator Type requires Storyteller approval and comes with a loss of your old benefits and the acquisition of new ones, which happens within 3 months or 3 game sessions.
                    </div>
                )
            case 6:
                // Backgrounds and Loresheets
                return (
                    <div>
                        <p>
                            Backgrounds in this role-playing game represent your character's connections, assets, or challenges in the real world. You start with 7 free dots of Mortal Connections or related Advantages, in addition to those based on your character's Predator Type. You can also purchase extra Disadvantages, and for each one you buy, you can get a free Advantage dot, with a maximum of 5 extra free Advantage dots this way. You can also spend 3 XP per dot to acquire Mortal Connections and Advantages.
                        </p>
                        <p>

                            You have the option to choose a Loresheet Background, using some of your initial 7 free dots. Loresheet levels are bought separately, not cumulatively, and you can purchase them in any order. You can only invest in one Loresheet, but you can choose one later if you don't do so during character creation.

                        </p>
                    </div>
                )
            case 7:
                // Merits and Flaws
                return (
                    <div>
                        <p>
                            In this game, Merits and Flaws are special traits that impact your character's experience as a vampire. You don't have to choose any except the ones related to your Predator Type. You can take as many additional Flaws as you want. For each extra Flaw you take, you can get a free Merit dot, up to a maximum of 10 free Merit dots this way. You can also buy Merits for 3 XP per dot.
                        </p>
                        <p>
                            Thin-blood characters must choose between 1 to 3 Thin-Blood Merits and an equal number of Thin-Blood Flaws.
                        </p>
                    </div>
                )
            case 8:
                return (
                    <div>
                        <p>
                            Disciplines are the supernatural abilities your character possesses, such as strength, perception, seduction, or transformation. Each vampire clan has its unique set of innate disciplines ("in-clan"). To learn a discipline outside of their clan, a vampire must drink a Rouse check worth of blood from a vampire who has that discipline (in-clan or out-of-clan) and then feed on a mortal with the right Blood Resonance for that discipline. This process must be repeated for each dot of an out-of-clan discipline.
                        </p>
                        <p>
                            However, learning Oblivion or Blood Sorcery as an out-of-clan discipline requires an additional step. The learning vampire must be willingly taught by a vampire who possesses these disciplines as in-clan abilities, involving a downtime action from both the learner and the instructor.
                        </p>
                    </div>
                )
            case 9:
                // Spending Init XP
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
            case 10:
                // Backstory shit
                return (
                    <div>
                        <Title order={4}>Convictions</Title>
                        <p>
                            Characters have up to three unshakable beliefs called Convictions. These beliefs are clearly defined and guide their ethics and actions. Pursuing Convictions reduces the impact of moral transgressions, but violating them may lead to consequences.
                        </p>
                            <Title order={4}>Touchstones</Title>
                        <p>
                            Once you've chosen your character's Convictions, you need to select Touchstones – living, breathing mortals who embody those Convictions. Touchstones serve to anchor your character to their humanity and provide reasons to resist becoming a true monster.
                        </p>
                        <p>
                            For each Conviction your character has, choose a Touchstone that represents it. Each Touchstone can only be linked to one Conviction. These individuals are vital, and if they are lost, the associated Conviction is also lost. Mechanically, Touchstones help maintain your character's Humanity.
                        </p>
                    </div>
                )
            case 11:
                return (
                    <></>
                )
            default:
                return null;
        }
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

export default AsideBar