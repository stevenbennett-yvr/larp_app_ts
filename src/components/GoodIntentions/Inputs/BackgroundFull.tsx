import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Stack } from "@mantine/core"
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

    const [modalOpen, setModalOpen] = useState(false);
    const [modalBackground, setModalBackground] = useState<V5BackgroundRef|null>(null)

    const handleCloseModal = () => {
        setModalBackground(null);
        setModalOpen(false);
    };

    return (
        <Stack mt={"xl"} align="center" spacing="xl">
                <BackgroundBuy kindred={kindred} setKindred={setKindred} type={type} />
                <BackgroundGrid kindred={kindred} setKindred={setKindred} setModalBackground={setModalBackground} setModalOpen={setModalOpen} />
                <BackgroundModal kindred={kindred} setKindred={setKindred} bRef={modalBackground} modalOpened={modalOpen} closeModal={handleCloseModal} type={type} />
        </Stack>
    )
}

export default BackgroundFull