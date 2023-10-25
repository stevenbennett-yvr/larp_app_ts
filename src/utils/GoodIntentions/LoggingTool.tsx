import { Kindred } from "../../data/GoodIntentions/types/Kindred";
import { V5AttributesKey, v5AttributeLevel } from "../../data/GoodIntentions/types/V5Attributes";
import { v5BloodPotencyLevel } from "../../data/GoodIntentions/types/V5BloodPotency";
import { DisciplineKey, v5DisciplineLevel } from "../../data/GoodIntentions/types/V5Disciplines";
import { V5SkillsKey, v5SkillLevel } from "../../data/GoodIntentions/types/V5Skills";

const changeLog = (initialKindred: Kindred, kindred: Kindred): any[] => {
    const changes: Array<{ field: string; type: string; oldValue?: number; newValue?: number }> = [];

    function compareItem(initialItem: any, currentItem: any, key: string) {
        if (initialItem.creationPoints !== currentItem.creationPoints) {
            changes.push({
                field: key,
                type: "Creation Points",
                oldValue: initialItem.creationPoints,
                newValue: currentItem.creationPoints,
            });
        }
        if (initialItem.experiencePoints !== currentItem.experiencePoints) {
            changes.push({
                field: key,
                type: "Experience Points",
                oldValue: initialItem.experiencePoints,
                newValue: currentItem.experiencePoints,
            });
        }
        if (initialItem.freebiePoints !== currentItem.freebiePoints) {
            changes.push({
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
            let level = 0
            if (type === "attributes") {
                let attributeKey = attribute as V5AttributesKey
                level = v5AttributeLevel(kindred, attributeKey).level
                key = `Attribute ${attributeKey} Level ${level}`
            }
            if (type === "skills") {
                let skillKey = attribute as V5SkillsKey
                level = v5SkillLevel(kindred, skillKey).level
                key = `Skill ${skillKey} Level ${level}`

            }
            if (type === "disciplines") {
                let discKey = attribute as DisciplineKey
                level = v5DisciplineLevel(kindred, discKey).level
                key = `Discipline ${discKey} Level ${level}`

            }
            compareItem(initialAttributes[attribute], currentAttributes[attribute], key)
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

    function compareArraysOfObjects(initialArray: any, currentArray: any) {

        initialArray.forEach((initialItem: any) => {
            const currentItem = currentArray.find((item: any) => item.id === initialItem.id);

            if (initialItem.creationPoints !== currentItem.creationPoints) {
                changes.push({
                    field: initialItem.name,
                    type: "Creation Points",
                    oldValue: initialItem.creationPoints,
                    newValue: currentItem.creationPoints,
                });
            } else if (initialItem.experiencePoints !== currentItem.experiencePoints) {
                changes.push({
                    field: initialItem.name,
                    type: "Experience Points",
                    oldValue: initialItem.experiencePoints,
                    newValue: currentItem.experiencePoints,
                });
            } else if (initialItem.freebiePoints !== currentItem.freebiePoints) {
                changes.push({
                    field: initialItem.name,
                    type: "Freebie Points",
                    oldValue: initialItem.freebiePoints,
                    newValue: currentItem.freebiePoints,
                });
            } else if (initialItem.havenPoints !== currentItem.havenPoints) {
                changes.push({
                    field: initialItem.name,
                    type: "Haven Points",
                    oldValue: initialItem.havenPoints,
                    newValue: currentItem.havenPoints,
                });
            } else {
                changes.push({
                    field: initialItem.name,
                    type: "Removed",
                });
            }
        });

        currentArray.forEach((currentItem: any) => {
            const initialItem = initialArray.find((item: any) => item.id === currentItem.id);

            if (!initialItem) {
                // Item is newly added in the current array
                if (currentItem.creationPoints > 0) {
                    changes.push({
                        field: currentItem.name,
                        type: "Creation Points",
                        oldValue: 0,
                        newValue: currentItem.creationPoints
                    });
                }
                else if (currentItem.freebiePoints > 0) {
                    changes.push({
                        field: currentItem.name,
                        type: "Freebie Points",
                        oldValue: 0,
                        newValue: currentItem.freebiePoints
                    });
                }
                else if (currentItem.experiencePoints > 0) {
                    changes.push({
                        field: currentItem.name,
                        type: "Experience Points",
                        oldValue: 0,
                        newValue: currentItem.experiencePoints
                    });
                } else if (currentItem.havenPoint > 0) {
                    changes.push({
                        field: currentItem.name,
                        type: "Haven Points",
                        oldValue: 0,
                        newValue: currentItem.havenPoints
                    });
                } else {
                    changes.push({
                        field: currentItem.name,
                        type: "Added",
                    });
                }
            }
        });
    }

    compareArraysOfObjects(initialKindred.powers, kindred.powers)
    compareArraysOfObjects(initialKindred.rituals, kindred.rituals);
    compareArraysOfObjects(initialKindred.ceremonies, kindred.ceremonies);
    compareArraysOfObjects(initialKindred.formulae, kindred.formulae);
    compareArraysOfObjects(initialKindred.backgrounds, kindred.backgrounds);
    compareArraysOfObjects(initialKindred.loresheet.benefits, kindred.loresheet.benefits)
    compareArraysOfObjects(initialKindred.meritsFlaws, kindred.meritsFlaws);

    if (initialKindred.bloodPotency !== kindred.bloodPotency) {
        let level = v5BloodPotencyLevel(kindred).level
        compareItem(initialKindred.bloodPotency, kindred.bloodPotency, `Bloot Potency ${level}`)
    }

    return changes

}

export default changeLog