//Technical Imports
import { Stack, Title, Grid, Text, Group } from "@mantine/core";
//Data Imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened"
import { currentAttributeLevel } from "../../../data/TatteredVeil/types/Attributes";
//Utils Imports
import Dots from "../../../utils/dots";

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
        <Title order={3}>Attributes</Title>
        <Grid>
            <Grid.Col span={4}>
                <Title order={4}>Mental</Title>
                {["intelligence", "wits", "resolve"].map((attribute) => {
                    return (<Group><Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: </Text><Dots n={currentAttributeLevel(awakened, attribute).level} /> </Group>)
                })}
            </Grid.Col>
            <Grid.Col span={4}>
                <Title order={4}>Physical</Title>
                {["strength", "dexterity", "stamina"].map((attribute) => {
                    return (<Group><Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: </Text><Dots n={currentAttributeLevel(awakened, attribute).level} /> </Group>)
                })}
            </Grid.Col>
            <Grid.Col span={4}>
                <Title order={4}>Social</Title>
                {["presence", "manipulation", "composure"].map((attribute) => {
                    return (<Group><Text style={textStyle} key={attribute}>{attribute.slice(0, 3)}: </Text><Dots n={currentAttributeLevel(awakened, attribute).level} /> </Group>)
                })}
            </Grid.Col>
        </Grid>
    </Stack>
  )
}

export default MageAttributesPrint