import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { Center, Stack, Text, Table, SimpleGrid, Input } from "@mantine/core";
import { V5AttributesKey, v5AttributeLevel } from "../../../data/GoodIntentions/types/V5Attributes";
import { v5FindMaxAttribute, v5HandleXpAttributeChange } from "../../../data/GoodIntentions/types/V5Attributes";

type V5AttributeStInputsProps = {
    kindred: Kindred;
    setKindred: (kindred: Kindred) => void;
}

const V5AttributeStInputs = ({ kindred, setKindred }: V5AttributeStInputsProps) => {

    const orderedAttributes = {
        'physical': ['strength', 'dexterity', 'stamina'],
        'social': ["charisma", 'manipulation', 'composure'],
        'mental': ['intelligence', 'wits', 'resolve'],
    }

    function changeCreationPoints(
        attribute: V5AttributesKey,
        creationPoints: number,
    ): void {

        const updatedAttributes = {
            ...kindred.attributes,
            [attribute]: {
                ...kindred.attributes[attribute],
                creationPoints
            }
        }

        const updatedCharacter = {
            ...kindred,
            attributes: updatedAttributes
        }

        setKindred(updatedCharacter)
    }

    return (
        <Center>
            <Stack>
                <Text>
                    Attributes
                </Text>
                <SimpleGrid cols={3} spacing="xl">
                    {Object.keys(orderedAttributes).map((category) => {

                        return (
                            <Table
                                verticalSpacing={0}
                                horizontalSpacing={0}
                                highlightOnHover withColumnBorders
                            >
                                <thead>
                                    <tr>
                                        <td></td>
                                        <td>Lvl</td>
                                        <td>CP</td>
                                        <td>XP</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderedAttributes[category as keyof typeof orderedAttributes].map((attribute) => {
                                        const attributeName = attribute as V5AttributesKey;
                                        console.log(attributeName)
                                        const { level } = v5AttributeLevel(kindred, attributeName);

                                        return (

                                            <tr key={`row-${attributeName}`}>
                                                <td>{attributeName.slice(0, 4).toUpperCase()}</td>
                                                <td>{level}</td>
                                                <td>
                                                    <Input
                                                        style={{
                                                            width: '50px',
                                                            margin: '0 8px',
                                                        }}
                                                        key={`st-${attribute}-creationPoints`}
                                                        min={1}
                                                        max={4}
                                                        value={kindred.attributes[attributeName].creationPoints}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            const value = Number(e.target.value);
                                                            changeCreationPoints(attributeName, value)
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <Input
                                                        style={{
                                                            width: '50px',
                                                            margin: '0 8px',
                                                        }}
                                                        type="number"
                                                        key={`st-${attribute}-ExperiencePoints`}
                                                        min={0}
                                                        max={v5FindMaxAttribute(kindred, attributeName)}
                                                        value={kindred.attributes[attributeName].experiencePoints}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            const value = Number(e.target.value);
                                                            v5HandleXpAttributeChange(kindred, setKindred, attributeName, value)
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        )
                    })}
                </SimpleGrid>
            </Stack>
        </Center>
    );

}

export default V5AttributeStInputs