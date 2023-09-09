//Technical Imports
import React from 'react';
import { Title, Grid, Text, Group, Stack, Center } from '@mantine/core';
//Util Imports
import { Awakened } from '../../../data/TatteredVeil/types/Awakened';
import { nWoD1eCurrentSkillLevel, SkillsKey } from '../../../data/nWoD1e/nWoD1eSkills';
//Utils Imports
import Dots from '../../../utils/dots'
import { globals } from '../../../assets/globals';

type MageSkillsPrintProps = {
    awakened: Awakened
}

const MageSkillsPrint = ({ awakened }: MageSkillsPrintProps) => {

    const textStyle: React.CSSProperties = {
        fontFamily: "Courier New"
    }

    const skillSpecialities: any[] = [];

    Object.entries(awakened.skills).map(([skill, skillInfo]) => {
        const skillName = skill as SkillsKey;
        const specialities = skillInfo.specialities.map((spec) => spec.name);

        // Add each speciality to the skillSpecialities array
        specialities.forEach(speciality => {
            skillSpecialities.push({
                skill: skillName,
                speciality: speciality
            });
        })
    })

    const isRoteSpecial = (awakened: Awakened, skill: SkillsKey) => {
        const skills = awakened.skills;
        const skillData = skills[skill];
        let { roteSkill } = skillData;
        return roteSkill
    }

    return (
        <Stack>
            <hr style={{ width: "50%" }} />
            <Title order={3} align='center'>Skills</Title>
            <Grid columns={globals.isPhoneScreen?4:12}>
                <Grid.Col span={4} key={'mental-skills'}>
                    <Title order={4} align='center'>Mental</Title>
                    {["academics", "computer", "crafts", "investigation", "medicine", "occult", "politics", "science"].map((skill) => {
                        let skillName = skill as SkillsKey
                        return (
                            <Center key={skillName}>
                                <Group><Text style={textStyle}>{isRoteSpecial(awakened, skillName) ? '◈' : '◇'} {skill.slice(0, 4)}: </Text><Dots n={nWoD1eCurrentSkillLevel(awakened, skillName).level} /></Group>
                            </Center>
                        )
                    })}
                </Grid.Col>
                <Grid.Col span={4} key={'physical-skills'}>
                    <Title order={4} align='center'>Physical</Title>
                    {["athletics", "brawl", "drive", "firearms", "weaponry", "larceny", "stealth", "survival"].map((skill) => {
                        let skillName = skill as SkillsKey
                        return (
                            <Center key={skillName}>
                                <Group><Text style={textStyle}>{isRoteSpecial(awakened, skillName) ? '◈' : '◇'} {skill.slice(0, 4)}: </Text><Dots n={nWoD1eCurrentSkillLevel(awakened, skillName).level} /></Group>
                            </Center>
                        )
                    })}
                </Grid.Col>
                <Grid.Col span={4} key={'social-skills'}>
                    <Title order={4} align='center'>Social</Title>
                    {["animal_ken", "socialize", "empathy", "intimidation", "expression", "persuasion", "streetwise", "subterfuge"].map((skill) => {
                        let skillName = skill as SkillsKey
                        return (
                            <Center key={skillName}>
                                <Group><Text style={textStyle}>{isRoteSpecial(awakened, skillName) ? '◈' : '◇'} {skill.slice(0, 4)}: </Text><Dots n={nWoD1eCurrentSkillLevel(awakened, skillName).level} /></Group>
                            </Center>
                        )
                    })}
                </Grid.Col>
            </Grid>
            <div>
                <Title order={5} align='center'>Skill Specialities</Title>
                <Text align='center'>
                    {skillSpecialities.map((entry, index) => (
                        <React.Fragment key={`${entry.skill}-${entry.speciality}`}>
                            {entry.skill}: {entry.speciality}{index !== skillSpecialities.length - 1 && ", "}
                        </React.Fragment>
                    ))}
                </Text>
            </div>
        </Stack>
    )
}

export default MageSkillsPrint