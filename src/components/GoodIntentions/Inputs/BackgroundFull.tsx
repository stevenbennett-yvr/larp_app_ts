import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Stack, ScrollArea } from "@mantine/core"
import { globals } from "../../../assets/globals"
import { useState } from 'react'
import { V5BackgroundRef } from "../../../data/GoodIntentions/types/V5Backgrounds"

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
    const width = globals.viewportWidthPx

    const [modalOpen, setModalOpen] = useState(false);
    const [modalBackground, setModalBackground] = useState<V5BackgroundRef|null>(null)

    const handleCloseModal = () => {
        setModalBackground(null);
        setModalOpen(false);
    };

    return (
        <Stack mt={"xl"} align="center" spacing="xl">
            <ScrollArea h={height - 280} w={width - 700} p={20}>
                <BackgroundBuy kindred={kindred} setKindred={setKindred} type={type} />
                <BackgroundGrid kindred={kindred} setKindred={setKindred} setModalBackground={setModalBackground} setModalOpen={setModalOpen} />
            </ScrollArea>
            <BackgroundModal kindred={kindred} setKindred={setKindred} bRef={modalBackground} modalOpened={modalOpen} closeModal={handleCloseModal} type={type} />
        </Stack>
    )
}

export default BackgroundFull