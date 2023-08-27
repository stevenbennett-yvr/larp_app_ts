//technical imports
import { Avatar, Alert, Center, Grid, Group, Image, Stack, Table, Text } from "@mantine/core";
//Asset Imports
import { globals } from "../../../assets/globals";
//data imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { Paths } from "../../../data/TatteredVeil/types/Path";
import { Orders } from "../../../data/TatteredVeil/types/Order";
import { currentAttributeLevel } from "../../../data/TatteredVeil/types/Attributes";
import { currentMeritLevel } from "../../../data/TatteredVeil/types/Merits";
import { currentGnosisLevel } from "../../../data/TatteredVeil/types/Gnosis";
import { currentWisdomLevel } from "../../../data/TatteredVeil/types/Wisdom";
//Component Imports
import MageAttributesPrint from "../../../components/TatteredVeil/PrintSheet/MageAttributesPrint";
import MageSkillsPrint from "../../../components/TatteredVeil/PrintSheet/MageSkillsPrint";
import MageArcanaPrint from "../../../components/TatteredVeil/PrintSheet/MageArcanaPrint";
import MageRotePrint from "../../../components/TatteredVeil/PrintSheet/MageRotePrint";
import MageMeritPrint from "../../../components/TatteredVeil/PrintSheet/MageMeritPrint";

type PrintSheetProps = {
    awakened: Awakened
}

const PrintTab = ({awakened}: PrintSheetProps) => {

    const topSection = () => {
        return(
            <Grid columns={9}>
                <Grid.Col span={3} style={{ borderRight: "1px solid #ccc" }}>
                    <Center>
                        <Avatar
                            src={awakened.background.profilePic}
                            size={100}
                            style={{
                                backgroundImage: `linear-gradient(to bottom right, ${Paths[awakened.path].color}, ${Orders[awakened.order].color})`,
                            }}
                        />
                    </Center>
                </Grid.Col>
                <Grid.Col span={3} style={{ borderRight: "1px solid #ccc" }}>
                    <Stack>
                        <Text>Shadow Name: {awakened.name}</Text>
                        <Text>Concept: {awakened.concept}</Text>
                        <Group>
                            <Text>Order: {awakened.order}</Text>
                            <Image
                            fit="contain"
                            height={40}
                            width={40}
                            src={Orders[awakened.order].rune}
                            style={{
                                opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                            }}
                            />
                        </Group>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={3} >
                    <Stack>
                        <Text>Virtue: {awakened.virtue}</Text>
                        <Text>Vice: {awakened.vice}</Text>
                        <Group>
                            <Text>Path: {awakened.path}</Text>
                            <Image
                                fit="contain"
                                height={40}
                                width={40}
                                src={Paths[awakened.path].rune}
                                style={{
                                    opacity: 0.6, // Adjust the opacity here (0.5 = 50% transparent)
                                  }}
                            />
                        </Group>
                    </Stack>
                </Grid.Col>
            </Grid>
        )
    }


    //OHTER SECTION

    const otherSection = () => {
        const dexterityLevel = currentAttributeLevel(awakened, 'dexterity').level;
        const strengthLevel = currentAttributeLevel(awakened, 'strength').level;
        const fleetOfFootMerit = awakened.merits.find(merit => merit.name === 'Fleet of Foot');
        const fleetOfFootLevel = fleetOfFootMerit ? currentMeritLevel(fleetOfFootMerit).level : 0;
        const calculatedSpeed = dexterityLevel + strengthLevel + 5 + fleetOfFootLevel;
        const calculateDefense = Math.min(currentAttributeLevel(awakened, 'dexterity').level, currentAttributeLevel(awakened, 'wits').level)

        const fastReflexMerit = awakened.merits.find(merit => merit.name === 'Fast Reflexes');
        const fastReflexLevel = fastReflexMerit ? currentMeritLevel(fastReflexMerit).level : 0;
        const calculateInit = currentAttributeLevel(awakened, 'dexterity').level + currentAttributeLevel(awakened, 'composure').level + fastReflexLevel

        return (
            <Center>
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
            </Center>
        )
    }

    // END RETURN SECTION

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : '100px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
            <Stack>
                <Alert color="gray">
                </Alert>

                {topSection()}

                {otherSection()}

                <MageAttributesPrint awakened={awakened} />

                <MageSkillsPrint awakened={awakened} />

                <MageArcanaPrint awakened={awakened} />
                
                <MageRotePrint awakened={awakened} />

                <MageMeritPrint awakened={awakened} />

            </Stack>
        </Center>
    )
}

export default PrintTab