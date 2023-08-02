import { Center } from "@mantine/core";
import { Awakened, getEmptyAwakened } from "./data/Awakened";
//import { logChanges } from './Generator/utils/Logging'
import Basics from "./Generator/Basics";
import AttributeAssigner from "./Generator/AttributeAssigner";
import SkillAssigner from "./Generator/SkillAssigner"
import PathPicker from "./Generator/PathPicker";
import OrderPicker from "./Generator/OrderPicker";
import ArcanaRoteAssigner from "./Generator/ArcanaRoteassigner"
import MeritAssigner from "./Generator/MeritAssigner";
import ExperienceAssigner from "./Generator/ExperienceAssigner"
import FinalTouches from "./Generator/FinalTouches"
import PrintSheet from './Generator/PrintSheet'
import NavBar from "./Generator/utils/Stepper";
import SideSheet from "./Generator/utils/SideSheet";
import { useLocalStorage } from "@mantine/hooks";

// TODO: PRIORITY: Finish the character creator

const GenerateAwakened = () => {
//  const emptyAwakened = getEmptyAwakened()
  const [awakened, setAwakened] = useLocalStorage<Awakened>({ key: "awakened", defaultValue: getEmptyAwakened()})
  const [selectedStep, setSelectedStep] = useLocalStorage({ key: "selectedStep", defaultValue: 0 })
  const [showInstructions, setShowInstructions] = useLocalStorage({ key: "showInstructions", defaultValue: false });

    const getStepComponent = () => {
    switch (selectedStep) {
      case 0:
        return (
          <Basics
            awakened={awakened}
            setAwakened={setAwakened}
            nextStep={() => {
              setSelectedStep(selectedStep + 1);
            }}
            showInstructions={showInstructions}
            setShowInstructions={setShowInstructions}
          />
        );
      case 1:
        return (
          <AttributeAssigner
            awakened={awakened}
            setAwakened={setAwakened}
            nextStep={() => {
              setSelectedStep(selectedStep + 1);
            }}
            backStep={() => {
              setSelectedStep(selectedStep - 1)
            }}
            showInstructions={showInstructions}
            setShowInstructions={setShowInstructions}
          />
        );
      case 2:
        return (
          <SkillAssigner
            awakened={awakened}
            setAwakened={setAwakened}
            nextStep={() => {
              setSelectedStep(selectedStep + 1);
            }}
            backStep={() => {
              setSelectedStep(selectedStep - 1)
            }}
            showInstructions={showInstructions}
            setShowInstructions={setShowInstructions}
          />
        )
        case 3 :
          return (
            <PathPicker
            awakened={awakened}
            setAwakened={setAwakened}
            nextStep={() => {
              setSelectedStep(selectedStep + 1);
            }}
            backStep={() => {
              setSelectedStep(selectedStep - 1)
            }}
            showInstructions={showInstructions}
            setShowInstructions={setShowInstructions}
            />
          )
        case 4:
          return (
            <OrderPicker
            awakened={awakened}
            setAwakened={setAwakened}
            nextStep={() => {
              setSelectedStep(selectedStep + 1);
            }}
            backStep={() => {
              setSelectedStep(selectedStep - 1)
            }}
            showInstructions={showInstructions}
            setShowInstructions={setShowInstructions}
            />
          )
        case 5:
          return (
            <ArcanaRoteAssigner
              awakened={awakened}
              setAwakened={setAwakened}
              nextStep={() => {
                setSelectedStep(selectedStep + 1);
              }}
              backStep={() => {
                setSelectedStep(selectedStep - 1)
              }}
              showInstructions={showInstructions}
              setShowInstructions={setShowInstructions}
            />
          )
        case 6:
          return (
            <MeritAssigner
              awakened={awakened}
              setAwakened={setAwakened}
              nextStep={() => {
                setSelectedStep(selectedStep + 1);
              }}
              backStep={() => {
                setSelectedStep(selectedStep - 1)
              }}
              showInstructions={showInstructions}
              setShowInstructions={setShowInstructions}
            />
          )
        case 7:
          return (
            <ExperienceAssigner
              awakened={awakened}
              setAwakened={setAwakened}
              nextStep={() => {
                setSelectedStep(selectedStep + 1);
              }}
              backStep={() => {
                setSelectedStep(selectedStep - 1)
              }}
              showInstructions={showInstructions}
              setShowInstructions={setShowInstructions}
            />
          )
        case 8:
          return (
            <FinalTouches
              awakened={awakened}
              setAwakened={setAwakened}
              nextStep={() => {
                setSelectedStep(selectedStep + 1);
              }}
              backStep={() => {
                setSelectedStep(selectedStep - 1)
              }}
            />
          )
        case 9:
          return (
            <PrintSheet
              awakened={awakened}
              backStep={() => {
                setSelectedStep(selectedStep - 1);
              }}
              submit={() => {
                //const changes = logChanges(emptyAwakened, awakened);

              }}
            />
          )
      default:
        return null; // Return a default component or handle the case accordingly
    }
  };

  


  return (
    <Center h={"100%"}>
      <SideSheet
        awakened={awakened}
      />
      <NavBar
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
        awakened={awakened}
      />
      {getStepComponent()}
    </Center>
  );
};

export default GenerateAwakened;