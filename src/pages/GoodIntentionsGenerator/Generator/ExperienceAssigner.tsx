import { Center, Stack, Alert, Group, Button, Text, Grid, Input } from '@mantine/core'
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { v5HandleXpAttributeChange, AttributeCategory, V5AttributesKey, v5AttributeLevel, v5FindMaxAttribute } from '../../../data/GoodIntentions/types/V5Attributes'

import { globals } from '../../../assets/globals'

type V5ExperienceAssignerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    nextStep: () => void
    backStep: () => void
}


const V5ExperienceAssigner = ({ kindred, setKindred, nextStep, backStep }: V5ExperienceAssignerProps) => {

    const isPhoneScreen = globals.isPhoneScreen
    const isSmallScreen = globals.isSmallScreen

    const v5AttributeXpInputs = () => {
        const orderedCategories = ['mental', 'physical', 'social'];
        const orderedAttributes = {
            'physical': ['strength', 'dexterity', 'stamina'],
            'social': ["charisma", 'manipulation', 'composure'],
            'mental': ['intelligence', 'wits', 'resolve'],
        }

        return (
            <>
                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Attributes</Text>
                <Grid>
                {orderedCategories.map((category) => {
                let categoryKey = category as AttributeCategory
                const orderedAttributesForCategory = orderedAttributes[categoryKey];
                return (
                <Grid.Col 
                    span={globals.isPhoneScreen ? 8 : 4} 
                    key={`${category}-Attributes`}
                >
                    <Text fs="italic" fw={700} ta="center">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    <hr />
                    {Object.entries(kindred.attributes)
                    .sort(([a], [b]) => orderedAttributesForCategory.indexOf(a) - orderedAttributesForCategory.indexOf(b))
                    .map(([attribute, attributeInfo]) => {
                    const attributeName = attribute as V5AttributesKey;
                    const { level, totalXpNeeded } = v5AttributeLevel(kindred, attributeName);
                    if ( attributeInfo.category === categoryKey ) {
                    return (
                        <Center key={`${attribute}-Input`}>
                        <Group>
                            <Input.Wrapper 
                                label={`${attribute.charAt(0).toUpperCase() + attribute.slice(1)} ${level}`}
                                >
                                <Text size="12px" color="gray.6">Xp for Next: {totalXpNeeded - attributeInfo.experiencePoints}</Text>
                                <Text size="12px" color="gray.6">Total XP Needed {totalXpNeeded}</Text>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    size="xs"
                                    variant='outline'
                                    color='gray'
                                    onClick={() => v5HandleXpAttributeChange(kindred, setKindred, attributeName, attributeInfo.experiencePoints - 1)}
                                >
                                    -
                                </Button>
                                <Input
                                    style={{ width: '60px', margin: '0 8px' }}
                                    type="number"
                                    key={`${category}-${attribute}`}
                                    min={0}
                                    max={v5FindMaxAttribute(kindred, attributeName)}
                                    value={attributeInfo.experiencePoints}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = Number(e.target.value);
                                    v5HandleXpAttributeChange(kindred, setKindred, attributeName, value);
                                    }}
                                />
                                <Button
                                    size="xs"
                                    variant='outline'
                                    color='gray'
                                    disabled={v5FindMaxAttribute(kindred, attributeName) === attributeInfo.experiencePoints}
                                    onClick={() => v5HandleXpAttributeChange(kindred, setKindred, attributeName, attributeInfo.experiencePoints + 1)}
                                >
                                    +
                                </Button>
                                </div>
                            </Input.Wrapper>
                        </Group>
                        </Center>
                    ) }
                    else {
                        return null
                    };
                    })}
                </Grid.Col>
                );
            })}
                </Grid>
            </>
        )


    }

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '60px', paddingBottom: globals.isPhoneScreen ? '120px' : '60px' }}>
            <Stack mt={"xl"} align="center" spacing="xl">

                {v5AttributeXpInputs()}


                <Alert color="dark" variant="filled" radius="xs" style={{ padding: "0px", position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen ? "15%" : "30%" }}>
                    <Group>
                        <Button.Group>
                            <Button
                                style={{ margin: "5px" }}
                                color="gray"
                                onClick={backStep}
                            >
                                Back
                            </Button>
                            <Button
                                style={{ margin: "5px" }}
                                color="gray"
                                onClick={() => {
                                    nextStep()
                                }}
                            >
                                Next
                            </Button>
                        </Button.Group>
                    </Group>
                </Alert>

            </Stack>
        </Center>
    )
}

export default V5ExperienceAssigner