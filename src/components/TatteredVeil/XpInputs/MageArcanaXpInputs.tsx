import { useMantineTheme, Grid, Card, Center, Image, Group, Input, Button, Text } from "@mantine/core"
//Data Imports
import { Awakened } from "../../../data/TatteredVeil/types/Awakened"
import { Paths } from "../../../data/TatteredVeil/types/Path"
import { ArcanaKey, arcanaDescriptions, arcana, currentArcanumLevel, handleArcanumChange, findMaxArcana, arcanaKeySchema } from "../../../data/TatteredVeil/types/Arcanum"

type MageArcanaXpInputsProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
}

const MageArcanaXpInputs = ({awakened, setAwakened}: MageArcanaXpInputsProps) => {
    
    const theme = useMantineTheme()
    const c1 = "rgba(26, 27, 30, 0.90)"
    const rulingArcana = Paths[awakened.path].rulingArcana
    const inferiorArcana = Paths[awakened.path].inferiorArcana
    const otherArcana = arcana.filter((arcanaName) => !rulingArcana.includes(arcanaName));

    const arcanumXpInputs = (arcanum: ArcanaKey) => {
        const c2 = arcanaDescriptions[arcanum].color
        const bgColor = theme.fn.linearGradient(0, c1, c2)
        const isRuling = rulingArcana.includes(arcanum); 
        const isInferior =  inferiorArcana.includes(arcanum)

        return (
            <Grid.Col key={arcanum} span={2}>
                <Card
                    shadow="sm"
                    padding="xs"
                    radius="md"
                    style={{ background: bgColor }}
                >
                    <Card.Section>
                        <Center>
                            <Image
                                fit="contain"
                                withPlaceholder
                                src={arcanaDescriptions[arcanum.toLowerCase() as ArcanaKey].logo}
                                height={50}
                                width={50}
                                alt="order"
                                style={{ filter: "brightness(0)" }} 
                            />
                        </Center>
                        <Center>
                        <Group>
                        <Input.Wrapper 
                            label={`${arcanaDescriptions[arcanum].name} : ${currentArcanumLevel(awakened, arcanum).level} ${isInferior? "Inferior" : isRuling? "Ruling" : ""}`}
                            description={`Total XP Needed ${currentArcanumLevel(awakened, arcanum).totalXpNeeded}`}
                            >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            onClick={() => {handleArcanumChange(awakened, setAwakened, arcanum, "experiencePoints", awakened.arcana[arcanum].experiencePoints - 1);}}
                        >
                            -
                        </Button>
                        <Input
                            style={{ width: '60px', margin: '0 8px' }}
                            type="number"
                            key={`${arcanum}`}
                            min={0}
                            max={findMaxArcana(awakened, arcanum)}
                            value={awakened.arcana[arcanum].experiencePoints}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = Number(e.target.value);
                            handleArcanumChange(awakened, setAwakened, arcanum, "experiencePoints", value);
                            }}
                        />
                        <Button
                            size="xs"
                            variant='outline'
                            color='gray'
                            disabled={findMaxArcana(awakened, arcanum) === awakened.arcana[arcanum].experiencePoints}
                            onClick={() => {handleArcanumChange(awakened, setAwakened, arcanum, "experiencePoints", awakened.arcana[arcanum].experiencePoints + 1);}}
                        >
                            +
                        </Button>
                        </div>
                        </Input.Wrapper>
                        </Group>
                        </Center>
                    </Card.Section>
                </Card>
            </Grid.Col>
        )
    }

    return (
        <>
        <Text mt={"xl"} ta="center" fz="xl" fw={700}>Arcana</Text>
        <hr style={{width:"50%"}}/>
        <Grid grow m={0}>
            {
                rulingArcana.map((o) => arcanaKeySchema.parse(o)).map((arcanum) => arcanumXpInputs(arcanum))
            }{
                otherArcana.map((o) => arcanaKeySchema.parse(o)).map((arcanum) => arcanumXpInputs(arcanum))
            }
        </Grid>
        </>
    )
}

export default MageArcanaXpInputs