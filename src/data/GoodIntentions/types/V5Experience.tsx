import { Kindred } from "./Kindred";

const getChronicleStartDate = () => {
    return new Date(2023, 9, 1); // July 1st, 2023
}

const getCreationDate = (kindred: Kindred) => {
    const creationDate = new Date(kindred.startDate);

    const chronicleStartDate = getChronicleStartDate();
    const awakenedStartDate = creationDate < chronicleStartDate ? chronicleStartDate : creationDate;

    return new Date(awakenedStartDate).toISOString();
}

export const calculateXpCap = () => {
    const chronicleStart = getChronicleStartDate();
    const currentDate = new Date();
    const monthsSinceStart = (currentDate.getFullYear() - chronicleStart.getFullYear()) * 12 + (currentDate.getMonth() - chronicleStart.getMonth());
    const maxXp = monthsSinceStart * 5;
    return maxXp < 0 ? 0 : maxXp;
};

export const calculateFloorXp = () => {
    const startDate = getChronicleStartDate();
    const currentDate = new Date();
    const monthsSinceStart = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth());
    const floorXp = monthsSinceStart * 3;
    return floorXp < 0 ? 0 : floorXp;
}

export const calculateEarnedXp = (kindred: Kindred) => {
    const creationDate = new Date(getCreationDate(kindred));
    const currentDate = new Date();
    const monthsSinceStart = (currentDate.getFullYear() - creationDate.getFullYear()) * 12 + (currentDate.getMonth() - creationDate.getMonth());
    const earnedXp = monthsSinceStart * 7;
    return earnedXp < 0 ? 0 : Math.min(earnedXp, calculateXpCap());
}

export const totalExperience = (kindred: Kindred) => {
    const total = 50 + calculateFloorXp() + calculateEarnedXp(kindred)
    const ceiling = 50 + calculateXpCap()
    return Math.min(total, ceiling)
};



export const attributeExperience = (kindred: Kindred): number => {
    let attributeXp = 0;
    Object.entries(kindred.attributes).map(([, attributeInfo]) => {
        attributeXp += attributeInfo.experiencePoints;
        return null;
    });
    return attributeXp;
};

export const skillExperience = (kindred: Kindred): number => {
    let skillXp = 0;
    Object.entries(kindred.skills).map(([, skillInfo]) => {
        skillXp += skillInfo.experiencePoints;
        return null; // Explicit return statement (can return any value, even null)
    });
    return skillXp;
};

export const disciplineExperience = (kindred: Kindred): number => {
    let disciplineXp = 0;
    Object.entries(kindred.disciplines).map(([, disciplineRef]) => {
        disciplineXp += disciplineRef.experiencePoints;
        return null; // Explicit return statement (can return any value, even null)
    });
    return disciplineXp;
};

export const powerExperience = (kindred: Kindred): number => {
    let powerXp = 0;
    Object.entries(kindred.powers).map(([, power]) => {
        powerXp += power.experiencePoints;
        return null; // Explicit return statement (can return any value, even null)
    });
    return powerXp;
};

export const ritualExperience = (kindred: Kindred): number => {
    let ritualXp = 0;
    Object.entries(kindred.rituals).map(([, ritual]) => {
        ritualXp += ritual.experiencePoints;
        return null; // Explicit return statement (can return any value, even null)
    });
    return ritualXp;
};

export const ceremonyExperience = (kindred: Kindred): number => {
    let ceremonyXp = 0;
    Object.entries(kindred.ceremonies).map(([, ceremony]) => {
        ceremonyXp += ceremony.experiencePoints;
        return null; // Explicit return statement (can return any value, even null)
    });
    return ceremonyXp;
};

export const formulaExperience = (kindred: Kindred): number => {
    let ceremonyXp = 0;
    Object.entries(kindred.formulae).map(([, ceremony]) => {
        ceremonyXp += ceremony.experiencePoints;
        return null; // Explicit return statement (can return any value, even null)
    });
    return ceremonyXp;
};


export const backgroundExperience = (kindred:Kindred): number => {
    let backgroundXp = 0;
    Object.entries(kindred.backgrounds).map(([,background]) => {
        backgroundXp += background.experiencePoints
        Object.entries(background.advantages).map(([,advantageInfo]) => {
            backgroundXp += advantageInfo.experiencePoints
        })
    })
    return backgroundXp
}

export const meritExperience = (kindred:Kindred): number => {
    let meritXp = 0;
    Object.entries(kindred.meritsFlaws).map(([,merit]) => {
        meritXp += merit.experiencePoints
    })
    return meritXp
}

export const bloodPotencyExperience = (kindred:Kindred): number => {
    let bpXp = kindred.bloodPotency.experiencePoints
    return bpXp
}

export const humanityExperience = (kindred:Kindred): number => {
    let hXp = kindred.humanity.experiencePoints
    return hXp
}

export const loresheetExperience  = (kindred:Kindred): number => {
    let lsXp = 0
    kindred.loresheet.benefits.forEach((b) => {
        lsXp += b.experiencePoints
    })
    return lsXp
}

export const spentExperience = (kindred:Kindred) => {
    const attributeXp = attributeExperience(kindred);
    const skillXp = skillExperience(kindred);
    const disciplineXp = disciplineExperience(kindred);
    const powerXp = powerExperience(kindred)
    const ritualXp = ritualExperience(kindred)
    const ceremonyXp = ceremonyExperience(kindred)
    const backgroundXp = backgroundExperience(kindred)
    const meritXp = meritExperience(kindred)
    const bpXp = bloodPotencyExperience(kindred)
    const hXp = humanityExperience(kindred)
    const lsXp = loresheetExperience(kindred)
    const formulaXp = formulaExperience(kindred)

    const spentExperience = (attributeXp + skillXp + disciplineXp + powerXp + ritualXp + ceremonyXp + backgroundXp + meritXp + bpXp + hXp + lsXp + formulaXp);
    return spentExperience;
};

export const remainingExperience = (kindred:Kindred) => {
    const experience = totalExperience(kindred);

    const currentExperience = experience - (spentExperience(kindred));
    return currentExperience;
};