import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Divider, Group, Card, Text, Center, Stack } from "@mantine/core"
import { v5GetMeritByName, v5MeritLevel } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws"

type PrintSheetProps = {
    kindred: Kindred,
}

const MeritFlawSection = ({kindred}: PrintSheetProps) => {
    const sortedFlaws = kindred.meritsFlaws.filter((merit) => v5GetMeritByName(merit.name)?.type.toLocaleLowerCase() === "flaw".toLowerCase()).sort((a, b) => a.id.localeCompare(b.id))
    const sortedMerits = kindred.meritsFlaws.filter((merit) => v5GetMeritByName(merit.name)?.type.toLocaleLowerCase() === "merit".toLowerCase()).sort((a, b) => a.id.localeCompare(b.id))

    const flawCard = () => {

        return (
            <Card>
                <thead>
                    <tr>
                        <td>
                            <Text>Flaws</Text>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {sortedFlaws.map((flaw) => {
                        if (v5MeritLevel(flaw).level === 0) { return null }
                        return (
                            <tr key={flaw.name}>
                                <td>
                                    <Text>{flaw.name} {v5MeritLevel(flaw).level}</Text>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Card>
        )
    }

    const meritCard = () => {

        return (
            <Card>
                <thead>
                    <tr>
                        <td>
                            <Text>Merits</Text>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {sortedMerits.map((flaw) => {
                        if (v5MeritLevel(flaw).level === 0) { return null }
                        return (
                            <tr key={flaw.id}>
                                <td>
                                    <Text>{flaw.name} {v5MeritLevel(flaw).level}</Text>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
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