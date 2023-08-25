//Technical Imports
import React from 'react'
import { Title, Grid, Text, Group, Stack } from '@mantine/core'
//Util Imports
import { Awakened } from '../../../data/TatteredVeil/types/Awakened'
import { currentSkillLevel, SkillNames, getSkillCategory, Skill } from '../../../data/TatteredVeil/types/Skills'
//Utils Imports
import Dots from '../../../utils/dots'

type MageSkillsPrintProps = {
    awakened: Awakened
}

const MageSkillsPrint = ({awakened}: MageSkillsPrintProps) => {

    const textStyle: React.CSSProperties = {
        fontFamily: "Courier New"
    }

    const skillSpecialities: any[] = [];

    Object.entries(awakened.skills).map(([,skillsInfo]) => {
        Object.entries(skillsInfo).map(([skill, skillInfo]) => {
            const skillName = skill as SkillNames;
            const specialities = skillInfo.specialities.map((spec) => spec.name);

            // Add each speciality to the skillSpecialities array
            specialities.forEach(speciality => {
                skillSpecialities.push({
                    skill: skillName,
                    speciality: speciality
                });
            });
        })
    })

    const isRoteSpecial = (awakened: Awakened, skill: string) => {
        const skills = awakened.skills as any;
        const category = getSkillCategory(skill as any) as string;
        const skillData = skills[category][skill] as Skill; 
        let { roteSkill } = skillData;
        return roteSkill
    }

  return (
    <Stack>
    <hr style={{width:"50%"}} />
    <Title order={3}>Skills</Title>
    <Grid>
        <Grid.Col span={4}>
            <Title order={4}>Mental</Title>
            {["academics", "computer", "crafts", "investigation", "medicine", "occult", "politics", "science"].map((skill) => {
                return (<Group><Text style={textStyle} key={skill}>{isRoteSpecial(awakened, skill)? '◈': '◇'} {skill.slice(0, 4)}: </Text><Dots n={currentSkillLevel(awakened, skill).level} /></Group>)
            })}
        </Grid.Col>
        <Grid.Col span={4}>
            <Title order={4}>Physical</Title>
            {["athletics", "brawl", "drive", "firearms", "weaponry", "larceny", "stealth", "survival"].map((skill) => {
                return (<Group><Text style={textStyle} key={skill}>{isRoteSpecial(awakened, skill)? '◈': '◇'} {skill.slice(0, 4)}: </Text><Dots n={currentSkillLevel(awakened, skill).level} /></Group>)
            })}
        </Grid.Col>
        <Grid.Col span={4}>
            <Title order={4}>Social</Title>
            {["animal_ken", "socialize", "empathy", "intimidation", "expression", "persuasion", "streetwise", "subterfuge"].map((skill) => {
                return (<Group><Text style={textStyle} key={skill}>{isRoteSpecial(awakened, skill)? '◈': '◇'} {skill.slice(0, 4)}: </Text><Dots n={currentSkillLevel(awakened, skill).level} /></Group>)
            })}
        </Grid.Col>
    </Grid>
    <div>
        <Title order={5}>Skill Specialities</Title>
        <Text>
        {skillSpecialities.map((entry, index) => (
            <>
                {entry.skill}: {entry.speciality}{index !== skillSpecialities.length - 1 && ", "}

            </>
        ))}
        </Text>
    </div>
    </Stack>
    )
}

export default MageSkillsPrint