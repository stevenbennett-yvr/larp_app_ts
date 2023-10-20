import { Text, TextInput } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"
import { globals } from "../../../assets/globals"
import { V5SkillsKey, v5SkillLevel } from "../../../data/GoodIntentions/types/V5Skills"
import { upcase } from "../../../utils/case"

type SpecialtyGridProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
}


const SpecialtyGrid = ({ kindred, setKindred }: SpecialtyGridProps) => {
    const phoneScreen = globals.isPhoneScreen;
    const inputW = phoneScreen ? 140 : 200
    const specialtySkills: V5SkillsKey[] = ["crafts", "performance", "academics", "science"];
    const specialties = kindred.skillSpecialties;


    const skillSpecialtyInputs = (skill: V5SkillsKey) => {
        const phenom = kindred.meritsFlaws.some(mf => mf.name === `Phenom (${upcase(skill)})`)

        console.log(`Phenom (${upcase(skill)})`)

        const skillLevel = v5SkillLevel(kindred, skill).level * (phenom ? 2 : 1);
        const skillSpecialties = specialties.filter(entry => entry.skill === skill);
        let specialVals = Array.from({ length: skillLevel }, (_, i) => ({ name: skillSpecialties[i]?.name || "", skill: skill }));

        if (skillSpecialties.length !== skillLevel) {
            specialVals = Array.from({ length: skillLevel }, (_, i) => ({ name: skillSpecialties[i]?.name || "", skill: skill }));
        }

        const updateSkillSpecialty = (index: number, value: string) => {
            const updatedCraftVals = [...specialVals];
            updatedCraftVals[index].name = value;
            const clearedSpecialities = kindred.skillSpecialties.filter(entry => entry.skill !== skill)
            const updatedSpecialities = clearedSpecialities.concat(updatedCraftVals)
            setKindred({
                ...kindred,
                skillSpecialties: updatedSpecialities
            });

        };

        const Inputs = [];
        for (let i = 0; i < skillLevel; i++) {
            Inputs.push(
                <div key={`${skill}Specialty${i}`}>
                    <TextInput
                        w={inputW}
                        value={specialVals[i]?.name || ''}
                        onChange={(e) => updateSkillSpecialty(i, e.target.value)}
                    />
                </div>
            );
        }

        return (
            <div key={`${skill}Specialties`}>
                <Text>{upcase(skill)} Specialties</Text>
                {Inputs}
            </div>
        )

    }

    return (
        <div>
            {specialtySkills.map((skill) => {
                const skillLevel = v5SkillLevel(kindred, skill).level;
                if (skillLevel > 0) {
                    return skillSpecialtyInputs(skill);
                } else {
                    return null;
                }
            })}
        </div>
    );
}

export default SpecialtyGrid