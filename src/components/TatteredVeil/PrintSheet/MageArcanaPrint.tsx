//Technical Import
import { Title, Text, Stack, Group } from '@mantine/core'
//Data Import
import { Awakened } from '../../../data/TatteredVeil/types/Awakened'
import { ArcanaKey, currentArcanumLevel } from '../../../data/TatteredVeil/types/Arcanum'
//Util Imports
import Dots from '../../../utils/dots'

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
            <Title order={3}>Arcana</Title>
            <Group>
                {arcanaWithLevel.map((arcanum, index) => {
                    const arcanumName = arcanum as ArcanaKey;
                    const currentLevel = currentArcanumLevel(awakened, arcanumName).level;
                    
                    return (
                        <Group key={arcanum}>
                            {index > 0 && " | "}
                            <Text style={textStyle}>{arcanum.slice(0, 4)}: </Text>
                            <Dots n={currentLevel} />
                        </Group>
                    );
                })}
            </Group>
        </Stack>
    );
}

export default MageArcanaPrint