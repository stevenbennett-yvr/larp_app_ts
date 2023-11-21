import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { useNavigate } from 'react-router-dom';

import { Alert, Center, Stack, Text, Avatar, Group, Image, Button, SimpleGrid } from "@mantine/core"
import { Sects } from "../../../data/GoodIntentions/types/V5Sect"
import { ClanName, Clans } from "../../../data/GoodIntentions/types/V5Clans"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

type KindredCardProps = {
    kindredList: Kindred[],
    writable: boolean,
    userKindred?: Kindred,
    ownerId?: string
    setShowKick?: (showKick:boolean) => void;
    setKindred?: (kindred:Kindred) => void;
    cols: number;
}

const clanColor = (clan: ClanName) => {
    switch (clan.toLocaleLowerCase()) {
        case ("brujah"):
        case ("gangrel"):
        case ("banu haqim"):
            return "invert(30%) sepia(60%) saturate(1877%) hue-rotate(333deg) brightness(91%) contrast(107%)";
        case ("nosferatu"):
        case ("salubri"):
        case ("caitiff"):
            return "invert(61%) sepia(2%) saturate(1624%) hue-rotate(169deg) brightness(91%) contrast(89%)";
        case ("malkavian"):
        case ("tremere"):
        case ("hecata"):
            return "invert(44%) sepia(37%) saturate(856%) hue-rotate(80deg) brightness(90%) contrast(85%)"
        case ("ventrue"):
        case ("tzimisce"):
        case ("lasombra"):
            return "invert(41%) sepia(77%) saturate(1025%) hue-rotate(181deg) brightness(77%) contrast(96%)"
        case ("toreador"):
        case ("ravnos"):
        case ("ministry"):
            return "invert(24%) sepia(87%) saturate(2030%) hue-rotate(272deg) brightness(89%) contrast(86%)"
        case ("thin-blood"):
        case ("ghoul"):
            return "invert(54%) sepia(57%) saturate(1813%) hue-rotate(5deg) brightness(99%) contrast(102%)"
        default:
            return "";
    }
};


Math.min()

const CharacterCard = ({ kindredList, writable, userKindred, ownerId, setShowKick, setKindred, cols }: KindredCardProps) => {
    const navigate = useNavigate();
    const isOwner = userKindred && userKindred.id === ownerId

    return (
        <SimpleGrid cols={Math.min(cols, kindredList.length)}>
            {kindredList.map((character) => {
                if (character.uid === '0') { return null }
                return (
                    <Alert color="gray" style={{ width: '275px' }} key={character.uid}>
                        <Text weight={700} align="left" style={{ paddingBottom: "5px"}}>{character.name} {ownerId === character.id ? <FontAwesomeIcon icon={faCrown} /> : <></>}</Text>

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
                                <Center>
                                <Group>
                                    <Image
                                        fit="contain"
                                        height={40}
                                        width={40}
                                        src={Sects[character.sect].symbol}
                                        style={{
                                            opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                                            filter: "invert(80%)",
                                        }}
                                    />
                                    <Image
                                        fit="contain"
                                        height={40}
                                        width={40}
                                        src={Clans[character.clan].symbol}
                                        style={{
                                            opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                                            filter: clanColor(character.clan)
                                        }}
                                    />
                                </Group>
                                </Center>
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
                                            variant='subtle'
                                            color="red"
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