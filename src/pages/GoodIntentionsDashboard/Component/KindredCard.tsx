import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { useNavigate } from 'react-router-dom';

import { Alert, Center, Stack, Text, Avatar, Group, Image, Button } from "@mantine/core"
import { Sects } from "../../../data/GoodIntentions/types/V5Sect"
import { Clans } from "../../../data/GoodIntentions/types/V5Clans"


type KindredCardProps = {
    kindredList: Kindred[],
}

const CharacterCard = ({ kindredList }: KindredCardProps) => {
    const navigate = useNavigate();

    return (
        <Stack>
            {kindredList.map((character) => {
                if (character.uid === '0') { return null }
                return (
                    <Alert color="gray" style={{ maxWidth: '400px' }} key={character.uid}>
                        <Text weight={700} align="left">{character.name}</Text>

                        <Group>
                            <Center>
                                <Stack>
                                    <Avatar
                                        src={character.backstory.profilePic}
                                        size="70px"
                                        radius="xl"
                                    />
                                </Stack>
                            </Center>

                            <Stack>
                                <Group>
                                    <Image
                                        fit="contain"
                                        height={40}
                                        width={40}
                                        src={Sects[character.sect].symbol}
                                        style={{
                                            opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                                            filter: "invert(80%)"
                                        }}
                                    />
                                    <Image
                                        fit="contain"
                                        height={40}
                                        width={40}
                                        src={Clans[character.clan].symbol}
                                        style={{
                                            opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                                            filter: "invert(80%)"
                                        }}
                                    />
                                </Group>
                                <Center>
                                    <Button
                                        variant='link'
                                        onClick={() => { navigate(`/kindred-sheet/${character.id}`) }}
                                    >
                                        View Character
                                    </Button>
                                </Center>
                            </Stack>
                        </Group>
                    </Alert>
                )
            })}
        </Stack>
    )
}

export default CharacterCard;