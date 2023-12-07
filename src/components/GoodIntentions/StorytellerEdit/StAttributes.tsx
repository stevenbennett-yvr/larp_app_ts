import { Kindred } from "../../../data/GoodIntentions/types/Kindred";
import { Center, Stack, Text, Table, NumberInput } from "@mantine/core";
import { V5AttributesKey, v5AttributeLevel } from "../../../data/GoodIntentions/types/V5Attributes";
import { upcase } from "../../../utils/case";

type V5AttributeStInputsProps = {
    kindred: Kindred;
    setKindred: (kindred: Kindred) => void;
}

const V5AttributeStInputs = ({ kindred, setKindred }: V5AttributeStInputsProps ) => {


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
                <Table>
                    <thead>
                        <tr>
                            <td>Attribute</td>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(kindred.attributes).map(([attribute, attributeInfo]) => {
                            const attributeName = attribute as V5AttributesKey
                            const { level } = v5AttributeLevel(kindred, attributeName)
                            return (
                                <tr>
                                    <td>{attributeName} {level}</td>
                                    <td>
                                        <NumberInput
                                            key={`st-${attribute}`}
                                            label={`${upcase(attribute)}`}
                                            min={1}
                                            max={4}
                                            value={attributeInfo.creationPoints}
                                            onChange={(val:number) =>
                                                changeCreationPoints(
                                                    attributeName,
                                                    val
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Stack>
        </Center>
    )
}

export default V5AttributeStInputs