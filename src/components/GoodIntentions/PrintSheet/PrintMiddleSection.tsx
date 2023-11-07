import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { GoodIntentionsVenueStyleSheet } from "../../../data/CaM/types/VSS"
import { Clans, ClanName } from "../../../data/GoodIntentions/types/V5Clans"
import { Grid, Divider, Title, Center, Stack, List, Avatar, Text } from "@mantine/core"
import { globals } from "../../../assets/globals"
import { upcase } from "../../../utils/case"
import { bloodPotencies, v5BloodPotencyLevel } from "../../../data/GoodIntentions/types/V5BloodPotency"

type PrintSheetProps = {
    kindred: Kindred,
    venueData: GoodIntentionsVenueStyleSheet,
}

const MiddleSection = ({ kindred, venueData }: PrintSheetProps) => {
    const tenants = venueData?.goodIntentionsVariables.tenants
    let clanBane = Clans[kindred.clan].bane
    const isCursed = kindred.meritsFlaws.find((m) => m.name === "Clan Curse")
    if (isCursed) {
        clanBane = Clans[(isCursed.note as ClanName)].bane
    }
    return (
        <Center>
            <Stack>
                <Divider my="sm" labelPosition="center" />

                <Grid columns={globals.isPhoneScreen ? 3 : 9}>
                    <Grid.Col span={3} style={{ borderRight: !globals.isPhoneScreen ? "1px solid #ccc" : "none" }}>
                        <Stack>
                            <Title order={4} align="center">Tenants</Title>
                            <Center>
                                <List>
                                    {Object.entries(tenants).map(([key, value]) => (
                                        <List.Item key={key} fz="sm"><b>{upcase(key)}</b>: {value}</List.Item>
                                    ))}
                                </List>
                            </Center>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={3} style={{ borderRight: !globals.isPhoneScreen ? "1px solid #ccc" : "none" }}>
                        <Stack>
                            <Title order={4} align="center">Touchstones</Title>
                            <Center>
                                <List size="sm">
                                    {kindred.touchstones.map((stone, i) => {
                                        return (
                                            <List.Item
                                                icon={
                                                    <Avatar radius="xs" src={stone.pic} />
                                                }
                                                key={i}>
                                                <Text>
                                                    <b>{stone.name}</b>
                                                </Text>
                                                <List.Item>
                                                    <Text c="dimmed" align="center">
                                                        {stone.conviction}
                                                    </Text>
                                                </List.Item>
                                            </List.Item>
                                        )
                                    })}
                                </List>
                            </Center>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Stack>
                            <Title order={4} align="center">Clan Bane</Title>
                            <Center>
                            <Text align="center" size="xs" w={200}>{clanBane}</Text>
                            </Center>
                            <Text align="center"><b>Bane Severity</b>: {bloodPotencies[v5BloodPotencyLevel(kindred).level].baneSeverity}</Text>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Center>
    )
}

export default MiddleSection