import z from "zod";
import { Awakened } from "../data/Awakened";
import { SkillCategory, SkillNames, skillTooltips, Skills, Skill } from "../data/Skills";
import { Stack, Text, Select, NumberInput, Grid, Center, Button, Tooltip } from "@mantine/core";
import { globals } from "../../../globals";
import { useLocalStorage } from "@mantine/hooks";

type SkillAssignerProps = {
    awakened: Awakened;
    setAwakened: (awakened: Awakened) => void;
    nextStep: () => void;
    backStep: () => void;
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
}: SkillAssignerProps) => {

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

  const updateSkillCreationPoints = (
    skills: Skills,
    category: SkillCategory,
    skillName: SkillNames,
    newCreationPoints: number
  ): Skills => {
    return {
      ...skills,
      [category]: {
        ...(skills[category] as { [K in SkillNames]: Skill }),
        [skillName]: {
          ...(skills[category as keyof Skills][skillName as keyof Skills[SkillCategory]] as Skill),
          creationPoints: newCreationPoints,
        },
      },
    };
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

          const updatedSkills = updateSkillCreationPoints(
            awakened.skills,
            category,
            skillName,
            newCreationPoints
          )

          const updatedAwakened = { ...awakened, skills: updatedSkills };
          setAwakened(updatedAwakened);
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
              <Text>
                {category.toUpperCase()} : {remainingPonits}
              </Text>
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
              {Object.entries(skillsInfo).map(([skill, skillsInfo]) => {
                const skillName = skill as SkillNames;
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
                      events={globals.tooltipTriggerEvents}
                      position={globals.isPhoneScreen ? "bottom" : "top"}
                    >              
                    <NumberInput
                    key={`${category}-${skillName}`}
                    label={`${skillName.charAt(0).toUpperCase() + skillName.slice(1)}`}
                    min={
                      1
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
                  />
                  </Tooltip>
                  </div>
                );
              })}
            </Grid.Col>
          );
        }
      );
    
      return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : undefined, paddingBottom: globals.isPhoneScreen ? '60px' : undefined }}>
          <Stack>
            <Grid gutter="lg" justify="center">
              {skillInputs}
    
              <Grid.Col>
              <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%"}}>
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
                  onClick={nextStep}
                  >
                  Next
                  </Button>
                  </Button.Group>
              </Grid.Col>
            </Grid>
          </Stack>
        </Center>
      );
    };
    
export default SkillAssigner;