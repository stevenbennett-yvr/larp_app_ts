import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Divider, Group, Center, Stack, Table, Card } from "@mantine/core"
import { v5GetMeritByName, v5MeritLevel, getMeritIcon, MeritFlawCategory } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


type PrintSheetProps = {
    kindred: Kindred,
}

const MeritFlawSection = ({ kindred }: PrintSheetProps) => {
    const sortedFlaws = kindred.meritsFlaws.filter((merit) => v5GetMeritByName(merit.name)?.type.toLocaleLowerCase() === "flaw".toLowerCase()).sort((a, b) => a.id.localeCompare(b.id))
    const sortedMerits = kindred.meritsFlaws.filter((merit) => v5GetMeritByName(merit.name)?.type.toLocaleLowerCase() === "merit".toLowerCase()).sort((a, b) => a.id.localeCompare(b.id))

    const flawCard = () => {

        return (
            <Card>
                <Table>
                    <thead>
                        <tr>
                            <td>
                                Flaws
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFlaws.map((flaw) => {
                            if (v5MeritLevel(flaw).level === 0) { return null }
                            const flawInfo = v5GetMeritByName(flaw.name)
                            return (
                                <tr key={flaw.name}>
                                    <td>
                                        <Group>
                                        <FontAwesomeIcon icon={getMeritIcon(flawInfo.category as MeritFlawCategory)} style={{ color: "#e03131" }} />
                                        {flaw.name} {v5MeritLevel(flaw).level}
                                        </Group>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Card>
        )
    }

    const meritCard = () => {

        return (
            <Card>
                <Table>
                    <thead>
                        <tr>
                            <td>
                                Merits
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMerits.map((flaw) => {
                            if (v5MeritLevel(flaw).level === 0) { return null }
                            const flawInfo = v5GetMeritByName(flaw.name)
                            return (
                                <tr key={flaw.id}>
                                    <td>
                                        <Group>
                                            <FontAwesomeIcon icon={getMeritIcon(flawInfo.category as MeritFlawCategory)} style={{ color: "rgb(47, 158, 68)" }} />
                                            {flaw.name} {v5MeritLevel(flaw).level}
                                        </Group>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Card>
        )
    }



    return (
        <Center>
            <Stack>
                <Divider my="sm" label="Merits/Flaws" labelPosition="center" />
                <Group>
                    {sortedMerits.length > 0 ?
                        <>{meritCard()}</>
                        : <></>}
                    {sortedFlaws.length > 0 ?
                        <>{flawCard()}</>
                        : <></>}
                </Group>
            </Stack>
        </Center>
    )
}

export default MeritFlawSection