import z from "zod";
import { useState } from "react";
import { Awakened } from "../data/Awakened";
import { AttributeCategory, AttributeNames, attributeTooltips, handleAttributeChange } from "../data/Attributes";
import { Alert, Stack, Text, Select, NumberInput, Grid, Center, Button, Tooltip, Indicator } from "@mantine/core";
import { globals } from "../../../globals";
import { useLocalStorage } from "@mantine/hooks";

type AttributeAssignerProps = {
  awakened: Awakened;
  setAwakened: (awakened: Awakened) => void;
  nextStep: () => void;
  backStep: () => void;
  showInstructions: boolean
  setShowInstructions: (showInstruction: boolean) => void
};

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

type CategorySetting = z.infer<typeof categorySettingSchema>;
  const AttributeAssigner = ({
    awakened,
    setAwakened,
    nextStep,
    backStep,
    showInstructions, setShowInstructions 
  }: AttributeAssignerProps) => {
  const [categorySettings, setCategorySettings] = useLocalStorage<CategorySetting>({ key: "attributeSettings", defaultValue: {
    primary: {
      priority: "primary",
      category: "",
      points: 5,
    },
    secondary: {
      priority: "secondary",
      category: "",
      points: 4,
    },
    tertiary: {
      priority: "tertiary",
      category: "",
      points: 3,
    },
  }
  });

  const [categoryCounts, setCategoryCounts] = useLocalStorage<Record<AttributeCategory, number>>({ key: "attributeCount", defaultValue: {
    mental: 0,
    social: 0,
    physical: 0,
  }});

  const checkAttributesAssigned = (categoryCounts: Record<AttributeCategory, number>): boolean => {
    const values = Object.values(categoryCounts);
    return values.includes(5) && values.includes(4) && values.includes(3);
  };

  function changeCreationPoints(
    category: AttributeCategory,
    attributeName: AttributeNames,
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
  
    handleAttributeChange(
      awakened,
      setAwakened,
      attributeName,
      "creationPoints",
      newCreationPoints
    );
  }

  const getCategorySettings = (
    category: AttributeCategory
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
    category: AttributeCategory,
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
    const updatedAttributes = {
      ...awakened.attributes,
      [category]: Object.fromEntries(
        Object.entries(awakened.attributes[category]).map(([attribute, value]) => [
          attribute,
          { ...value, creationPoints: 1 },
        ])
      ),
    };
    const updatedAwakened = { ...awakened, attributes: updatedAttributes };
    setAwakened(updatedAwakened);
    setCategoryCounts({ ...categoryCounts, [category]: 0 });
    setCategorySettings(updatedCategorySettings);
  };

  const [visibilityState, setVisibilityState] = useState<{ [key in AttributeNames]?: boolean }>({});

  const attributeInputs = Object.entries(awakened.attributes).map(
    ([category, attributesInfo]) => {
      const typedCategory = category as AttributeCategory;
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
          key={`${category} Attributes`}
        >
          <Text fs="italic" fw={700} ta="center">
            {category.charAt(0).toUpperCase() + category.slice(1)} 
              : 
            {priority === "primary"? ` 5/${remainingPonits}`: priority === "secondary"? ` 4/${remainingPonits}` : priority === 'tertiary'? ` 3/${remainingPonits}` : ''}
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
          {Object.entries(attributesInfo).map(([attribute, attributeInfo]) => {
          const attributeName = attribute as AttributeNames;
          const selectedAttribute = visibilityState[attributeName];
          return (
              <div
              key={`${attribute} input`}
              >
                <Tooltip
                  multiline
                  width={220}
                  withArrow
                  transitionProps={{ duration: 200 }}
                  label={attributeTooltips[typedCategory][attributeName as keyof typeof attributeTooltips[AttributeCategory]]}
                  position={globals.isPhoneScreen ? "bottom" : "top"}
                  opened={selectedAttribute}
                  events={{ hover: false, focus: true, touch: false }}
                  >
                <NumberInput
                key={`${category}-${attributeName}`}
                label={`${attribute.charAt(0).toUpperCase() + attribute.slice(1)}`}
                min={
                  1
                }
                max={remainingPonits <= 0 ? attributeInfo.creationPoints : remainingPonits === 1 && attributeInfo.creationPoints === 4 ? 4 : 5}
                value={attributeInfo.creationPoints}
                onChange={(val: number) =>
                  changeCreationPoints(
                    typedCategory,
                    attributeName,
                    val,
                    attributeInfo.creationPoints
                  )
                }
                onClick={() => {
                  setVisibilityState((prevState) => ({
                    ...prevState,
                    [attributeName]: true,
                  }));
              }}
                onBlur={() => {
                  setVisibilityState((prevState) => ({
                    ...prevState,
                    [attributeName]: false, 
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

  const isPhoneScreen =globals.isPhoneScreen
  const isSmallScreen = globals.isSmallScreen
  
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (

    <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : undefined, paddingBottom: globals.isPhoneScreen ? '60px' : undefined}}>
    <Stack>
        <Alert color="gray">
          <Text mt={"xl"} ta="center" fz="xl" fw={700}>Attributes</Text>
          {showInstructions && (
            <div>
            <p>{`How would you describe your character's natural capabilities? Are they scheming, sly, or sturdy? Attribute Points define these characteristics mechanically across three categories: Mental, Physical, and Social.`}</p>
            <p>{`Your first step is to decide which of these three categories is your Primary, the category in which you excel the most. Next, select your so-so Secondary category. Finally, choose your weakest Tertiary category.`}</p>
            <p>{`All characters begin with one dot in each Attribute, representing basic human capabilities.`}</p>
            <p>{`The fifth dot in any Attribute costs two points to purchase. Reaching a rating of Five in any Attribute requires a total of five points (the first dot is free).`}</p>
            </div>
          )}
          <Center>
          <Button variant="outline" color="gray" onClick={toggleInstructions}>
            {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
          </Button>
          </Center>
        </Alert>

        <Grid gutter="lg" justify="center">
          {attributeInputs}
        </Grid>


        <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%"}}>
          <Alert color="dark" variant="filled" radius="xs" style={{padding:"0px"}}>
          <Button
              style={{ margin: "5px" }}
              color="gray"
              onClick={backStep}
          >
              Back
          </Button>
          <Button
              disabled={!checkAttributesAssigned(categoryCounts)}
              style={{ margin: "5px" }}
              color="gray"
              onClick={nextStep}
          >
              Next
          </Button>
          </Alert>
        </Button.Group>
        
      </Stack>
    </Center>
  );
};

export default AttributeAssigner;
