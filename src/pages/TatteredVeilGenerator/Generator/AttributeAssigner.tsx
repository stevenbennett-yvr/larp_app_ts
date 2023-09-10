import z from "zod";
import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { AttributesKey, nWoD1eHandleAttributeChange, AttributeCategory, nWoD1eAttributeDescriptions } from '../../../data/nWoD1e/nWoD1eAttributes'
import { Alert, Stack, Text, Select, NumberInput, Grid, Center, Button, Tooltip, Indicator } from "@mantine/core";
import { globals } from "../../../assets/globals";
import { useLocalStorage } from "@mantine/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faComments, faHandFist } from "@fortawesome/free-solid-svg-icons";

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

  const [categoryCounts, setCategoryCounts] = useLocalStorage<Record<string, number>>({ key: "attributeCount", defaultValue: {
    mental: 0,
    social: 0,
    physical: 0,
  }});

  const checkAttributesAssigned = (categoryCounts: Record<string, number>): boolean => {
    const values = Object.values(categoryCounts);
    return values.includes(5) && values.includes(4) && values.includes(3);
  };

  function changeCreationPoints(
    attributeName: AttributesKey,
    newCreationPoints: number,
    prevCreationPoints: number,
  ): void {
    let category = awakened.attributes[attributeName].category
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
  
    console.log(awakened.attributes)

    nWoD1eHandleAttributeChange(
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

    const updatedAttributes = awakened.attributes;

    for (const [attribute, value] of Object.entries(awakened.attributes)) {
      if (value.category === category) {
        updatedAttributes[attribute as AttributesKey] = {
          ...value,
          creationPoints: 1,
          experiencePoints: 0,
        };
      } else {
        updatedAttributes[attribute as AttributesKey] = value;
      }
    }

    const updatedAwakened = { ...awakened, attributes: updatedAttributes };
    console.log(updatedAwakened)
    setAwakened(updatedAwakened);
    setCategoryCounts({ ...categoryCounts, [category]: 0 });
    setCategorySettings(updatedCategorySettings);
  };

  const priorityIcons = {
    mental: faBrain,
    physical: faHandFist,
    social: faComments,
  };

  console.log(awakened.attributes)

  const attributeCategories = ['mental', 'physical', 'social']
  const attributeInputs = attributeCategories.map(category => {
      let typedCategory = category as AttributeCategory
      const { priority, points } = getCategorySettings(typedCategory);
      const categoryCount = categoryCounts[category];
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
          <Text fw={500} fz="lg" color="dimmed" ta="center">
            <FontAwesomeIcon icon={priorityIcons[typedCategory]} /> {' '}
            {typedCategory.charAt(0).toUpperCase() + typedCategory.slice(1)} 
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
          {Object.entries(awakened.attributes).map(([attribute, attributeInfo]) => {
            const typedAttribute = attribute as AttributesKey
            if (attributeInfo.category === category) {
            return (
                <div
                key={`${attribute} input`}
                >
                  <Tooltip
                    multiline
                    width={220}
                    withArrow
                    offset={20}
                    transitionProps={{ duration: 200 }}
                    label={nWoD1eAttributeDescriptions[typedAttribute]}
                    position={globals.isPhoneScreen ? "bottom" : "top"}
                    events={{ hover: true, focus: false, touch: false }}
                    >
                  <NumberInput
                  key={`${category}-${attribute}`}
                  label={`${attribute.charAt(0).toUpperCase() + attribute.slice(1)}`}
                  min={
                    1
                  }
                  max={remainingPonits <= 0 ? attributeInfo.creationPoints : remainingPonits === 1 && attributeInfo.creationPoints === 4 ? 4 : 5}
                  value={attributeInfo.creationPoints}
                  onChange={(val: number) =>
                    changeCreationPoints(
                      typedAttribute,
                      val,
                      attributeInfo.creationPoints
                      )
                  }

                />
                </Tooltip>
                </div>
              )}
              else {
                return null
              };
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

    <Center style={{ paddingTop: globals.isPhoneScreen ? '60px' : '60px', paddingBottom: globals.isPhoneScreen ? '60px' : '60px'}}>
      <Stack mt={"xl"} align="center" spacing="xl">

        <Alert color="gray">
          <Stack>
          <Text mt={"xl"} ta="center" fz="xl" fw={700} style={{marginTop:"0px"}}>Attributes</Text>
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
          </Stack>
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
