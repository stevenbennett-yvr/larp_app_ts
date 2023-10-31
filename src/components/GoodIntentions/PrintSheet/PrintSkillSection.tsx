import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { Center, Stack, Grid, Title, Group, Text } from "@mantine/core"
import { globals } from "../../../assets/globals"
import Dots from "../../../utils/dots"
import { V5SkillsKey, v5SkillLevel } from "../../../data/GoodIntentions/types/V5Skills"

type PrintSheetProps = {
    kindred: Kindred,
}

const SkillSection = ({ kindred }: PrintSheetProps) => {
    const textStyle: React.CSSProperties = {
        fontFamily: "Courier New"
    }
    return (
        <Center>
            <Stack>
                <Grid grow columns={globals.isPhoneScreen ? 4 : 12}>
                    <Grid.Col span={4} key={'physical-skills'}>
                        <Title order={4} align='center'>Physical</Title>
                        {["athletics", "brawl", "crafts", "drive", "firearms", "melee", "larceny", "stealth", "survival"].map((skill) => {
                            let skillName = skill as V5SkillsKey;
                            return (<Center key={skillName}><Group align="center"><Text style={textStyle} key={skillName}>{skillName.slice(0, 4)}: </Text><Dots n={v5SkillLevel(kindred, skillName as V5SkillsKey).level} /> </Group></Center>)
                        })}
                    </Grid.Col>
                    <Grid.Col span={4} key={'social-skills'}>
                        <Title order={4} align='center'>Social</Title>
                        {["animal ken",
                            "etiquette",
                            "insight",
                            "intimidation",
                            "leadership",
                            "performance",
                            "persuasion",
                            "streetwise",
                            "subterfuge",].map((skill) => {
                                let skillName = skill as V5SkillsKey;
                                return (<Center key={skillName}><Group align="center"><Text style={textStyle} key={skillName}>{skillName.slice(0, 4)}: </Text><Dots n={v5SkillLevel(kindred, skillName as V5SkillsKey).level} /> </Group></Center>)

                            })}
                    </Grid.Col>
                    <Grid.Col span={4} key={'mental-skills'}>
                        <Title order={4} align='center'>Mental</Title>
                        {["academics",
                            "awareness",
                            "finance",
                            "investigation",
                            "medicine",
                            "occult",
                            "politics",
                            "science",
                            "technology",].map((skill) => {
                                let skillName = skill as V5SkillsKey;
                                return (<Center key={skillName}><Group align="center"><Text style={textStyle} key={skillName}>{skillName.slice(0, 4)}: </Text><Dots n={v5SkillLevel(kindred, skillName as V5SkillsKey).level} /> </Group></Center>)

                            })}
                    </Grid.Col>
                </Grid>
            </Stack>
        </Center>
    );
};

export default SkillSection