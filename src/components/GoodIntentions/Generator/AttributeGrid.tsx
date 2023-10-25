import { Grid, Text, Tooltip, NumberInput, Divider } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { upcase } from "../../../utils/case"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faComment, faHandFist } from "@fortawesome/free-solid-svg-icons"
import { AttributeCategory, V5AttributesKey, attributeDescriptions } from "../../../data/GoodIntentions/types/V5Attributes"

type AttributesPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    check: any
}

const AttributeGrid = ({ kindred, setKindred, check }: AttributesPickerProps) => {

    const categoryIcons = {
        mental: faBrain,
        physical: faHandFist,
        social: faComment,
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

    const attributeCategories = ['physical', 'social', 'mental'] as AttributeCategory[]

    const attributeInputs = attributeCategories.map(category => {
        return (
            <Grid.Col
                span={4}
                key={`${category} Attributes`}
            >
                <Text c={"red"} fw={500} fz="lg" color="dimmed" ta="center">
                    <FontAwesomeIcon icon={categoryIcons[category]} /> {' '}
                    {upcase(category)}
                </Text>
                <Divider my="sm" color={"red"} />
                {Object.entries(kindred.attributes).map(([attribute, attributeInfo]) => {
                    const typedAttribute = attribute as V5AttributesKey
                    if (attributeInfo.category === category) {
                        return (
                            <div
                                key={`${attribute} input`}
                            >
                                <Tooltip
                                    multiline
                                    width={220}
                                    withArrow
                                    offset={20}
                                    transitionProps={{ duration: 200 }}
                                    label={attributeDescriptions[typedAttribute]}
                                    position={globals.isPhoneScreen ? "bottom" : "top"}
                                    events={{ hover: true, focus: false, touch: false }}
                                >
                                    <NumberInput
                                        key={`${category}-${attribute}`}
                                        label={`${upcase(attribute)}`}
                                        min={
                                            1
                                        }
                                        max={!check[4] ? 4 : !check[3] ? 3 : !check[2] ? 2 : 1}
                                        value={attributeInfo.creationPoints}
                                        onChange={(val: number) =>
                                            changeCreationPoints(
                                                typedAttribute,
                                                val
                                            )
                                        }
                                    />
                                </Tooltip>
                            </div>
                        )
                    }
                    else {
                        return null
                    };
                })}
            </Grid.Col>
        )
    })

    return (
        
        <Grid grow m={0}>
            {attributeInputs}
        </Grid>

    )

}

export default AttributeGrid