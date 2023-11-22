import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Center, Stack, Button, Avatar, Text, List, Group, Alert, Title, Input, Tooltip, SimpleGrid } from "@mantine/core";
import { DiscordLogo } from "../../assets/images/CaM";
import SoftCoverV5 from '../../assets/images/GoodIntentions/core/Soft_Cover_3d__88604.png';
import { GoodIntentionsVSSs } from "../../data/CaM/types/VSS";
import { useAuth } from "../../contexts/AuthContext";
import { useCharacterDb } from "../../contexts/CharacterContext";
import { upcase } from "../../utils/case";
import CharacterCard from "../../components/GoodIntentions/Cards/KindredCard";
import { globals } from "../../assets/globals";
import calculateNextGameDate from "../../utils/calculateNextGameDate";
import { Calendar } from '@mantine/dates';

export default function GoodIntentionsDashboard() {
    const { venueId } = useParams();
    const { currentUser } = useAuth();
    const { userLocalKindred, getCharacterByUIDAndVSS } = useCharacterDb();

    const navigate = useNavigate();
    const venueData = GoodIntentionsVSSs.find((venue) => venue.venueStyleSheet.id === venueId);

    useEffect(() => {
        getCharacterByUIDAndVSS(currentUser?.uid ?? '', venueData?.venueStyleSheet.id ?? '');
    }, [])

    if (!venueData) {
        console.log("invalid venue id")
        return <Center h={"100%"}><div>Invalid Venue ID</div></Center>;
    }

    const {
        venueStyleSheet: {
            name,
            theme,
            mood,
            setting,
            scheduleDay,
            scheduleWeek
        },
        goodIntentionsVariables: {
            sect,
            tenants,
            boundaries,
            bannedClans,
            bannedSects,
            bannedPredatorTypes,
            bannedMerits,
            bannedPowers,
            bannedCeremonies,
            bannedRituals,
            bannedLoresheets,
        },
    } = venueData;

    const nextGameDay = calculateNextGameDate(scheduleDay, scheduleWeek)


    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '100px' }}>
            <Stack>
                <Group grow>
                    <Alert variant="light" color="gray">
                        <Stack>
                            <Title size="h4" align="center">{name}</Title>
                            {sect !== "" ?
                                <Text><b>Sect:</b> {sect}</Text>
                                : <></>}
                            {theme !== "" ?
                                <Text><b>Theme:</b> {theme}</Text>
                                : <></>}
                            {mood !== "" ?
                                <Text><b>Mood:</b> {mood}</Text>
                                : <></>}
                            <Text variant="h4"><b>Tenants</b></Text>
                            <List>
                                {Object.entries(tenants).map(([key, value]) => (
                                    <List.Item key={key}>{`${upcase(key)}: ${value}`}</List.Item>
                                ))}
                            </List>
                            {setting !== "" ?
                                <Text>
                                    <b>Setting:</b> <p dangerouslySetInnerHTML={{ __html: setting }}></p>
                                </Text>
                                : <></>}
                            {boundaries !== "" ?
                                <Text>
                                    <b>Boundaries:</b> {boundaries}
                                </Text>
                                : <></>}
                        </Stack>
                    </Alert>
                    <Alert variant="light" color="gray">
                        <Stack>
                            <Center>
                                <Input.Wrapper label="Next Game Date">
                                    <Calendar
                                        date={nextGameDay}
                                        renderDay={(date) => {
                                            const day = date.getDate();
                                            return (
                                                day === nextGameDay.getDate() ? (
                                                    <Tooltip label={"Gameday"}>
                                                        <div>
                                                            <Avatar color="red">
                                                                {day}
                                                            </Avatar>
                                                        </div>
                                                    </Tooltip>
                                                ) : (
                                                    <div>
                                                        {day}
                                                    </div>
                                                )
                                            );
                                        }}
                                    />
                                </Input.Wrapper>
                            </Center>
                            <SimpleGrid cols={2}>
                            {bannedClans.length > 0 ?
                                <Center>
                                    <Stack>
                                        <Text variant="h4"><b>Banned Clans</b></Text>
                                        <List>
                                            {bannedClans.map((clan, index) => (
                                                <List.Item key={index}>
                                                    {clan}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Stack>
                                </Center>
                                : null}
                            {bannedSects.length > 0 ?
                                <Center>
                                    <Stack>
                                        <Text variant="h4"><b>Banned Sects</b></Text>
                                        <List>
                                            {bannedSects.map((clan, index) => (
                                                <List.Item key={index}>
                                                    {clan}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Stack>
                                </Center>
                                : null}
                            {bannedPredatorTypes.length > 0 ?
                                <Center>
                                    <Stack>
                                        <Text variant="h4"><b>Banned Predator Types</b></Text>
                                        <List>
                                            {bannedPredatorTypes.map((clan, index) => (
                                                <List.Item key={index}>
                                                    {clan}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Stack>
                                </Center>
                                : null}
                            {bannedMerits.length > 0 ?
                                <Center>
                                    <Stack>
                                        <Text variant="h4"><b>Banned Merits</b></Text>
                                        <List>
                                            {bannedMerits.map((clan, index) => (
                                                <List.Item key={index}>
                                                    {clan}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Stack>
                                </Center>
                                : null}
                            {bannedPowers.length > 0 ?
                                <Center>
                                    <Stack>
                                        <Text variant="h4"><b>Banned Powers</b></Text>
                                        <List>
                                            {bannedPowers.map((clan, index) => (
                                                <List.Item key={index}>
                                                    {clan}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Stack>
                                </Center>
                                : null}
                            {bannedCeremonies.length > 0 ?
                                <Center>
                                    <Stack>
                                        <Text variant="h4"><b>Banned Ceremonies</b></Text>
                                        <List>
                                            {bannedCeremonies.map((clan, index) => (
                                                <List.Item key={index}>
                                                    {clan}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Stack>
                                </Center>
                                : null}
                            {bannedRituals.length > 0 ?
                                <Center>
                                    <Stack>
                                        <Text variant="h4"><b>Banned Rituals</b></Text>
                                        <List>
                                            {bannedRituals.map((clan, index) => (
                                                <List.Item key={index}>
                                                    {clan}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Stack>
                                </Center>
                                : null}
                            {bannedLoresheets.length > 0 ?
                                <Center>
                                    <Stack>
                                        <Text variant="h4"><b>Banned Loresheets</b></Text>
                                        <List>
                                            {bannedLoresheets.map((clan, index) => (
                                                <List.Item key={index}>
                                                    {clan}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Stack>
                                </Center>
                                : null}
                                </SimpleGrid>
                        </Stack>
                    </Alert>
                </Group>

                <Center>
                    {venueId === "GI-000" ?
                        <>
                            {userLocalKindred.length > 0 ?
                                <Stack>
                                    <Center>
                                        <Button
                                            onClick={() => navigate(`/create-kindred/${venueId}`)}
                                        >
                                            Create Kindred for Venue
                                        </Button>
                                    </Center>
                                    <CharacterCard kindredList={userLocalKindred} writable={true} cols={globals.isPhoneScreen ? 1 : 3} />
                                </Stack>
                                :
                                <Button
                                    onClick={() => navigate(`/create-kindred/${venueId}`)}
                                >
                                    Create Kindred for Venue
                                </Button>
                            }
                        </>
                        : <>
                            {userLocalKindred.length > 0 ?
                                <CharacterCard kindredList={userLocalKindred} writable={true} cols={globals.isPhoneScreen ? 1 : 3} /> :
                                <Button
                                    onClick={() => navigate(`/create-kindred/${venueId}`)}
                                >
                                    Create Kindred for Venue
                                </Button>
                            }
                        </>}
                </Center>
                <Center>
                    <a href="https://bynightstudios.com/laws-of-the-night-books" target="_blank" rel="noopener noreferrer">
                        <img width={200} src={SoftCoverV5} alt="Laws of the Night v5" />
                    </a>
                </Center>

                <Button variant='link' onClick={() => window.open('https://discord.gg/rvGtygKkyq')}>
                    <Avatar radius="xs" size="sm" src={DiscordLogo} /> Discord
                </Button>
            </Stack>
        </Center>
    )
}
