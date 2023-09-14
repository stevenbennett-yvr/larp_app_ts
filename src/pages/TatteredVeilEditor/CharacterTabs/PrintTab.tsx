//technical imports
import { Alert, Button, Center, Stack, Table, Text } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileExport } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react"
//Asset Imports
import { globals } from "../../../assets/globals";
//data imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { nWoD1eCurrentAttributeLevel } from "../../../data/nWoD1e/nWoD1eAttributes";
import { currentMeritLevel } from "../../../data/TatteredVeil/types/Merits";
import { currentGnosisLevel } from "../../../data/TatteredVeil/types/Gnosis";
import { currentWisdomLevel } from "../../../data/TatteredVeil/types/Wisdom";
//Component Imports
import MageAttributesPrint from "../../../components/TatteredVeil/PrintSheet/MageAttributesPrint";
import MageSkillsPrint from "../../../components/TatteredVeil/PrintSheet/MageSkillsPrint";
import MageArcanaPrint from "../../../components/TatteredVeil/PrintSheet/MageArcanaPrint";
import MageRotePrint from "../../../components/TatteredVeil/PrintSheet/MageRotePrint";
import MageMeritPrint from "../../../components/TatteredVeil/PrintSheet/MageMeritPrint";
import { TopSection } from "../../../components/TatteredVeil/TopSection";
import { downloadCharacterSheet } from "../../../components/TatteredVeil/pdfMage";

type PrintSheetProps = {
    awakened: Awakened
}

const PrintTab = ({ awakened }: PrintSheetProps) => {

    //OHTER SECTION

    const [downloadError, setDownloadError] = useState<Error | undefined>()

    const otherSection = () => {
        const dexterityLevel = nWoD1eCurrentAttributeLevel(awakened, 'dexterity').level;
        const strengthLevel = nWoD1eCurrentAttributeLevel(awakened, 'strength').level;
        const fleetOfFootMerit = awakened.merits.find(merit => merit.name === 'Fleet of Foot');
        const fleetOfFootLevel = fleetOfFootMerit ? currentMeritLevel(fleetOfFootMerit).level : 0;
        const calculatedSpeed = dexterityLevel + strengthLevel + 5 + fleetOfFootLevel;
        const calculateDefense = Math.min(nWoD1eCurrentAttributeLevel(awakened, 'dexterity').level, nWoD1eCurrentAttributeLevel(awakened, 'wits').level)

        const fastReflexMerit = awakened.merits.find(merit => merit.name === 'Fast Reflexes');
        const fastReflexLevel = fastReflexMerit ? currentMeritLevel(fastReflexMerit).level : 0;
        const calculateInit = nWoD1eCurrentAttributeLevel(awakened, 'dexterity').level + nWoD1eCurrentAttributeLevel(awakened, 'composure').level + fastReflexLevel

        return (
            <Center>
                {globals.isPhoneScreen ?
                    <Table striped withBorder fontSize="sm" style={{ maxWidth: "100px" }}>
                        <tbody>
                            <tr>
                                <td>
                                    Size:
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {awakened.merits.some(merit => merit.name === "Giant") ? 6 : 5}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Speed:
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculatedSpeed}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Defense:
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculateDefense}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Initiative:
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculateInit}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Wisdom:
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {currentWisdomLevel(awakened).level}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Gnosis:
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {currentGnosisLevel(awakened).level}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    :
                    <Table striped withBorder withColumnBorders style={{ maxWidth: "400px" }}>
                        <thead>
                            <tr>
                                <th>Size</th>
                                <th>Speed</th>
                                <th>Defense</th>
                                <th>Initiative</th>
                                <th>Wisdom</th>
                                <th>Gnosis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'center' }}>
                                    {awakened.merits.some(merit => merit.name === "Giant") ? 6 : 5}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculatedSpeed}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculateDefense}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculateInit}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {currentWisdomLevel(awakened).level}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {currentGnosisLevel(awakened).level}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                }
            </Center>
        )
    }

    // END RETURN SECTION

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px' }}>
            <Stack>
                <Alert color="gray">
                </Alert>

                <TopSection awakened={awakened} />
                <Center>
                <Button leftIcon={<FontAwesomeIcon icon={faFileExport} />} size="lg" color="gray" style={{maxWidth:"250px"}}
                    onClick={() => {
                        downloadCharacterSheet(awakened).catch((e) => { console.error(e); setDownloadError(e as Error) })
                    }}>
                    Download PDF
                </Button>
                </Center>
                {otherSection()}

                <MageAttributesPrint awakened={awakened} />

                <MageSkillsPrint awakened={awakened} />

                <MageArcanaPrint awakened={awakened} />

                <MageRotePrint awakened={awakened} />

                <MageMeritPrint awakened={awakened} />

            </Stack>

            {downloadError
                ? <Alert mt={"50px"} icon={<IconAlertCircle size="1rem" />} color="red" variant="outline" bg={"rgba(0, 0, 0, 0.6)"}>
                    <Text fz={"xl"} ta={"center"}>There was a download-error: {downloadError.message}</Text>
                    <Text fz={"lg"} ta={"center"} mb={"xl"}>Send a screenshot of this to me on <a target="_blank" rel="noreferrer" href="https://twitter.com/Odin68092534">Twitter</a> to help me fix it</Text>
                    <Text fz={"xs"} ta={"center"}>{downloadError.stack}</Text>
                </Alert>
                : null
            }
        </Center>
    )
}

export default PrintTab