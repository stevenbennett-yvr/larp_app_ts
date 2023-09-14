//Technical Imports
import { Stack, Title, Grid, Text, Group, Center } from "@mantine/core";
//Data Imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened"
import { nWoD1eCurrentAttributeLevel, AttributesKey } from "../../../data/nWoD1e/nWoD1eAttributes";
//Utils Imports
import Dots from "../../../utils/dots";
import { globals } from "../../../assets/globals";

type Props = {
    awakened: Awakened;
}

const MageAttributesPrint = ({awakened}: Props) => {
    const textStyle: React.CSSProperties = {
        fontFamily: "Courier New"
    }
    return (
    <Stack>
        <hr style={{width:"50%"}} />
        <Title order={3} align="center">Attributes</Title>
        <Grid columns={globals.isPhoneScreen? 4:12}>
            <Grid.Col span={4}>
                <Title order={4} align="center">Mental</Title>
                {["intelligence", "wits", "resolve"].map((attribute) => {
                    return (<Center key={attribute}><Group align="center"><Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: </Text><Dots n={nWoD1eCurrentAttributeLevel(awakened, attribute as AttributesKey).level} /> </Group></Center>)
                })}
            </Grid.Col>
            <Grid.Col span={4}>
                <Title order={4} align="center">Physical</Title>
                {["strength", "dexterity", "stamina"].map((attribute) => {
                    return (<Center key={attribute}><Group align="center"><Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: </Text><Dots n={nWoD1eCurrentAttributeLevel(awakened, attribute as AttributesKey).level} /> </Group></Center>)
                })}
            </Grid.Col>
            <Grid.Col span={4}>
                <Title order={4} align="center">Social</Title>
                {["presence", "manipulation", "composure"].map((attribute) => {
                    return (<Center key={attribute}><Group align="center"><Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: </Text><Dots n={nWoD1eCurrentAttributeLevel(awakened, attribute as AttributesKey).level} /> </Group></Center>)
                })}
            </Grid.Col>
        </Grid>
    </Stack>
  )
}

export default MageAttributesPrint