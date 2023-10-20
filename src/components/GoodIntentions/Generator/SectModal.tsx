import { Button, Center, Group, Image, Stack, Text, Modal, Tooltip, Divider } from "@mantine/core";
import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { globals } from "../../../assets/globals";
import { upcase } from "../../../utils/case";
import { SectName, Sects } from "../../../data/GoodIntentions/types/V5Sect";
import { Clans } from "../../../data/GoodIntentions/types/V5Clans";

type SectModalProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    modalOpen: boolean
    handleCloseModal: () => void
    sect: SectName
}


const SectModal = ({ kindred, setKindred, nextStep, modalOpen, handleCloseModal, sect }: SectModalProps) => {


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
                    src={Sects[sect].logo}
                    width={300}
                    alt="Sect"
                    style={{ filter: "invert(80%)" }}
                />
            </Center>
            <Center>
                <Text style={{ textAlign: "center" }}>
                    <div dangerouslySetInnerHTML={{ __html: Sects[sect].nicknames }} />
                </Text>
            </Center>
            <Divider my="sm" />

            <Text fz={globals.smallFontSize} style={{ textAlign: "center" }}>
                Predominate Clans:
            </Text>
            <Center>
                <Group>
                    {
                        Sects[sect].clans.map((clan) =>
                        (
                            <Tooltip label={Clans[clan.name].summary} key={clan.name}>
                                <Group>
                                    <Image width={24} src={Clans[clan.name].symbol} style={{ filter: "invert(80%)" }} />
                                    <Text>{upcase(clan.name)} {clan.note !== "" ? `(${clan.note})` : ``}</Text>
                                </Group>
                            </Tooltip>
                        ))
                    }
                </Group>
            </Center>
            <Divider my="sm" />

            <Text fz={globals.smallerFontSize} style={{ textAlign: "left" }}>
                <div dangerouslySetInnerHTML={{ __html: Sects[sect].description }} />
            </Text>
        </Stack>
        <Divider my="sm" />

        <Button
            onClick={() => {
                setKindred({
                    ...kindred,
                    sect
                })
                nextStep()
            }}
        >Confirm Sect</Button>
    </Modal>
    )
}

export default SectModal