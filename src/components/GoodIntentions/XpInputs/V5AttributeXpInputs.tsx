import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { Text, Grid, Center, Group, Input, ActionIcon, Stack } from "@mantine/core"
import { AttributeCategory, V5AttributesKey, v5AttributeLevel, v5HandleXpAttributeChange, v5FindMaxAttribute } from "../../../data/GoodIntentions/types/V5Attributes"
import { CirclePlus, CircleMinus } from 'tabler-icons-react';

type V5AttributeXpInputsProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
}
const V5AttributeXpInputs = ({ kindred, setKindred }: V5AttributeXpInputsProps) => {

    const orderedCategories = ['physical', 'social', 'mental'];
    const orderedAttributes = {
        'physical': ['strength', 'dexterity', 'stamina'],
        'social': ["charisma", 'manipulation', 'composure'],
        'mental': ['intelligence', 'wits', 'resolve'],
    }

    return (
        <Center>
            <Stack>
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
                                    if (attributeInfo.category === categoryKey) {
                                        return (
                                            <Center key={`${attribute}-Input`}>
                                                <Group>
                                                    <Input.Wrapper
                                                        label={`${attribute.charAt(0).toUpperCase() + attribute.slice(1)} ${level}`}
                                                    >
                                                        <Text size="12px" color="gray.6">Xp for Next: {totalXpNeeded - attributeInfo.experiencePoints}</Text>
                                                        <Text size="12px" color="gray.6">Total XP Needed {totalXpNeeded}</Text>

                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <ActionIcon variant="filled" radius="xl" color="dark" onClick={() => v5HandleXpAttributeChange(kindred, setKindred, attributeName, attributeInfo.experiencePoints - 1)}>
                                                                <CircleMinus strokeWidth={1.5} color="gray" />
                                                            </ActionIcon>
                                                            <Input
                                                                style={{
                                                                    width: '60px',
                                                                    margin: '0 8px',
                                                                }}                                                        
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

                                                            <ActionIcon variant="filled" radius="xl" color="dark" disabled={v5FindMaxAttribute(kindred, attributeName) === attributeInfo.experiencePoints} onClick={() => v5HandleXpAttributeChange(kindred, setKindred, attributeName, attributeInfo.experiencePoints + 1)}>
                                                                <CirclePlus strokeWidth={1.5} color="gray" />
                                                            </ActionIcon>
                                                        </div>
                                                    </Input.Wrapper>
                                                </Group>
                                            </Center>
                                        )
                                    }
                                    else {
                                        return null
                                    };
                                })}
                        </Grid.Col>
                    );
                })}
            </Grid>
            </Stack>
        </Center>
    )


}

export default V5AttributeXpInputs