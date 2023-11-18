import { Kindred } from "../../data/GoodIntentions/types/Kindred";
import { V5AttributesKey } from "../../data/GoodIntentions/types/V5Attributes";
import { DisciplineKey } from "../../data/GoodIntentions/types/V5Disciplines";
import { V5SkillsKey } from "../../data/GoodIntentions/types/V5Skills";

const changeLog = (initialKindred: Kindred, kindred: Kindred): any[] => {
    const changes: Array<{ category:string; field: string; type: string; oldValue?: number; newValue?: number }> = [];

    function compareItem(initialItem: any, currentItem: any, category:string, key: string) {
        if (initialItem.creationPoints !== currentItem.creationPoints) {
            changes.push({
                category:category,
                field: key,
                type: "Creation Points",
                oldValue: initialItem.creationPoints,
                newValue: currentItem.creationPoints,
            });
        }
        if (initialItem.experiencePoints !== currentItem.experiencePoints) {
            changes.push({
                category:category,
                field: key,
                type: "Experience Points",
                oldValue: initialItem.experiencePoints,
                newValue: currentItem.experiencePoints,
            });
        }
        if (initialItem.freebiePoints !== currentItem.freebiePoints) {
            changes.push({
                category:category,
                field: key,
                type: "Freebie Points",
                oldValue: initialItem.freebiePoints,
                newValue: currentItem.freebiePoints,
            });
        }
    }

    function compareAttributes(initialAttributes: any, currentAttributes: any, type: string) {
        for (const attribute in initialAttributes) {
            let key = ""
            if (type === "attributes") {
                let attributeKey = attribute as V5AttributesKey
                key = `${attributeKey}`
            }
            if (type === "skills") {
                let skillKey = attribute as V5SkillsKey
                key = `${skillKey}`

            }
            if (type === "disciplines") {
                let discKey = attribute as DisciplineKey
                key = `${discKey}`

            }
            compareItem(initialAttributes[attribute], currentAttributes[attribute], type, key)
        }
    }

    const initialAttributes = initialKindred.attributes as any;
    const currentAttributes = kindred.attributes as any;

    if (initialAttributes !== currentAttributes) {
        compareAttributes(initialAttributes, currentAttributes, "attributes");
    }

    // Repeat for Skills and Disciplines
    const initialSkills = initialKindred.skills as any;
    const currentSkills = kindred.skills as any;

    if (initialSkills !== currentSkills) {
        compareAttributes(initialSkills, currentSkills, "skills");
    }

    const initialDisciplines = initialKindred.disciplines as any;
    const currentDisciplines = kindred.disciplines as any;

    if (initialDisciplines !== currentDisciplines) {
        compareAttributes(initialDisciplines, currentDisciplines, "disciplines");
    }

    function compareArraysOfObjectsByName(initialArray: any, currentArray: any, category: string) {
        if (initialArray === currentArray) { return null }
        initialArray.forEach((initialItem: any) => {
            let currentItem = currentArray.find((item: any) => item.name === initialItem.name);
            if (!currentItem || !initialItem) { return null }
            if (initialItem.creationPoints !== currentItem.creationPoints) {
                changes.push({
                    category:category,
                    field: initialItem.name,
                    type: "Creation Points",
                    oldValue: initialItem.creationPoints,
                    newValue: currentItem.creationPoints,
                });
            } if (initialItem.experiencePoints !== currentItem.experiencePoints) {
                changes.push({
                    category:category,
                    field: initialItem.name,
                    type: "Experience Points",
                    oldValue: initialItem.experiencePoints,
                    newValue: currentItem.experiencePoints,
                });
            } if (initialItem.freebiePoints !== currentItem.freebiePoints) {
                changes.push({
                    category:category,
                    field: initialItem.name,
                    type: "Freebie Points",
                    oldValue: initialItem.freebiePoints,
                    newValue: currentItem.freebiePoints,
                });
            } if (initialItem.havenPoints !== currentItem.havenPoints) {
                changes.push({
                    category:category,
                    field: initialItem.name,
                    type: "Haven Points",
                    oldValue: initialItem.havenPoints,
                    newValue: currentItem.havenPoints,
                });
            } if (initialItem.predatorTypeFreebiePoints !== currentItem.predatorTypeFreebiePoints) {
                changes.push({
                    category:category,
                    field: initialItem.name,
                    type: "Predator Type Freebie Points",
                    oldValue: initialItem.predatorTypeFreebiePoints,
                    newValue: currentItem.predatorTypeFreebiePoints,
                });
            } if (initialItem.loresheetFreebiePoints !== currentItem.loresheetFreebiePoints) {
                changes.push({
                    category:category,
                    field: initialItem.name,
                    type: "Lore Sheet Freebie Points",
                    oldValue: initialItem.loresheetFreebiePoints,
                    newValue: currentItem.loresheetFreebiePoints,
                });
            }
            if (initialItem.advantages !== currentItem.advantages) {
                compareArraysOfObjectsByName(initialItem.advantages, currentItem.advantages, `advantages`)
            }
        });

        currentArray.forEach((currentItem: any) => {
            const initialItem = initialArray.find((item: any) => item.name === currentItem.name);
            if (!initialItem) {
                // Item is newly added in the current array
                if (currentItem.creationPoints > 0) {
                    changes.push({
                        category:category,
                        field: currentItem.name,
                        type: "Creation Points",
                        oldValue: 0,
                        newValue: currentItem.creationPoints
                    });
                }
                 if (currentItem.freebiePoints > 0) {
                    changes.push({
                        category:category,
                        field: currentItem.name,
                        type: "Freebie Points",
                        oldValue: 0,
                        newValue: currentItem.freebiePoints
                    });
                }
                 if (currentItem.experiencePoints > 0) {
                    changes.push({
                        category:category,
                        field: currentItem.name,
                        type: "Experience Points",
                        oldValue: 0,
                        newValue: currentItem.experiencePoints
                    });
                }  if (currentItem.havenPoint > 0) {
                    changes.push({
                        category:category,
                        field: currentItem.name,
                        type: "Haven Points",
                        oldValue: 0,
                        newValue: currentItem.havenPoints
                    });
                } if (currentItem.loresheetFreebiePoints > 0) {
                    changes.push({
                        category:category,
                        field: currentItem.name,
                        type: "Lore Sheet Freebie Points",
                        oldValue: 0,
                        newValue: currentItem.loresheetFreebiePoints
                    });
                    
                } if (currentItem.predatorTypeFreebiePoints > 0) {
                    changes.push({
                        category:category,
                        field: currentItem.name,
                        type: "Predator Type Freebie Points",
                        oldValue: 0,
                        newValue: currentItem.predatorTypeFreebiePoints
                    });
                }
            }
        });
    }

    function compareArraysOfObjects(initialArray: any, currentArray: any, category: string) {
        if (initialArray === currentArray) {return null}
        initialArray.forEach((initialItem: any) => {
            let currentItem = currentArray.find((item: any) => item.id === initialItem.id);
            if (!currentItem || !initialItem) { return null }
            if (initialItem.creationPoints !== currentItem.creationPoints) {
                changes.push({
                    category:category,
                    field: initialItem.name,
                    type: "Creation Points",
                    oldValue: initialItem.creationPoints,
                    newValue: currentItem.creationPoints,
                });
            } if (initialItem.experiencePoints !== currentItem.experiencePoints) {
                changes.push({
                    category:category,
                    field: initialItem.name,
                    type: "Experience Points",
                    oldValue: initialItem.experiencePoints,
                    newValue: currentItem.experiencePoints,
                });
            } if (initialItem.freebiePoints !== currentItem.freebiePoints) {
                changes.push({
                    category:category,
                    field: initialItem.name,
                    type: "Freebie Points",
                    oldValue: initialItem.freebiePoints,
                    newValue: currentItem.freebiePoints,
                });
            } if (initialItem.havenPoints !== currentItem.havenPoints) {
                changes.push({
                    category:category,
                    field: initialItem.name,
                    type: "Haven Points",
                    oldValue: initialItem.havenPoints,
                    newValue: currentItem.havenPoints,
                });
            } if (initialItem.predatorTypeFreebiePoints !== currentItem.predatorTypeFreebiePoints) {
                changes.push({
                    category:category,
                    field: initialItem.name,
                    type: "Predator Type Freebie Points",
                    oldValue: initialItem.predatorTypeFreebiePoints,
                    newValue: currentItem.predatorTypeFreebiePoints,
                });
            } if (initialItem.loresheetFreebiePoints !== currentItem.loresheetFreebiePoints) {
                changes.push({
                    category:category,
                    field: initialItem.name,
                    type: "Lore Sheet Freebie Points",
                    oldValue: initialItem.loresheetFreebiePoints,
                    newValue: currentItem.loresheetFreebiePoints,
                });
            }
            if (initialItem.advantages !== currentItem.advantages) {
                compareArraysOfObjectsByName(initialItem.advantages, currentItem.advantages, `advantages`)
            }
        });

        currentArray.forEach((currentItem: any) => {
            const initialItem = initialArray.find((item: any) => item.id === currentItem.id);
            if (!initialItem) {
                // Item is newly added in the current array
                if (currentItem.creationPoints > 0) {
                    changes.push({
                        category:category,
                        field: currentItem.name,
                        type: "Creation Points",
                        oldValue: 0,
                        newValue: currentItem.creationPoints
                    });
                }
                 if (currentItem.freebiePoints > 0) {
                    changes.push({
                        category:category,
                        field: currentItem.name,
                        type: "Freebie Points",
                        oldValue: 0,
                        newValue: currentItem.freebiePoints
                    });
                }
                 if (currentItem.experiencePoints > 0) {
                    changes.push({
                        category:category,
                        field: currentItem.name,
                        type: "Experience Points",
                        oldValue: 0,
                        newValue: currentItem.experiencePoints
                    });
                }  if (currentItem.havenPoint > 0) {
                    changes.push({
                        category:category,
                        field: currentItem.name,
                        type: "Haven Points",
                        oldValue: 0,
                        newValue: currentItem.havenPoints
                    });
                } if (currentItem.loresheetFreebiePoints > 0) {
                    changes.push({
                        category:category,
                        field: currentItem.name,
                        type: "Lore Sheet Freebie Points",
                        oldValue: 0,
                        newValue: currentItem.loresheetFreebiePoints
                    });
                    
                } if (currentItem.predatorTypeFreebiePoints > 0) {
                    changes.push({
                        category:category,
                        field: currentItem.name,
                        type: "Predator Type Freebie Points",
                        oldValue: 0,
                        newValue: currentItem.predatorTypeFreebiePoints
                    });
                }
                if (currentItem.advantages) {
                    compareArraysOfObjectsByName([], currentItem.advantages, `advantages`)
                }
            }
        });
    }

    compareArraysOfObjectsByName(initialKindred.powers, kindred.powers, "Powers")
    compareArraysOfObjects(initialKindred.rituals, kindred.rituals, "Rituals");
    compareArraysOfObjects(initialKindred.ceremonies, kindred.ceremonies, "Ceremonies");
    compareArraysOfObjects(initialKindred.formulae, kindred.formulae, "Formulae");
    compareArraysOfObjects(initialKindred.backgrounds, kindred.backgrounds, "Backgrounds");
    compareArraysOfObjects(initialKindred.coterie.territoryContributions, kindred.coterie.territoryContributions, "Territory");
    compareArraysOfObjectsByName(initialKindred.loresheet.benefits, kindred.loresheet.benefits, `${kindred.loresheet.name} Benefit`)
    compareArraysOfObjects(initialKindred.meritsFlaws, kindred.meritsFlaws, "Merits and Flaws");

    if (initialKindred.bloodPotency !== kindred.bloodPotency) {
        compareItem(initialKindred.bloodPotency, kindred.bloodPotency, `Kindred Base`, `Blood Potency`)
    }

    return changes

}

export default changeLog