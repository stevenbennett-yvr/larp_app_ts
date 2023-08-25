//Technical Imports
import { Grid, Text, Center, Group, Input, Button } from "@mantine/core";
//Assets Imports
import { globals } from "../../../assets/globals";
//Data Imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { AttributeNames, AttributeCategory, currentAttributeLevel, handleXpAttributeChange, findMaxAttribute } from "../../../data/TatteredVeil/types/Attributes";

type MageAttributeXpInputsProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void,
}

const MageAttributeXpInputs = ({awakened, setAwakened}: MageAttributeXpInputsProps) => {

    const orderedCategories = ['mental', 'physical', 'social'];
    const orderedAttributes = {
      'mental': ['intelligence', 'wits', 'resolve'],
      'physical': ['strength', 'dexterity', 'stamina'],
      'social': ["presence", 'manipulation', 'composure']
    }

    return (
        <>
        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Attributes</Text>
        <hr style={{width:"50%"}}/>
        <Grid gutter="lg" justify="center">
            {orderedCategories.map((category) => {
                let categoryKey = category as AttributeCategory
                const attributesInfo = awakened.attributes[categoryKey]
                const orderedAttributesForCategory = orderedAttributes[categoryKey];
                return (
                <Grid.Col 
                    span={globals.isPhoneScreen ? 8 : 4} 
                    key={`${category} Attributes`}
                >
                    <Text fs="italic" fw={700} ta="center">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    <hr />
                    {Object.entries(attributesInfo)
                    .sort(([a], [b]) => orderedAttributesForCategory.indexOf(a) - orderedAttributesForCategory.indexOf(b))
                    .map(([attribute, attributeInfo]) => {
                    const attributeName = attribute as AttributeNames;
                    const { level } = currentAttributeLevel(awakened, attribute);
                    return (
                        <Center>
                        <Group key={`${attribute} input`}>
                            <Input.Wrapper 
                                label={`${attribute.charAt(0).toUpperCase() + attribute.slice(1)} ${level}`}
                                description={`Total XP for Next: ${currentAttributeLevel(awakened, attribute).totalXpNeeded}`}
                                >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    size="xs"
                                    variant='outline'
                                    color='gray'
                                    onClick={() => handleXpAttributeChange(awakened, setAwakened, attributeName, attributeInfo.experiencePoints - 1)}
                                >
                                    -
                                </Button>
                                <Input
                                    style={{ width: '60px', margin: '0 8px' }}
                                    type="number"
                                    key={`${category}-${attribute}`}
                                    min={0}
                                    max={findMaxAttribute(awakened, attribute)}
                                    value={attributeInfo.experiencePoints}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = Number(e.target.value);
                                    handleXpAttributeChange(awakened, setAwakened, attributeName, value);
                                    }}
                                />
                                <Button
                                    size="xs"
                                    variant='outline'
                                    color='gray'
                                    disabled={findMaxAttribute(awakened, attribute) === attributeInfo.experiencePoints}
                                    onClick={() => handleXpAttributeChange(awakened, setAwakened, attributeName, attributeInfo.experiencePoints + 1)}
                                >
                                    +
                                </Button>
                                </div>
                            </Input.Wrapper>
                        </Group>
                        </Center>
                    );
                    })}
                </Grid.Col>
                );
            })}
        </Grid>
        </>);
}

export default MageAttributeXpInputs