import { Awakened } from "../../data/Awakened"
import { OrderName, Orders } from "../../data/Order"
import { SkillNames, SkillCategory, Skill, allSkills, getSkillCategory } from "../../data/Skills"

type OrderSettingsProps = {
    awakened: Awakened;
    setAwakened: (awakened: Awakened) => void;
    order: OrderName;
}

    const OrderSettings = ({ awakened, setAwakened, order }: OrderSettingsProps) => {
      const skills = { ...awakened.skills };
    
      const roteSpecialities = Orders[order].roteSpecialities;
      
      if (roteSpecialities.length === 0) {
        allSkills.forEach((selectSkill) => {
          // if apostate or without order, removes all rote specialities
          const skillCategory: SkillCategory = getSkillCategory(selectSkill);
          const categorySkills = skills[skillCategory as SkillCategory] as { [key in SkillNames]: Skill };
          Object.entries(categorySkills).forEach(([,skill]) => {
            skill.roteSkill = false;
          });
        })
      } else {
        // adds rote specialies based on the roteSpecialities list in the Orders types
        roteSpecialities.forEach((specialityName: string) => {
          const lowercaseSpecial = specialityName.toLowerCase() as SkillNames;
          const skillCategory: SkillCategory = getSkillCategory(lowercaseSpecial);
    
          const categorySkills = skills[skillCategory as SkillCategory] as { [key in SkillNames]: Skill };
    
          Object.entries(categorySkills).forEach(([skillName, skill]) => {
            if (skillName !== lowercaseSpecial) {
              skill.roteSkill = false;
            }
          });
    
          categorySkills[lowercaseSpecial].roteSkill = true;
        });
      }
    
      setAwakened({ ...awakened, skills: skills });
    };
    
    export default OrderSettings;