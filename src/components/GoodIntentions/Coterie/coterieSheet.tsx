import { useState, useEffect, forwardRef } from "react";
import { Grid, Center, Stack, Button, Text, TextInput, MultiSelect, Group, Avatar, Card, ScrollArea, Alert, SimpleGrid } from "@mantine/core";
//Data
import { Kindred, getEmptyKindred } from "../../../data/GoodIntentions/types/Kindred";
//Components
import CoterieModal from "./coterieModal";
import { Coterie, getEmptyCoterie, getTotalCoterieMeritPoints } from "../../../data/GoodIntentions/types/Coterie";
import { useCoterieDb } from "../../../contexts/CoterieContext";
import { v4 as uuidv4 } from 'uuid';
import { useCharacterDb } from "../../../contexts/CharacterContext";
import CharacterCard from "../Cards/KindredCard";
import MeritsModal from "./MeritModal";
import MeritFlawCard from "../Cards/MeritFlawCard";
import BenefitTable from "./BenefitTable";
import BenefitsGrid from "../Cards/BenefitCard";
import KickModal from "./KickModal";
import LeaveModal from "./LeaveModal";

import { globals } from "../../../assets/globals";
import { coterieBackgrounds } from "../../../data/GoodIntentions/types/V5Backgrounds";
import BackgroundCard from "../Cards/BackgroundCard";
import { TipTapRTE } from "../../TipTapRTE";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faList } from "@fortawesome/free-solid-svg-icons";

type CoterieSheetProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void,
    initialKindred: Kindred,
    setInitialKindred: (kindred: Kindred) => void,
    coterie: Coterie,
    setCoterie: (coterie: Coterie) => void,
}

const CoterieSheet = ({ kindred, setKindred, initialKindred, setInitialKindred, coterie, setCoterie }: CoterieSheetProps) => {
    const { updateKindred, localCoterielessKindred, getLocalCoterielessKindred, getKindredById, getCoterieMembers, coterieMembers } = useCharacterDb()
    const { writeCoterieData, getCoterieData, writeInvitation, coterieInvites, getCoterieInvitations, deleteInvite, getKindredInvitations } = useCoterieDb()
    const [showCreate, setShowCreate] = useState<boolean>(false);
    const [showMeits, setShowMerits] = useState<boolean>(false);
    const [showKick, setShowKick] = useState<boolean>(false);
    const [kickKindred, setKickKindred] = useState<Kindred>(getEmptyKindred());
    const [showLeave, setShowLeave] = useState<boolean>(false);


    const [kindredInvites, setKindredInvites] = useState<any[]>([])

    if (!coterie) (
        setCoterie(getEmptyCoterie())
    )

    console.log(coterie)

    useEffect(() => {
        if (kindred.coterie.id !== "") {
            getLocalCoterielessKindred(kindred.vssId);
            getCoterieInvitations(kindred.coterie.id)
            getCoterieData(kindred.coterie.id, kindred.vssId, setCoterie)
            getCoterieMembers(kindred.coterie.id)
        }
    }, [kindred.coterie.id]);

    const filteredKindred = localCoterielessKindred.filter(kindred =>
        coterieInvites.every(invite => invite.recipientId !== kindred.id)
    );

    useEffect(() => {
        if (kindred.coterie.id !== "") {
            writeCoterieData(kindred.coterie.id, coterie);
        }
    }, [coterie, kindred.coterie.id, writeCoterieData]);

    useEffect(() => {
        getKindredInvitations(kindred, setKindredInvites)
    }, [])

    async function handleCreateCoterie(kindred: Kindred, coterie: Coterie) {
        try {
            if (kindred.id) {
                const idString = uuidv4();
                const updatedKindred = { ...kindred, coterie: { ...kindred.coterie, id: idString } }
                const updatedInitialKindred = { ...initialKindred, coterie: { ...initialKindred.coterie, id: idString } }
                const updatedCoterie = { ...coterie, id: idString, vssId: kindred.vssId, ownerId: kindred.id }
                setCoterie(updatedCoterie)
                updateKindred(kindred.id, updatedInitialKindred)
                setKindred(updatedKindred)
                setInitialKindred(updatedInitialKindred)
                writeCoterieData(idString, updatedCoterie)
                setShowCreate(false)
                getLocalCoterielessKindred(kindred.vssId)
            }
        } catch {
            console.log("Failed to create coterie")
        }
    }

    async function handleDecline(inviteData: any) {
        try {
            deleteInvite(inviteData.id)
            let updatedInvites = kindredInvites.shift()
            setKindredInvites(updatedInvites)
        } catch (err) {
            console.log("Failed to delete invitation")
        }
    }

    async function handleAccept(inviteData: any) {
        try {
            if (inviteData.coterieId && kindred.id) {
                const updatedKindred = { ...kindred, coterie: { ...kindred.coterie, id: inviteData.coterieId } }
                const updatedInitialKindred = { ...initialKindred, coterie: { ...initialKindred.coterie, id: inviteData.coterieId } }
                updateKindred(kindred.id, updatedInitialKindred)
                setKindred(updatedKindred)
                setInitialKindred(updatedInitialKindred)
                handleDecline(inviteData)
            }
        } catch {
            console.log("failed to join coterie")
        }
    }


    const selectData = filteredKindred.map((kindred) => ({
        value: kindred.id,
        label: kindred.name,
        image: kindred.backstory.profilePic
    }))

    interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
        image: string;
        label: string;
    }

    const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
        ({ image, label, ...others }: ItemProps, ref) => (
            <div ref={ref} {...others}>
                <Group noWrap>
                    <Avatar src={image} />
                    <div>
                        <Text size="sm" color="white">{label}</Text>
                    </div>
                </Group>
            </div>
        )
    );

    const [selectedKindred, setSelectedKindred] = useState<string[]>([])

    const [inviteCoterie, setInviteCoterie] = useState<Coterie>(getEmptyCoterie())
    const [sender, setSender] = useState<Kindred>(getEmptyKindred())
    useEffect(() => {
        if (kindredInvites.length > 0) {
            getCoterieData(kindredInvites[0].coterieId, kindred.vssId, setInviteCoterie);
            getKindredById(kindredInvites[0].senderId, setSender)
        }
    }, [kindredInvites]);

    if (!inviteCoterie) {
        // Assuming you have a deleteInvitation function, pass the necessary parameters
        handleDecline(kindredInvites[0]);
    }

    const height = globals.viewportHeightPx
    const sharedBackgrounds = coterieBackgrounds(coterieMembers)

    return (
        <Center>
            <ScrollArea h={height - 220} pb={20}>
                {kindred.coterie.id === "" ?
                    <Center>
                        <Stack>
                            <Center>
                                <Button
                                    onClick={() => {
                                        setShowCreate(true)
                                    }}
                                >
                                    Create Coterie
                                </Button>
                            </Center>
                            {kindredInvites.length > 0 ?
                                <Card><Stack><Group noWrap><Avatar src={sender.backstory.profilePic} /><Text>{sender.name} invites you to {inviteCoterie.name} coterie.</Text></Group>
                                    <Group>
                                        <Button
                                            onClick={() => {
                                                handleAccept(kindredInvites[0])
                                            }}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                handleDecline(kindredInvites[0])
                                            }}
                                        >
                                            Decline
                                        </Button>
                                    </Group>
                                </Stack></Card>
                                : <></>}
                        </Stack>
                    </Center>
                    :
                    <Stack>
                        <Grid grow m={0}>
                            <Grid.Col span={5}>
                                <Alert variant="light" color="gray">
                                    <Stack>
                                        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Coterie</Text>
                                        <Center>
                                            <TextInput
                                                value={coterie.name}
                                                label="Coterie Name"
                                                onChange={(event) => {
                                                    setCoterie({ ...coterie, name: event.target.value })
                                                }}
                                            />
                                        </Center>
                                        <Center>
                                            <TextInput
                                                value={coterie.concept}
                                                label="Coterie Concept"
                                                onChange={(event) => {
                                                    setCoterie({ ...coterie, concept: event.target.value })
                                                }}
                                            />
                                        </Center>
                                        <Center>
                                            <Stack>
                                                <Text>
                                                    <FontAwesomeIcon icon={faList} /> Goals
                                                </Text>
                                                {coterie.id !== "" ?
                                                    <TipTapRTE html={coterie.goals} setHTML={(val) =>
                                                        setCoterie({ ...coterie, goals: val })
                                                    } />
                                                    : <></>}
                                            </Stack>
                                        </Center>
                                        <Center>
                                            <Button
                                                onClick={() => {
                                                    setShowLeave(true)
                                                }}
                                                disabled={kindred.id === coterie.ownerId && coterieMembers.length < 1}
                                            >
                                                Leave Coterie
                                            </Button>
                                        </Center>
                                    </Stack>
                                </Alert>
                            </Grid.Col>
                            <Grid.Col span={5}>
                                <Alert variant="light" color="gray">

                                    <Stack>
                                        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Members</Text>
                                        <Center>
                                            <CharacterCard kindredList={coterieMembers} writable={false} userKindred={kindred} ownerId={coterie.ownerId} setShowKick={setShowKick} setKindred={setKickKindred} cols={1} />
                                        </Center>
                                        <Center>
                                            <MultiSelect
                                                label="Invite Coterie-less Kindred to Coterie"
                                                data={selectData}
                                                value={selectedKindred}
                                                itemComponent={SelectItem}
                                                onChange={(val) => {
                                                    setSelectedKindred(val)
                                                }}
                                            />
                                        </Center>
                                        <Center>
                                            <Button
                                                color="gray"
                                                disabled={selectedKindred.length === 0}
                                                onClick={() => {
                                                    selectedKindred.forEach((id) => {
                                                        if (kindred.id) {
                                                            writeInvitation(kindred.id, id, coterie)
                                                            getCoterieInvitations(kindred.coterie.id)
                                                        }
                                                    })
                                                    setSelectedKindred([])
                                                }}
                                            >Send Invite</Button>
                                        </Center>
                                    </Stack>
                                </Alert>
                            </Grid.Col>
                        </Grid>
                        <Grid grow m={0}>
                            <Grid.Col span={5}>
                                <Alert variant="light" color="gray">

                                    <Stack>
                                        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Shared Backgrounds</Text>
                                        <SimpleGrid cols={2}>
                                            {sharedBackgrounds.map((b) => <BackgroundCard background={b} />)}
                                        </SimpleGrid>
                                    </Stack>
                                </Alert>
                            </Grid.Col>
                            <Grid.Col span={5}>
                                <Alert variant="light" color="gray">

                                    <Stack>
                                        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Shared Merits</Text>
                                        {getTotalCoterieMeritPoints(coterie).totalMeritPoints !== getTotalCoterieMeritPoints(coterie).totalFlawPoints ?
                                            <Text>Uneven distribution of Merit and Flaw points</Text>
                                            : <MeritFlawCard coterieMerits={coterie.meritsFlaws} />}
                                        <Center>
                                            <Button
                                                onClick={() => {
                                                    setShowMerits(true)
                                                }}
                                            >
                                                Select Merits
                                            </Button>
                                        </Center>

                                    </Stack>
                                </Alert>
                            </Grid.Col>
                        </Grid>
                        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Personal Territory Contributions</Text>
                        <BenefitTable kindred={kindred} setKindred={setKindred} />
                        <Grid grow m={0}>
                            <Grid.Col span={5}>
                                <Alert variant="light" color="gray">

                                    <Stack>
                                        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Coterie Territory Description</Text>
                                        <TextInput
                                            value={coterie.domain.location}
                                            label="Domain Location"
                                            onChange={(event) => {
                                                setCoterie({ ...coterie, domain: { ...coterie.domain, location: event.target.value } })
                                            }}
                                        />
                                        <Text>
                                            <FontAwesomeIcon icon={faHouse} /> Domain Description
                                        </Text>
                                        {coterie.id !== "" ?
                                            <TipTapRTE html={coterie.domain.description} setHTML={(val) =>
                                                setCoterie({ ...coterie, domain: { ...coterie.domain, description: val } })
                                            } />
                                            : <></>}
                                    </Stack>
                                </Alert>
                            </Grid.Col>
                            <Grid.Col span={5}>
                                <BenefitsGrid coterieKindred={coterieMembers} />
                            </Grid.Col>
                        </Grid>
                    </Stack>}
            </ScrollArea>
            <CoterieModal kindred={kindred} handleCreateCoterie={handleCreateCoterie} showCreate={showCreate} setShowCreate={setShowCreate} />
            <MeritsModal coterie={coterie} setCoterie={setCoterie} showModal={showMeits} setShowModal={setShowMerits} />
            <KickModal kindred={kickKindred} showKick={showKick} setShowKick={setShowKick} />
            <LeaveModal kindred={kindred} setKindred={setKindred} initialKindred={initialKindred} setInitialKindred={setInitialKindred} showLeave={showLeave} setShowLeave={setShowLeave} coterie={coterie} setCoterie={setCoterie} />
        </Center>
    )
}

export default CoterieSheet