import { Button, Center, Group, Image, Stack, Text, Modal, Avatar, Tooltip, Divider } from "@mantine/core";
import { upcase } from "../../../utils/case";
import { disciplines, getEmptyDisciplines } from "../../../data/GoodIntentions/types/V5Disciplines";
import { loresheetCleanup } from "../../../data/GoodIntentions/types/V5Loresheets";
import { Clans, ClanName } from "../../../data/GoodIntentions/types/V5Clans";
import { globals } from "../../../assets/globals";
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";

type ClanModalProps = {
    clan: ClanName
    modalOpen: boolean
    handleCloseModal: () => void
    kindred: Kindred
    setKindred: (kindred:Kindred) => void
    nextStep: () => void
}

const ClanModal = ({kindred, setKindred, clan, modalOpen, handleCloseModal, nextStep}: ClanModalProps) => {

    const disciplinesForClan = Clans[clan].disciplines

    return (
        <Modal
        opened={modalOpen}
        onClose={handleCloseModal}
        size={600}
    >

        <Stack>
            <Center pt={10}>
                <Image
                    fit="contain"
                    withPlaceholder
                    src={Clans[clan].logo}
                    width={300}
                    alt="Clan"
                    style={{ filter: "invert(80%)" }}
                />
            </Center>
            <Center>
                <Text style={{ textAlign: "center" }}>
                    <div dangerouslySetInnerHTML={{ __html: Clans[clan].nicknames }} />
                </Text>
            </Center>
            <Divider my="sm" />

            <Text fz={globals.smallFontSize} style={{ textAlign: "center" }}>
                Disciplines:
            </Text>
            <Center>
                <Group>
                    {clan === "Caitiff" ? (
                        <Text>Caitiff have access to three Disciplines of their choice at the start of play.</Text>
                    ) :
                        clan === "Thin-Blood" ? (
                            <Text>Thin-bloods do not automatically possess Disciplines.</Text>
                        ) :
                        clan === "Ghoul" ? (
                            <Text>Ghouls start with two level 1 Discipline powers from the in-clan discipline of their domitor.</Text>
                        ) : (
                            disciplinesForClan.map((discipline) => (
                                <Tooltip label={disciplines[discipline].summary} key={discipline}>
                                    <Group>
                                        <Avatar size="sm" src={disciplines[discipline].logo} />
                                        <Text>{upcase(discipline)}</Text>
                                    </Group>
                                </Tooltip>
                            ))
                        )}
                </Group>
            </Center>
            <Divider my="sm" />

            <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                <div dangerouslySetInnerHTML={{ __html: Clans[clan].description }} />
            </Text>
            <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                <div dangerouslySetInnerHTML={{ __html: `<b>Bane:</b> ${Clans[clan].bane}` }} />
            </Text>
            <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                <div dangerouslySetInnerHTML={{ __html: `<b>Compulsion:</b> ${Clans[clan].compulsion}` }} />
            </Text>
        </Stack>
        <Divider my="sm" />

        <Button
            disabled={clan==="Ghoul"}
            onClick={() => {
                if (kindred.clan === clan) {nextStep()}
                const filteredOptions = loresheetCleanup(kindred)
                setKindred({
                    ...kindred, clan,
                    predatorType: "",
                    generation: 0,
                    meritsFlaws: [],
                    backgrounds: [],
                    disciplines: getEmptyDisciplines,
                    powers: [],
                    rituals: [],
                    ceremonies: [],
                    formulae: [],
                    skills: filteredOptions?.skills || kindred.skills,
                    loresheet: {name:"", benefits:[]}
                })
                nextStep()
            }}
        >Confirm Clan</Button>
    </Modal>
    )
}

export default ClanModal