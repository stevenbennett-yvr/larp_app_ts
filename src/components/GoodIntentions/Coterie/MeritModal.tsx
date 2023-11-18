import { Accordion, NumberInput, useMantineTheme, Table, Text, Group, Modal } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleDown, faCircleUp } from "@fortawesome/free-solid-svg-icons"

import { MeritFlawCategory, meritFlawData, V5MeritFlawRef, V5MeritFlaw, v5MeritFlawRefs, v5MeritLevel, getMeritIcon } from "../../../data/GoodIntentions/types/V5MeritsOrFlaws";
import Tally from "../../../utils/talley";
import { Coterie, getTotalCoterieMeritPoints } from "../../../data/GoodIntentions/types/Coterie";
import { GoodIntentionsVSSs } from "../../../data/CaM/types/VSS";
import { useCoterieDb } from "../../../contexts/CoterieContext";

export type TypeCategory = 'creationPoints' | 'experiencePoints';

type MeritsModalProps = {
    coterie: Coterie;
    setCoterie: (coterie: Coterie) => void;
    showModal: boolean;
    setShowModal: (showModal: boolean) => void
}

const flawIcon = () => {
    return <FontAwesomeIcon icon={faCircleDown} style={{ color: "#e03131" }} />
}
const meritIcon = () => {
    return <FontAwesomeIcon icon={faCircleUp} style={{ color: "rgb(47, 158, 68)", }} />
}

const getRating = (array: number[]) => {
    let first = array[0]
    let last = array[array.length - 1]

    if (first === last) {
        return <Tally n={last} />
    } else {
        return <Group><Tally n={first} /> to <Tally n={last} /></Group>
    }
}

const MeritsModal = ({ coterie, showModal, setShowModal }: MeritsModalProps) => {
    const theme = useMantineTheme()
    const { pushCoterieMeritData, removeCoterieMeritData } = useCoterieDb()


    const getStep = (meritFlaw: V5MeritFlawRef): number => {
        const meritInfo = meritFlawData.find(entry => entry.name === meritFlaw.name)
        let minCost = meritInfo?.cost[0];
        let maxCost = meritInfo?.cost[meritInfo?.cost.length - 1]
        if (!minCost || !maxCost) { return 1 }
        if (minCost === maxCost) {
            return minCost;
        } else {
            return 1;
        }
    }

    const handleCoterieMeritFlawChange = (
        coterie: Coterie,
        meritFlaw: V5MeritFlawRef,
        newPoints: any,
    ): void => {
        if (newPoints === 0) {
            removeCoterieMeritData(coterie, meritFlaw)
        } else {
            pushCoterieMeritData(coterie, { ...meritFlaw, creationPoints: newPoints })
        }
    }

    const MeritCreatoinPointInput = (merit: V5MeritFlaw) => {

        const coterieMerits = (!coterie.meritsFlaws ? [] : coterie.meritsFlaws)

        const meritInfo = meritFlawData.find(entry => entry.name === merit.name)
        const meritRef = Object.values(coterieMerits).find(mf => mf.name === merit.name) ||
            Object.values(v5MeritFlawRefs).find(mf => mf.name === merit.name);
        if (!meritRef || !meritInfo) { return }
        const getMeritPoints = (meritRef: V5MeritFlawRef) => {
            const meritInfo = Object.values(coterieMerits).find((mf) => mf.name === meritRef.name)
            const creation = meritInfo ? meritInfo.creationPoints : 0
            const freebie = meritInfo ? meritInfo.freebiePoints : 0
            return creation + freebie
        }
        return (
            <NumberInput
                key={merit.name}
                value={getMeritPoints(meritRef)}
                min={meritRef.freebiePoints}
                max={(merit.type==="merit"&&getTotalCoterieMeritPoints(coterie).totalMeritPoints===5)||(merit.type==="flaw"&&getTotalCoterieMeritPoints(coterie).totalFlawPoints===5)?getMeritPoints(meritRef): meritInfo.cost.length === 1 && meritInfo.cost[0] === 1 ? 1 : v5MeritLevel(meritRef).level === meritInfo.cost[meritInfo?.cost.length - 1] ? meritRef.creationPoints : meritInfo.cost[meritInfo.cost.length - 1]}
                step={getStep(meritRef)}
                onChange={(val) => {
                    handleCoterieMeritFlawChange(coterie, meritRef, val)
                }}
            />
        )
    }

    const venueData = GoodIntentionsVSSs.find((venue) => venue.venueStyleSheet.id === coterie.vssId);


    const createMeritAccordian = (category: string) => {
        if (
            (category === "thin-Blood") ||
            (category === "ghoul") ||
            !venueData
        ) {
            return null;
        }

        const { bannedMerits } = venueData.goodIntentionsVariables

        let bgc = ""

        switch (category) {
            case "bonding":
                bgc = theme.fn.rgba(theme.colors.red[9], 0.90); // Blue color
                break;
            case "connection":
                bgc = theme.fn.rgba(theme.colors.red[8], 0.90); // Red color
                break;
            case "feeding":
                bgc = theme.fn.rgba(theme.colors.red[7], 0.90); // Purple color
                break;
            case "mythical":
                bgc = theme.fn.rgba(theme.colors.red[6], 0.90); // Green color
                break;
            case "physical":
                bgc = theme.fn.rgba(theme.colors.red[5], 0.90); // Yellow color
                break;
            case "psychological":
                bgc = theme.fn.rgba(theme.colors.red[4], 0.90); // Orange color
                break;
            case "thin-Blood":
                bgc = theme.fn.rgba(theme.colors.red[3], 0.90); // Gray color
                break;
            case "ghoul":
                bgc = theme.fn.rgba(theme.colors.red[3], 0.90); // Gray color
                break;
        }

        return (
            <Accordion.Item value={`${category} accordion`} key={category}>
                <Accordion.Control style={{ color: "white", backgroundColor: bgc }}>
                    <FontAwesomeIcon icon={getMeritIcon(category as MeritFlawCategory)} /> {category.toUpperCase()}
                </Accordion.Control>
                <Accordion.Panel>
                    <Table>
                        <thead>
                            <tr>
                                <th>Merit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                meritFlawData
                                    .filter(((mf) => mf.category.toLocaleLowerCase() === category.toLowerCase() && !bannedMerits.includes(mf.name)))
                                    .map((meritFlaw) => (
                                        <>
                                        <tr key={`${meritFlaw.name} ${meritFlaw.type}`}>
                                            <td style={{ minWidth: "150px" }}>
                                                <Text key={`${meritFlaw.name}-${meritFlaw.type}`}>
                                                    {meritFlaw.type === "flaw" ? flawIcon() : meritIcon()} &nbsp; {meritFlaw.name}
                                                </Text>
                                                {getRating(meritFlaw.cost)}
                                                {MeritCreatoinPointInput(meritFlaw)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td dangerouslySetInnerHTML={{ __html: `${meritFlaw.description}` }} />
                                        </tr>
                                        </>
                                    ))
                            }
                        </tbody>
                    </Table>
                </Accordion.Panel>
            </Accordion.Item>
        );
    };

    let categoryArray = ["bonding", "connection", "feeding", "mythical", "physical", "psychological"]

    return (
        <Modal opened={showModal} onClose={() => setShowModal(false)}>
            <Modal.Header>
                <Group position="apart"><Text>Total Merits: {getTotalCoterieMeritPoints(coterie).totalMeritPoints}</Text><Text>Total Flaws: {getTotalCoterieMeritPoints(coterie).totalFlawPoints}</Text></Group>
            </Modal.Header>
            <Accordion w={"100%"}>
                {
                    categoryArray.map((c) => createMeritAccordian(c))
                }
            </Accordion>
        </Modal>
    );

}

export default MeritsModal