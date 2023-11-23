import { useEffect, useState } from 'react';
import { Modal, Text } from '@mantine/core';
import { Kindred } from '../../../data/GoodIntentions/types/Kindred';
import { V5SkillsKey, v5allSkills } from '../../../data/GoodIntentions/types/V5Skills';

/* Yeah this is too hard, lets try it again in a month or two */


type ReassignmentProps = {
    kindred: Kindred;
    setKindred: (kindred: Kindred) => void;
};

const Reassignment = ({ kindred }: ReassignmentProps) => {
    const { skills } = kindred;
    const [hasBothPoints, setHasBothPoints] = useState(false);
    const [skillsToReassign, setSkillsToReassign] = useState<V5SkillsKey[]>([]);

    useEffect(() => {
        let tempSkillsToReassign: V5SkillsKey[] = [];

        for (const skillName in kindred.skills) {
            let skillKey = skillName as V5SkillsKey;
            const skill = skills[skillKey];
            if (skill.freebiePoints > 0 && skill.creationPoints > 0) {
                tempSkillsToReassign.push(skillKey);
                setHasBothPoints(true);
            }
        }

        setSkillsToReassign(tempSkillsToReassign);
    }, [kindred.skills]);

    console.log(skillsToReassign)

    return (
        <Modal opened={hasBothPoints} onClose={() => setHasBothPoints(false)}>
            {v5allSkills.map((skill) => {
                let skillKey = skill as V5SkillsKey;
                const skillData = skills[skillKey];
                if (skillData.creationPoints === 0) {
                    return (
                        <Text>{skill}</Text>
                    )
                }
            })}
        </Modal>
    );

};

export default Reassignment;
