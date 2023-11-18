import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { useNavigate } from 'react-router-dom';

import { Alert, Center, Stack, Text, Avatar, Group, Image, Button, SimpleGrid } from "@mantine/core"
import { Sects } from "../../../data/GoodIntentions/types/V5Sect"
import { Clans } from "../../../data/GoodIntentions/types/V5Clans"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

type KindredCardProps = {
    kindredList: Kindred[],
    writable: boolean,
    userKindred?: Kindred,
    ownerId?: string
    setShowKick?: (showKick:boolean) => void;
    setKindred?: (kindred:Kindred) => void;
}

const CharacterCard = ({ kindredList, writable, userKindred, ownerId, setShowKick, setKindred }: KindredCardProps) => {
    const navigate = useNavigate();
    const isOwner = userKindred && userKindred.id === ownerId

    return (
        <SimpleGrid>
            {kindredList.map((character) => {
                if (character.uid === '0') { return null }
                return (
                    <Alert color="gray" style={{ width: '275px' }} key={character.uid}>
                        <Text weight={700} align="left">{character.name} {ownerId === character.id ? <FontAwesomeIcon icon={faCrown} /> : <></>}</Text>

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
                                    {isOwner && character.id !== ownerId ?
                                    <Button
                                    variant='link'
                                    onClick={() => { setKindred && setKindred(character); setShowKick && setShowKick(true) }}
                                    >
                                    Kick from Coterie
                                </Button>
                                :<></>}
                                    {writable ?
                                        <Button
                                            variant='link'
                                            onClick={() => { navigate(`/kindred-sheet/${character.id}`) }}
                                        >
                                            View Character
                                        </Button>
                                        : <></>}
                                </Center>
                            </Stack>
                        </Group>
                    </Alert>
                )
            })}
        </SimpleGrid>
    )
}

export default CharacterCard;