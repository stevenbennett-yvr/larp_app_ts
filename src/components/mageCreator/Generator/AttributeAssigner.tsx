import z from "zod";
import { Awakened } from "../data/Awakened";
import { AttributeCategory, AttributeNames, attributeTooltips, Attributes, Attribute } from "../data/Attributes";
import { Stack, Text, Select, NumberInput, Grid, Center, Button, Tooltip } from "@mantine/core";
import { globals } from "../../../globals";
import { useLocalStorage } from "@mantine/hooks";

type AttributeAssignerProps = {
  awakened: Awakened;
  setAwakened: (awakened: Awakened) => void;
  nextStep: () => void;
  backStep: () => void;
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

  const updateAttributeCreationPoints = (
    attributes: Attributes,
    category: AttributeCategory,
    attributeName: AttributeNames,
    newCreationPoints: number
  ): Attributes => {
    return {
      ...attributes,
      [category]: {
        ...(attributes[category] as { [K in AttributeNames]: Attribute }),
        [attributeName]: {
          ...(attributes[category as keyof Attributes][attributeName as keyof Attributes[AttributeCategory]] as Attribute),
          creationPoints: newCreationPoints,
        },
      },
    };
  };

  function changeCreationPoints(
    category: AttributeCategory,
    attributeName: AttributeNames,
    newCreationPoints: number,
    prevCreationPoints: number
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
  
    const updatedAttributes = updateAttributeCreationPoints(
      awakened.attributes,
      category,
      attributeName,
      newCreationPoints
    );
  
    const updatedAwakened = { ...awakened, attributes: updatedAttributes };
    setAwakened(updatedAwakened);
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
          {Object.entries(attributesInfo).map(([attribute, attributeInfo]) => {
          const attributeName = attribute as AttributeNames;
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
                  events={globals.tooltipTriggerEvents}
                  position={globals.isPhoneScreen ? "bottom" : "top"}
                >              
                <NumberInput
                key={`${category}-${attributeName}`}
                label={`${`${attribute.charAt(0).toUpperCase() + attribute.slice(1)}`}`}
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

  return (

    <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : undefined, paddingBottom: globals.isPhoneScreen ? '60px' : undefined}}>
    <Stack>
        <Grid gutter="lg" justify="center">
          {attributeInputs}
        </Grid>

        <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%"}}>
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
        </Button.Group>
      </Stack>
    </Center>
  );
};

export default AttributeAssigner;
