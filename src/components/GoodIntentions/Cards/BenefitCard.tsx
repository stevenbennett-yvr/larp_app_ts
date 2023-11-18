import { Alert, Card, Text, Stack, Group, Center } from "@mantine/core"

import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { Spheres } from "../../../data/GoodIntentions/types/V5Spheres";
import { Benefits, v5BenefitLevel, combineBenefits, getEmtpyComfort } from "../../../data/GoodIntentions/types/V5Benefits";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type BenefitsGrid = {
    coterieKindred: Kindred[]
}

const BenefitsGrid = ({ coterieKindred }: BenefitsGrid) => {

    let combinedBenefits = combineBenefits(coterieKindred)
    let comfortData = combinedBenefits.find((b) => b.name === "comfort") || getEmtpyComfort
    let connectionData = combinedBenefits.filter((b) => b.name === "connections") || []
    let deterrentsData = combinedBenefits.filter((b) => b.name === "deterrents") || []

    return (
        <Alert variant="light" color="gray">

            <Stack>

                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Coterie Territory Benefits</Text>

                <Center>
                    <Card w={300}>
                        <Group>
                            <FontAwesomeIcon icon={Benefits["comfort"].icon} style={{ color: "#e03131" }} />
                            <Text>Comfort {v5BenefitLevel(comfortData).level}</Text>
                        </Group>
                    </Card>
                </Center>
                <Center>
                    <Group>
                        <Card>
                            <Text>Connections:</Text>
                            {connectionData.map((s) => (
                                <Group>
                                    <FontAwesomeIcon icon={Spheres[s.sphere].symbol} style={{ color: "#e03131" }} />
                                    <Text>{s.sphere} Lvl. {v5BenefitLevel(s).level}</Text>
                                </Group>
                            ))}
                        </Card>
                        <Card>
                            <Text>Deterrents:</Text>
                            {deterrentsData.map((s) => (
                                <Group>
                                    <FontAwesomeIcon icon={Spheres[s.sphere].symbol} style={{ color: "#e03131" }} />
                                    <Text>{s.sphere} Lvl. {v5BenefitLevel(s).level}</Text>
                                </Group>
                            ))}
                        </Card>
                    </Group>
                </Center>
            </Stack>
        </Alert>
    )

}

export default BenefitsGrid