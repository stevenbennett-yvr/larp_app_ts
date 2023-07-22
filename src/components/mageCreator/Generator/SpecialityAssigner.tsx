
import { Awakened } from "../data/Awakened";
import { allSkills, SkillNames, Speciality, SkillCategory, Skill, Skills, getSkillCategory } from "../data/Skills";
import { Center, Select, Text, Stack, Group, TextInput, Button } from "@mantine/core";
import { globals } from "../../../globals";
import { useLocalStorage } from '@mantine/hooks';

type SpecialityAssignerProps = {
    awakened: Awakened;
    setAwakened: (awakened: Awakened) => void;
    nextStep: () => void;
    backStep: () => void;
}

const phoneScreen = globals.isPhoneScreen

const SpecialityAssigner = ({ 
        awakened,
        setAwakened, 
        nextStep, 
        backStep,
    }: SpecialityAssignerProps) => {
        const inputW = phoneScreen ? 140 : 200


        const skillsArray: { skill: SkillNames; creationPoints: number }[] = [];

        Object.entries(awakened.skills).forEach(([,categorySkills]) => {
            Object.entries(categorySkills).forEach(([skill, currentSkill]) => {
              skillsArray.push({
                skill: skill as SkillNames,
                creationPoints: currentSkill.creationPoints,
              });
            });
          });
          
          skillsArray.sort((a, b) => b.creationPoints - a.creationPoints);
          
          const topSkills = skillsArray.slice(0, 3);
          
          const [firstSkill, setFirstSkill] = useLocalStorage<SkillNames>({
            key: "firstSkill",
            defaultValue: topSkills[0].skill,
          });
          const [secondSkill, setSecondSkill] = useLocalStorage<SkillNames>({
            key: "secondSkill",
            defaultValue: topSkills[1].skill,
          });
          const [thirdSkill, setThirdSkill] = useLocalStorage<SkillNames>({
            key: "thirdSkill",
            defaultValue: topSkills[2].skill,
          });        
        const [firstSpecialityName, setFirstSpecialityName] = useLocalStorage({ key: "firstSpecialityName", defaultValue: ''});
        const [secondSpecialityName, setSecondSpecialityName] = useLocalStorage({ key: "secondSpecialityName", defaultValue: ''});
        const [thirdSpecialityName, setThirdSpecialityName] = useLocalStorage({ key: "thirdSpecialityName", defaultValue: ''});


        const handleAddSpeciality = (selectedSkill: SkillNames, specialityName: string) => {        
            const skillCategory : SkillCategory = getSkillCategory(selectedSkill);

            const updatedSkills = { ...awakened.skills };
            const skill = (updatedSkills[skillCategory as SkillCategory] as { [key in SkillNames]: Skill })[selectedSkill as SkillNames]

            const newSpeciality: Speciality = {
              name: specialityName,
              creationPoints: 1,
              freebiePoints: 0,
              experiencePoints: 0,
            };

            skill.specialities.push(newSpeciality);

            setAwakened({...awakened, skills: updatedSkills});
        };

        const handleRemoveSpeciality = (
          selectedSkill: SkillNames,
          specialityName: string,
          setSpecialtyName: any // replace "any" with the actual type of setSpecialtyName
        ) => {
          const skillCategory: SkillCategory = getSkillCategory(selectedSkill);
        
          const updatedSkills = { ...awakened.skills };
          const skill = (updatedSkills[skillCategory as SkillCategory] as {
            [key in SkillNames]: Skill;
          })[selectedSkill as SkillNames];
        
          // Find the index of the specialty to remove
          const indexToRemove = skill.specialities.findIndex(
            (speciality) => speciality.name === specialityName
          );
        
          if (indexToRemove !== -1) {
            // Remove the specialty using splice method
            skill.specialities.splice(indexToRemove, 1);
        
            // Call setSpecialtyName to update the specialty name in the component
            setSpecialtyName("");
            
            // Update the state with the updated skills
            setAwakened({ ...awakened, skills: updatedSkills });
          }
        };
          
          const isSpecialityAdded = (
            skillName: SkillNames,
            specialityName: string,
          ) => {
            const skills = awakened.skills
            const skillCategory: SkillCategory = getSkillCategory(skillName);
            let specialities = (skills[skillCategory as keyof Skills][skillName as keyof Skills[SkillCategory]] as Skill).specialities
            return specialities.some((speciality: Speciality) => speciality.name === specialityName);
          };

          const isPhoneScreen = globals.isPhoneScreen
          const isSmallScreen = globals.isSmallScreen

        return (
          <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : undefined, paddingBottom: globals.isPhoneScreen ? '60px' : undefined}}>
          <Stack>
            <div>
                <Text>Specialities</Text>
            </div>
                <Group>
                    <Select
                        w={inputW}
                        searchable
                        dropdownPosition="bottom"
                        data={allSkills}
                        value={firstSkill}
                        onChange={(value) => setFirstSkill(value as SkillNames)}
                        />
                    <TextInput 
                        disabled={isSpecialityAdded(firstSkill, firstSpecialityName)}
                        value={firstSpecialityName} 
                        onChange={(event) => setFirstSpecialityName(event.currentTarget.value)}
                    />
                    {isSpecialityAdded(firstSkill, firstSpecialityName) ? (
                        <Button color="red" onClick={() => handleRemoveSpeciality(firstSkill, firstSpecialityName, setFirstSpecialityName)}>Remove Speciality</Button>
                    ) : (
                        <Button disabled={firstSpecialityName === ""} onClick={() => handleAddSpeciality(firstSkill, firstSpecialityName)}>Add Speciality</Button>
                    )}
                </Group>
                <Group>
                <Select
                        w={inputW}
                        searchable
                        dropdownPosition="bottom"
                        data={allSkills}
                        value={secondSkill}
                        onChange={(value) => setSecondSkill(value as SkillNames)}
                        />
                    <TextInput 
                        disabled={isSpecialityAdded(secondSkill, secondSpecialityName)}
                        value={secondSpecialityName} 
                        onChange={(event) => setSecondSpecialityName(event.currentTarget.value)}
                    />
                    {isSpecialityAdded(secondSkill, secondSpecialityName) ? (
                        <Button color="red" onClick={() => handleRemoveSpeciality(secondSkill, secondSpecialityName, setSecondSpecialityName)}>Remove Speciality</Button>
                    ) : (
                        <Button disabled={secondSpecialityName === ""} onClick={() => handleAddSpeciality(secondSkill, secondSpecialityName)}>Add Speciality</Button>
                    )}
                </Group>
                <Group>
                <Select
                        w={inputW}
                        searchable
                        dropdownPosition="bottom"
                        data={allSkills}
                        value={thirdSkill}
                        onChange={(value) => setThirdSkill(value as SkillNames)}
                        />
                    <TextInput 
                        disabled={isSpecialityAdded(thirdSkill, thirdSpecialityName)}
                        value={thirdSpecialityName} 
                        onChange={(event) => setThirdSpecialityName(event.currentTarget.value)}
                    />
                    {isSpecialityAdded(thirdSkill, thirdSpecialityName) ? (
                        <Button color="red" onClick={() => handleRemoveSpeciality(thirdSkill, thirdSpecialityName, setThirdSpecialityName)}>Remove Speciality</Button>
                    ) : (
                        <Button disabled={thirdSpecialityName === ""} onClick={() => handleAddSpeciality(thirdSkill, thirdSpecialityName)}>Add Speciality</Button>
                    )}
                </Group>
                <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%"}}>
                <Button
                  style={{ margin: "5px" }}
                  color="gray"
                  onClick={backStep}
                >
                  Back
                </Button>
    
                <Button
                disabled={!isSpecialityAdded(firstSkill, firstSpecialityName) || !isSpecialityAdded(secondSkill, secondSpecialityName) || !isSpecialityAdded(thirdSkill, thirdSpecialityName)}
                style={{ margin: "5px" }}
                color="gray"
                onClick={nextStep}
                >
                Next
                </Button>
                </Button.Group>
            </Stack>
        </Center>
        )
    }

    export default SpecialityAssigner