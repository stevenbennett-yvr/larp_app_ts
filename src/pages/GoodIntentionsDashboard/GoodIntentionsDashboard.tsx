import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Center, Stack, Button, Avatar, Text, List } from "@mantine/core";
import { DiscordLogo } from "../../assets/images/CaM";
import SoftCoverV5 from '../../assets/images/GoodIntentions/core/Soft_Cover_3d__88604.png';
import { GoodIntentionsVSSs } from "../../data/CaM/types/VSS";
import { useAuth } from "../../contexts/AuthContext";
import { useCharacterDb } from "../../contexts/CharacterContext";
import { upcase } from "../../utils/case";
import CharacterCard from "./Component/KindredCard";
import { globals } from "../../assets/globals";

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
        },
        goodIntentionsVariables: {
            sect,
            tenants,
        },
    } = venueData;

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '100px' }}>
                <Stack>
                    <Center>
                        <Text variant="h2">{name}</Text>
                    </Center>
                    {theme !== "" ?
                        <Center>
                            <Text>
                                <span dangerouslySetInnerHTML={{ __html: `Theme: ${theme}` }} />
                            </Text>
                        </Center>
                        : <></>}
                    {mood !== "" ?
                        <Center>
                            <Text>{`Mood: ${mood}`}</Text>
                        </Center>
                        : <></>}
                    {setting !== "" ?
                        <Center>
                            <Text align="center">
                                <span dangerouslySetInnerHTML={{ __html: `Setting: ${setting}` }} />
                            </Text>
                        </Center>
                        : <></>}
                    <Center>
                        <Text>{`Sect: ${sect}`}</Text>
                    </Center>
                    <Center>
                        <Stack>
                            <Text variant="h4">Tenants</Text>
                            <List>
                                {Object.entries(tenants).map(([key, value]) => (
                                    <List.Item key={key}>{`${upcase(key)}: ${value}`}</List.Item>
                                ))}
                            </List>
                        </Stack>
                    </Center>
                    <Center>
                        {venueId === "GI-000" ?
                            <>
                                {userLocalKindred.length > 0 ?
                                    <Stack>
                                        <Button
                                            onClick={() => navigate(`/create-kindred/${venueId}`)}
                                        >
                                            Create Kindred for Venue
                                        </Button>
                                        <CharacterCard kindredList={userLocalKindred} />
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
                                    <CharacterCard kindredList={userLocalKindred} /> :
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
