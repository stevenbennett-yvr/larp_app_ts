import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { NumberInput, Table, Tooltip, Group, Text, Select, Button } from "@mantine/core"
import { handleBackgroundRemove, V5BenefitRef, v5BenefitRefs, getEmtpyComfort, handleBenefitChange, Benefits, v5BenefitLevel, v5HandleXpBenefitChange, BenefitName } from "../../../data/GoodIntentions/types/V5Benefits"
import { upcase } from "../../../utils/case"
import { useState } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SphereSelectData, Spheres, V5SphereKey } from "../../../data/GoodIntentions/types/V5Spheres";

type TypeCategory = 'freebiePoints' | 'experiencePoints';

type BenefitTableProps = {
    kindred: Kindred;
    setKindred: (kindred: Kindred) => void;
}

const BenefitTable = ({ kindred, setKindred }: BenefitTableProps) => {

    const handleBenefitBuy = (selectedBenefit: string, selectedSphere: V5SphereKey, pointsType: TypeCategory) => {
        let newBenefitRef = v5BenefitRefs.find((b) => b.name === selectedBenefit);
        if (!newBenefitRef) { return; }

        let newBenefit = { ...newBenefitRef, id: `${newBenefitRef.name}${selectedSphere}-${Date.now()}`, sphere: selectedSphere };

        handleBenefitChange(kindred, setKindred, newBenefit, pointsType, 0)
    }

    const comfortData = kindred.coterie.territoryContributions.find((b) => b.name === "comfort") || getEmtpyComfort

    const benefitsRows = (territoryContributions: V5BenefitRef[]) => {
        let filteredContributions = territoryContributions.filter((b) => b.name !== "comfort");

        return filteredContributions.map((benefit) => (
            <tr key={benefit.name}>
                <td>
                    <Tooltip label={Benefits[benefit.name].summary} color="gray">
                        <Group>
                            <FontAwesomeIcon icon={Benefits[benefit.name].icon} style={{ color: "#e03131" }} />
                            <Text>{upcase(benefit.name)} Lvl: {v5BenefitLevel(benefit).level}</Text>
                        </Group>
                    </Tooltip>
                </td>

                <td>
                    <Tooltip label={Spheres[benefit.sphere].summary} color="gray">
                        <Group>
                            <FontAwesomeIcon icon={Spheres[benefit.sphere].symbol} style={{ color: "#e03131" }} />
                            <Text>{upcase(benefit.sphere)}</Text>
                        </Group>
                    </Tooltip>
                </td>

                <td>
                    <NumberInput
                        label="Freebie Points"
                        value={benefit.freebiePoints}
                        w={150}
                        min={0}
                        max={getTotalFreebies(kindred) >= 2 ? benefit.freebiePoints : undefined}
                        onChange={(val: number) => {
                            handleBenefitChange(kindred, setKindred, benefit, "freebiePoints", val);
                        }}
                    />
                </td>

                <td>
                    <NumberInput
                        label="Experience Points"
                        w={150}
                        step={3}
                        min={0}
                        max={v5BenefitLevel(benefit).level === 5 ? benefit.experiencePoints : undefined}
                        value={benefit.experiencePoints}
                        onChange={(val: number) => {
                            v5HandleXpBenefitChange(kindred, setKindred, benefit, val);
                        }}
                    />
                </td>
                <td>
                    <Button
                        color="gray"
                        onClick={() => {
                            handleBackgroundRemove(kindred, setKindred, benefit)
                        }}
                    >
                        Remove
                    </Button>
                </td>
            </tr>
        ));
    };


    const getTotalFreebies = (kindred: Kindred): number => {
        let totalFreebies = 0;
        kindred.coterie.territoryContributions.forEach((b) => {
            totalFreebies += b.freebiePoints
        });
        return totalFreebies
    }

    const [selectedBenefit, setSelectedBenefit] = useState<BenefitName>("")
    const [selectedSphere, setSelectedSphere] = useState<V5SphereKey>("")

    return (
        <Table striped highlightOnHover withColumnBorders>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Sphere</th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <Tooltip label={Benefits[comfortData.name].summary} color="gray">

                            <Group>
                                <FontAwesomeIcon icon={Benefits[comfortData.name].icon} style={{ color: "#e03131" }} />
                                <Text>{upcase(comfortData.name)} Lvl: {v5BenefitLevel(comfortData).level}</Text>
                            </Group>
                        </Tooltip>

                    </td>

                    <td>
                        {comfortData.sphere}
                    </td>
                    <td>
                        <NumberInput
                            label="Freebie Points"
                            value={comfortData.freebiePoints}
                            w={150}
                            min={0}
                            max={getTotalFreebies(kindred) >= 2 ? comfortData.freebiePoints : undefined}
                            onChange={(val: number) => {
                                handleBenefitChange(kindred, setKindred, comfortData, "freebiePoints", val)
                            }}
                        />
                    </td>
                    <td>
                        <NumberInput
                            label="Experience Points"
                            w={150}
                            step={3}
                            min={0}
                            max={v5BenefitLevel(comfortData).level === 5 ? comfortData.experiencePoints : undefined}
                            value={comfortData.experiencePoints}
                            onChange={(val: number) => {
                                v5HandleXpBenefitChange(kindred, setKindred, comfortData, val)
                            }}
                        />
                    </td>
                    <td>

                    </td>
                </tr>
                {benefitsRows(kindred.coterie.territoryContributions)}
                <tr>
                    <td>
                        <Select
                            data={['connections', 'deterrents']}
                            value={selectedBenefit}
                            placeholder="Select Territory Benefit"
                            onChange={
                                (val) => {
                                    let beneift = val as BenefitName
                                    setSelectedBenefit(beneift)
                                }
                            }
                            allowDeselect
                        />
                    </td>
                    <td>
                        <Select
                            data={SphereSelectData}
                            value={selectedSphere}
                            placeholder="Select Territory Benefit Sphere"
                            onChange={(val) => {
                                let sphere = val as V5SphereKey
                                setSelectedSphere(sphere)
                            }}
                        />
                    </td>
                    <td>

                    </td>
                    <td></td>

                    <td>
                        <Button
                            color="gray"
                            disabled={selectedBenefit !== "comfort" && selectedSphere === ""}
                            onClick={() => {
                                handleBenefitBuy(selectedBenefit, selectedSphere, "experiencePoints")
                                setSelectedBenefit("")
                                setSelectedSphere("")
                            }}
                        >Buy</Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    )
}

export default BenefitTable