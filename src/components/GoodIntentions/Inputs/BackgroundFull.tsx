import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Stack, ScrollArea } from "@mantine/core"
import { globals } from "../../../assets/globals"
import { useState } from 'react'

import BackgroundBuy from "../../../components/GoodIntentions/Inputs/BackgroundBuy"
import BackgroundModal from "../../../components/GoodIntentions/Inputs/BackgroundModal"
import BackgroundGrid from "../../../components/GoodIntentions/Inputs/BackgroundGrid"

export type TypeCategory = 'creationPoints' | 'experiencePoints' ;

type BackgroundPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    type: TypeCategory
}

const BackgroundFull = ({ kindred, setKindred, type }: BackgroundPickerProps) => {
    const height = globals.viewportHeightPx

    const [modalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setModalBackground("");
        setModalOpen(false);
    };

    const [modalBackground, setModalBackground] = useState<string>("")

    return (
        <Stack mt={"xl"} align="center" spacing="xl">
            <ScrollArea h={height - 280} w={"100%"} p={20}>
                <BackgroundBuy kindred={kindred} setKindred={setKindred} type={type} />
                <BackgroundGrid kindred={kindred} setKindred={setKindred} setModalBackground={setModalBackground} setModalOpen={setModalOpen} />
            </ScrollArea>
            <BackgroundModal kindred={kindred} setKindred={setKindred} bId={modalBackground} modalOpened={modalOpen} closeModal={handleCloseModal} type={type} />
        </Stack>
    )
}

export default BackgroundFull