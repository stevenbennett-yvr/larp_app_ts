//Technical Import
import { Title, Text, Stack, Group, Grid, Center } from '@mantine/core'
//Data Import
import { Awakened } from '../../../data/TatteredVeil/types/Awakened'
import { ArcanaKey, currentArcanumLevel } from '../../../data/TatteredVeil/types/Arcanum'
//Util Imports
import Dots from '../../../utils/dots'
import { globals } from '../../../assets/globals'

type Props = {
    awakened: Awakened
}

const MageArcanaPrint = ({awakened}: Props) => {
    const textStyle: React.CSSProperties = {
        fontFamily: "Courier New"
    }
    const arcanaWithLevel = ["death", "fate", "forces", "life", "matter", "mind", "prime", "space", "spirit", "time"]
        .filter((arcanum) => currentArcanumLevel(awakened, arcanum as ArcanaKey).level > 0);

    return (
        <Stack>
            <hr style={{width:"50%"}} />
            <Title order={3} align='center'>Arcana</Title>
            <Grid columns={globals.isPhoneScreen?4:12}>
                {arcanaWithLevel.map((arcanum) => {
                    const arcanumName = arcanum as ArcanaKey;
                    const currentLevel = currentArcanumLevel(awakened, arcanumName).level;
                    
                    return (
                        <Grid.Col span={4}>
                        <Center><Group key={arcanum}><Text style={textStyle} key={arcanum}>{arcanum.slice(0, 4)}: </Text><Dots n={currentLevel} /> </Group></Center>
                        </Grid.Col>
                    );
                })}
            </Grid>
        </Stack>
    );
}

export default MageArcanaPrint