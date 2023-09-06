import { Awakened } from "../../../../data/TatteredVeil/types/Awakened"
import { PathName, Paths } from "../../../../data/TatteredVeil/types/Path"
import { RoteRef } from "../../../../data/TatteredVeil/types/Rotes"

type PathSettingsProps = {
    awakened: Awakened;
    setAwakened: (awakened: Awakened) => void;
    path: PathName;
}

const PathSettings = ({ awakened, setAwakened, path }: PathSettingsProps) => {
    const attributes = { ...awakened.attributes };
    const updatedArcana = awakened.arcana;
    const rotes: RoteRef[] = [];
  
    const rulingArcana = Paths[path].rulingArcana;
    const inferiorArcana = Paths[path].inferiorArcana;
  
    Object.keys(updatedArcana).forEach((a: string) => {
      const lowercaseA = a as keyof typeof updatedArcana;
      updatedArcana[lowercaseA] = {
        type: "Common",
        creationPoints: 0,
        freebiePoints: 0,
        experiencePoints: 0,
      };
    });
  
    rulingArcana.forEach((arcanaName: string) => {
      const lowercaseArcana = arcanaName as keyof typeof updatedArcana;
      updatedArcana[lowercaseArcana] = {
        type: "Ruling",
        creationPoints: 0,
        freebiePoints: 0,
        experiencePoints: 0,
      };
    });
  
    const lowercaseInferiorArcana = inferiorArcana as keyof typeof updatedArcana;
    updatedArcana[lowercaseInferiorArcana] = {
      type: "Inferior",
      creationPoints: 0,
      freebiePoints: 0,
      experiencePoints: 0,
    };
  
    const composureIncrement = Paths[path].resistanceAttribute === "Composure" ? 1 : 0;
    const resolveIncrement = Paths[path].resistanceAttribute === "Resolve" ? 1 : 0;
  
    attributes["resolve"].freebiePoints = resolveIncrement;
    attributes["composure"].freebiePoints = composureIncrement;
  
    setAwakened({ ...awakened, arcana: updatedArcana})
  
    setAwakened({ ...awakened, attributes, rotes });
  };

export default PathSettings