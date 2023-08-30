import { Awakened } from "../../../../data/TatteredVeil/types/Awakened"
import { OrderName, Orders } from "../../../../data/TatteredVeil/types/Order"
import { SkillsKey } from "../../../../data/nWoD1e/nWoD1eSkills";

type OrderSettingsProps = {
    awakened: Awakened;
    setAwakened: (awakened: Awakened) => void;
    order: OrderName;
}

    const OrderSettings = ({ awakened, setAwakened, order }: OrderSettingsProps) => {
      const skills = { ...awakened.skills };
    
      const roteSpecialities = Orders[order].roteSpecialities;
      Object.entries(skills).forEach(([,skill]) => {
        skill.roteSkill = false;
      });
        // adds rote specialies based on the roteSpecialities list in the Orders types
        roteSpecialities.forEach((specialityName: string) => {
          const lowercaseSpecial = specialityName.toLowerCase() as SkillsKey;
          skills[lowercaseSpecial].roteSkill = true;
      })
    
      setAwakened({ ...awakened, skills: skills });
    };
    
    export default OrderSettings;