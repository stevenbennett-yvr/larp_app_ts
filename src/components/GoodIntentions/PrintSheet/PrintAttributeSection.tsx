import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Center, Stack, Grid, Title, Group, Text } from "@mantine/core"
import { globals } from "../../../assets/globals"
import Dots from "../../../utils/dots"
import { v5AttributeLevel, V5AttributesKey } from "../../../data/GoodIntentions/types/V5Attributes"

type PrintSheetProps = {
    kindred: Kindred,
}

const AttributeSection = ({kindred}:PrintSheetProps) => {
    const textStyle: React.CSSProperties = {
        fontFamily: "Courier New"
    }
    return (
        <Center>
        <Stack>

            <Grid grow columns={globals.isPhoneScreen ? 4 : 12}>
                <Grid.Col span={4}>
                    <Title order={4} align="center">Physical</Title>
                    {["strength", "dexterity", "stamina"].map((attribute) => {
                        return (<Center key={attribute}><Group align="center"><Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: </Text><Dots n={v5AttributeLevel(kindred, attribute as V5AttributesKey).level} /> </Group></Center>)
                    })}
                </Grid.Col>
                <Grid.Col span={4}>
                    <Title order={4} align="center">Social</Title>
                    {["charisma", "manipulation", "composure"].map((attribute) => {
                        return (<Center key={attribute}><Group align="center"><Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: </Text><Dots n={v5AttributeLevel(kindred, attribute as V5AttributesKey).level} /> </Group></Center>)
                    })}
                </Grid.Col>
                <Grid.Col span={4}>
                    <Title order={4} align="center">Mental</Title>
                    {["intelligence", "wits", "resolve"].map((attribute) => {
                        return (<Center key={attribute}><Group align="center"><Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: </Text><Dots n={v5AttributeLevel(kindred, attribute as V5AttributesKey).level} /> </Group></Center>)
                    })}
                </Grid.Col>
            </Grid>
        </Stack>
        </Center>
    )
}

export default AttributeSection