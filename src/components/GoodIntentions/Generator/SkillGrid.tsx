import { Grid, Text, Tooltip, NumberInput, Divider } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { V5SkillsKey, skillsDescriptions } from "../../../data/GoodIntentions/types/V5Skills"
import { globals } from "../../../assets/globals"
import { upcase } from "../../../utils/case"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faComment, faHandFist } from "@fortawesome/free-solid-svg-icons"
import { SkillCategory } from "../../../data/nWoD1e/nWoD1eSkills"


type SkillsPickerProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
    check: any
}

const SkillGrid = ({ kindred, setKindred, check }: SkillsPickerProps) => {

    function changeCreationPoints(
        skill: V5SkillsKey,
        creationPoints: number,
    ): void {

        const updatedAttributes = {
            ...kindred.skills,
            [skill]: {
                ...kindred.skills[skill],
                creationPoints
            }
        }


        const clearedSpecialities = kindred.skillSpecialties.filter(entry => entry.skill !== skill)

        const updatedCharacter = {
            ...kindred,
            skills: updatedAttributes,
            skillSpecialties: clearedSpecialities,
        }

        setKindred(updatedCharacter)
    }

    const categoryIcons = {
        mental: faBrain,
        physical: faHandFist,
        social: faComment,
    }

    const skillCategories = ['physical', 'social', 'mental'] as SkillCategory[]

    const skillInputs = skillCategories.map(category => {
        return (
            <Grid.Col
                span={globals.isPhoneScreen ? "content" : 4}
                key={`${category} Skills`}
            >
                <Text c={"red"} fw={500} fz="lg" color="dimmed" ta="center">
                    <FontAwesomeIcon icon={categoryIcons[category]} /> {' '}
                    {upcase(category)}
                </Text>
                <Divider my="sm" color={"red"} />
                {Object.entries(kindred.skills).map(([skill, skillInfo]) => {
                    const typedAttribute = skill as V5SkillsKey
                    if (skillInfo.category === category) {
                        return (
                            <div
                                key={`${skill} input`}
                            >
                                <Tooltip
                                    multiline
                                    width={220}
                                    withArrow
                                    offset={20}
                                    transitionProps={{ duration: 200 }}
                                    label={skillsDescriptions[typedAttribute]}
                                    position={globals.isPhoneScreen ? "bottom" : "top"}
                                    events={{ hover: true, focus: false, touch: false }}
                                >
                                    <NumberInput
                                        key={`${category}-${skill}`}
                                        label={`${upcase(skill)}`}
                                        min={
                                            0
                                        }
                                        max={!check[3] ? 3 : !check[2] ? 2 : !check[1] ? 1 : 0}
                                        value={skillInfo.creationPoints}
                                        onChange={(val: number) => {
                                            changeCreationPoints(typedAttribute, val);
                                        }}

                                    />
                                </Tooltip>
                            </div>
                        )
                    }
                    else {
                        return null
                    };
                })}
            </Grid.Col>
        )
    })

    return (
        <Grid gutter="lg" justify="center">
            {skillInputs}
        </Grid>
    )

}

export default SkillGrid