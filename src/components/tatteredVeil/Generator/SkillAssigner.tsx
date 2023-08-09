import z from "zod";
import { Awakened } from "../data/Awakened";
import { addSpeciality, removeSpeciality, skillSelect, SkillCategory, SkillNames, skillTooltips, handleSkillChange, Speciality, getSkillCategory, Skill, Skills } from "../data/Skills";
import { ScrollArea, Indicator, Group, TextInput, Alert, Stack, Text, Select, NumberInput, Grid, Center, Button, Tooltip, Modal } from "@mantine/core";
import { globals } from "../../../globals";
import { useLocalStorage } from "@mantine/hooks";
import { useState } from "react";

type SkillAssignerProps = {
    awakened: Awakened;
    setAwakened: (awakened: Awakened) => void;
    nextStep: () => void;
    backStep: () => void;
    showInstructions: boolean;
    setShowInstructions: (showInstruction: boolean) => void;
}

const prioritySchema = z.object({
    priority: z.union([
      z.literal("primary"),
      z.literal("secondary"),
      z.literal("tertiary"),
      z.literal(""),
    ]),
    category: z.string(),
    points: z.number(),
  });

const categorySettingSchema = z.object({
    primary: prioritySchema,
    secondary: prioritySchema,
    tertiary: prioritySchema,
});

type CategorySetting = z.infer<typeof categorySettingSchema>

const SkillAssigner = ({
    awakened,
    setAwakened,
    nextStep,
    backStep,
    showInstructions, 
    setShowInstructions
}: SkillAssignerProps) => {

  const [modalOpen, setModalOpen] = useState(false);

  const [categorySettings, setCategorySettings] = useLocalStorage<CategorySetting>({ key: "skillSettings", defaultValue: {
    primary: {
      priority: "primary",
      category: "",
      points: 11,
    },
    secondary: {
      priority: "secondary",
      category: "",
      points: 7,
    },
    tertiary: {
      priority: "tertiary",
      category: "",
      points: 4,
    },
  }
  });

  const [categoryCounts, setCategoryCounts] = useLocalStorage<Record<SkillCategory, number>>({ key: "skillCount", defaultValue: {
    mental: 0,
    social: 0,
    physical: 0,
  }});

    const checkSkillsAssigned = (categoryCounts: Record<SkillCategory, number>): boolean => {
        const values = Object.values(categoryCounts);
        return values.includes(11) && values.includes(7) && values.includes(4);
      };


    function changeCreationPoints(
        category: SkillCategory,
        skillName: SkillNames,
        newCreationPoints: number,
        prevCreationPoints: number,
    ): void {
        let totalPoints = categoryCounts[category];
        if (newCreationPoints === 5 && prevCreationPoints < newCreationPoints) {
            setCategoryCounts({
              ...categoryCounts,
              [category]: totalPoints + newCreationPoints - prevCreationPoints + 1,
            });
          } else if (newCreationPoints === 4 && newCreationPoints < prevCreationPoints) {
            setCategoryCounts({
              ...categoryCounts,
              [category]: totalPoints + newCreationPoints - prevCreationPoints - 1,
            });
          } else {
            setCategoryCounts({
              ...categoryCounts,
              [category]: totalPoints + newCreationPoints - prevCreationPoints,
            });
          }

          handleSkillChange(awakened, setAwakened, skillName, "creationPoints", newCreationPoints)
    }

    const getCategorySettings = (
        category: SkillCategory
      ): { priority: string | null; points: number } => {
        const settings = Object.values(categorySettings);
        for (const setting of settings) {
          if (setting.category === category) {
            return { priority: setting.priority, points: setting.points };
          }
        }
        return { priority: null, points: 0 };
      };

      const handlePriorityChange = (
        category: SkillCategory,
        priority: "primary" | "secondary" | "tertiary" | "" | "" | ""
      ) => {
        let updatedCategorySettings: CategorySetting = { ...categorySettings };
        if (priority === "primary") {
          updatedCategorySettings.primary.category = category;
        } else if (priority === "secondary") {
          updatedCategorySettings.secondary.category = category;
        } else if (priority === "tertiary") {
          updatedCategorySettings.tertiary.category = category;
        } else if (priority === "") {
          if (updatedCategorySettings.primary.category === category) {
            updatedCategorySettings.primary.category = "";
          } else if (updatedCategorySettings.secondary.category === category) {
            updatedCategorySettings.secondary.category = "";
          } else if (updatedCategorySettings.tertiary.category === category) {
            updatedCategorySettings.tertiary.category = "";
          }
        }
    const updatedSkills = {
      ...awakened.skills,
      [category]: Object.fromEntries(
        Object.entries(awakened.skills[category]).map(([skill, value]) => [
          skill,
          { ...value, creationPoints: 0 },
        ])
      ),
    };
        const updatedAwakened = { ...awakened, skills: updatedSkills };
        setAwakened(updatedAwakened);
        setCategoryCounts({ ...categoryCounts, [category]: 0 });
        setCategorySettings(updatedCategorySettings);
      };
    
      const isPhoneScreen = globals.isPhoneScreen
      const isSmallScreen = globals.isSmallScreen
      const [visibilityState, setVisibilityState] = useState<{ [key in SkillNames]?: boolean }>({});

      const skillInputs = Object.entries(awakened.skills).map(
        ([category, skillsInfo]) => {
          const typedCategory = category as SkillCategory;
          const { priority, points } = getCategorySettings(typedCategory);
          const categoryCount = categoryCounts[typedCategory];
          const remainingPonits = points - categoryCount;
    
          const isPrimarySelected = Object.values(categorySettings).some(
            (setting) => setting.priority === "primary" && setting.category !== ""
          );
          const isSecondarySelected = Object.values(categorySettings).some(
            (setting) => setting.priority === "secondary" && setting.category !== ""
          );
          const isTertiarySelected = Object.values(categorySettings).some(
            (setting) => setting.priority === "tertiary" && setting.category !== ""
          );
    
          return (
            <Grid.Col
              span={globals.isPhoneScreen ? "content" : 4}
              key={`${category} Skills`}
            >
              <Text fs="italic" fw={700} ta="center">
                {category.charAt(0).toUpperCase() + category.slice(1)} 
                : 
                {priority === "primary"? ` 11/${remainingPonits}`: priority === "secondary"? ` 7/${remainingPonits}` : priority === 'tertiary'? ` 4/${remainingPonits}` : ''}
              </Text>
              <Indicator color={priority === "primary" || priority === "secondary" || priority === "tertiary" ? "" : "red"} inline processing size={12}>
              <Select
                value={priority || ""}
                onChange={(value) =>
                  handlePriorityChange(typedCategory, value as keyof CategorySetting)
                }
                data={[
                  { value: "primary", label: "Primary", disabled: isPrimarySelected },
                  { value: "secondary", label: "Secondary", disabled: isSecondarySelected },
                  { value: "tertiary", label: "Tertiary", disabled: isTertiarySelected },
                  { value: "", label: "Unselected" },
                ]}
              />
              </Indicator>
              <hr/>
              {Object.entries(skillsInfo).map(([skill, skillsInfo]) => {
                const skillName = skill as SkillNames;
                const selectedSkill = visibilityState[skillName];
      
                return (
                  <div
                  key={`${skill} input`}
                  >
                    <Tooltip
                      multiline
                      width={220}
                      withArrow
                      transitionProps={{ duration: 200 }}
                      label={skillTooltips[typedCategory][skillName as keyof typeof skillTooltips[SkillCategory]]}
                      opened={selectedSkill}
                      events={{ hover: false, focus: true, touch: false }}
                      position={globals.isPhoneScreen ? "bottom" : "top"}
                    >              
                    <NumberInput
                    key={`${category}-${skillName}`}
                    label={`${skillName.charAt(0).toUpperCase() + skillName.slice(1)}`}
                    min={
                      0
                    }
                    max={remainingPonits <= 0 ? skillsInfo.creationPoints : remainingPonits === 1 && skillsInfo.creationPoints === 4 ? 4 : 5}
                    value={skillsInfo.creationPoints}
                    onChange={(val: number) =>
                      changeCreationPoints(
                        typedCategory,
                        skillName,
                        val,
                        skillsInfo.creationPoints
                      )
                    }
                    onClick={() => {
                      setVisibilityState((prevState) => ({
                        ...prevState,
                        [skillName]: true,
                      }));
                  }}
                    onBlur={() => {
                      setVisibilityState((prevState) => ({
                        ...prevState,
                        [skillName]: false, 
                      }));
                  }} 
                  />
                  </Tooltip>
                  </div>
                );
              })}
            </Grid.Col>
          );
        }
      );
    
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


        const specialityInput = () => {
          
          const isSpecialityAdded = (
            skillName: SkillNames,
            specialityName: string,
          ) => {
            const skills = awakened.skills
            const skillCategory: SkillCategory = getSkillCategory(skillName);
            let specialities = (skills[skillCategory as keyof Skills][skillName as keyof Skills[SkillCategory]] as Skill).specialities
            return specialities.some((speciality: Speciality) => speciality.name === specialityName);
          };

          const inputW = globals.isPhoneScreen ? 140 : 200

          return (
            <Center style={{paddingBottom:"100px"}}>
            <Stack>
              <Text mt={"xl"} ta="center" fz="xl" fw={700}>Specialities</Text>
                    {showInstructions && (
                      <Text>
                      <p>{`Where skills represent base knowledge of a subjet, Specialities represent a more fouced area of study. When applied Specialites provide a bonus modifier.`}</p>
                      <p>{`Add three Skill Specialites. These should be very specific.`}</p>
                      </Text>
                    )}
              <Center>
              <Button variant="outline" color="gray" onClick={toggleInstructions}>
                {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
              </Button>
              </Center>
              <Group>
                      <Select
                        w={inputW}
                        searchable
                        dropdownPosition="bottom"
                        data={skillSelect}
                        value={firstSkill}
                        onChange={(value) => setFirstSkill(value as SkillNames)}
                        maxDropdownHeight={150}
                        disabled={isSpecialityAdded(firstSkill, firstSpecialityName)}
                        />
                      <TextInput 
                        w={inputW}
                        disabled={isSpecialityAdded(firstSkill, firstSpecialityName)}
                        value={firstSpecialityName} 
                        onChange={(event) => setFirstSpecialityName(event.currentTarget.value)}
                      />
                      {isSpecialityAdded(firstSkill, firstSpecialityName) ? (
                          <Button color="red" onClick={() => {removeSpeciality(awakened, setAwakened, firstSkill, firstSpecialityName); setFirstSpecialityName("")}}>Remove Speciality</Button>
                      ) : (
                          <Button disabled={firstSpecialityName === ""} onClick={() => addSpeciality(awakened, setAwakened, firstSkill, firstSpecialityName, "creationPoints")}>Add Speciality</Button>
                      )}
                  </Group>
                  <Group>
                  <Select
                          w={inputW}
                          searchable
                          dropdownPosition="bottom"
                          data={skillSelect}
                          value={secondSkill}
                          onChange={(value) => setSecondSkill(value as SkillNames)}
                          maxDropdownHeight={150}
                          disabled={isSpecialityAdded(secondSkill, secondSpecialityName)}
                          />
                      <TextInput 
                        w={inputW}
                        disabled={isSpecialityAdded(secondSkill, secondSpecialityName)}
                        value={secondSpecialityName} 
                        onChange={(event) => setSecondSpecialityName(event.currentTarget.value)}
                      />
                      {isSpecialityAdded(secondSkill, secondSpecialityName) ? (
                          <Button color="red" onClick={() => {removeSpeciality(awakened, setAwakened, secondSkill, secondSpecialityName); setSecondSpecialityName("")}}>Remove Speciality</Button>
                      ) : (
                          <Button disabled={secondSpecialityName === ""} onClick={() => addSpeciality(awakened, setAwakened, secondSkill, secondSpecialityName, "creationPoints")}>Add Speciality</Button>
                      )}
                  </Group>
                  <Group>
                  <Select
                    w={inputW}
                    searchable
                    dropdownPosition="bottom"
                    data={skillSelect}
                    value={thirdSkill}
                    onChange={(value) => setThirdSkill(value as SkillNames)}
                    maxDropdownHeight={150}
                    disabled={isSpecialityAdded(thirdSkill, thirdSpecialityName)}
                    />
                      <TextInput
                        w={inputW} 
                        disabled={isSpecialityAdded(thirdSkill, thirdSpecialityName)}
                        value={thirdSpecialityName} 
                        onChange={(event) => setThirdSpecialityName(event.currentTarget.value)}
                      />
                      {isSpecialityAdded(thirdSkill, thirdSpecialityName) ? (
                          <Button color="red" onClick={() => {removeSpeciality(awakened, setAwakened, thirdSkill, thirdSpecialityName); setThirdSpecialityName("")}}>Remove Speciality</Button>
                      ) : (
                          <Button disabled={thirdSpecialityName === ""} onClick={() => addSpeciality(awakened, setAwakened, thirdSkill, thirdSpecialityName, "creationPoints")}>Add Speciality</Button>
                      )}
                  </Group>
                  <Button.Group>      
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

      const handleOpenModal = () => {
        setModalOpen(true);
        };

      const handleCloseModal = () => {
        setModalOpen(false);
        };

        const toggleInstructions = () => {
          setShowInstructions(!showInstructions);
        };

      return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : undefined, paddingBottom: globals.isPhoneScreen ? '60px' : undefined}}>
        <Stack>
            <Alert color="gray">
              <Text mt={"xl"} ta="center" fz="xl" fw={700}>Skills</Text>
                <Center>
                <Button variant="outline" color="gray" onClick={toggleInstructions}>
                    {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                </Button>
                </Center>
                    {showInstructions && (
                      <div>
                        <p>{`Character Skills reflect the education and training your character has aquired over their life in addition to whatever other interests they may carry.`}</p>
                        <p>{`Like Attributes, Skills are broken down into three categoires. Mental, Physical and Social. Note that skills do not begin with one dot in Each, it is possible to be completely untrained in a particular skill.`}</p>
                        <p>{`The fifth dot in any Skill, like with attributes before, cost two dots to purchase.`}</p>
                      </div>
                    )}
              </Alert>

              <Grid gutter="lg" justify="center">
                {skillInputs}
              <Grid.Col>

              <Modal
                opened={modalOpen}
                onClose={handleCloseModal}
                size={700}
                scrollAreaComponent={ScrollArea.Autosize}
              >
                {specialityInput()}
              </Modal>
              <Alert color="dark" variant="filled" radius="xs" style={{padding:"0px", position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%"}}>
              <Button.Group>
                  <Button
                    style={{ margin: "5px" }}
                    color="gray"
                    onClick={backStep}
                  >
                    Back
                  </Button>
      
                  <Button
                  disabled={!checkSkillsAssigned(categoryCounts)}
                  style={{ margin: "5px" }}
                  color="gray"
                  onClick={handleOpenModal}
                  >
                  Next
                  </Button>
              </Button.Group>
              </Alert>
              </Grid.Col>
            </Grid>
          </Stack>
        </Center>
      );
    };
    
export default SkillAssigner;