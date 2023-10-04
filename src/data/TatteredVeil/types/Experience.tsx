import { Awakened } from "./Awakened";

const getChronicleStartDate = () => {
    return new Date(2023, 6, 1); // July 1st, 2023
};

const getStartDate = (awakened: Awakened) => {
    const creationDate = new Date(awakened.startDate);

    const chronicleStartDate = getChronicleStartDate();
    const awakenedStartDate = creationDate < chronicleStartDate ? chronicleStartDate : creationDate;

    return new Date(awakenedStartDate).toISOString();
}

export const calculateMaxXp = () => {
    const chronicleStart = getChronicleStartDate();
    const currentDate = new Date();
    const monthsSinceStart = (currentDate.getFullYear() - chronicleStart.getFullYear()) * 12 + (currentDate.getMonth() - chronicleStart.getMonth());
    const maxXp = monthsSinceStart * 4;
    return maxXp < 0 ? 0 : maxXp;
};

export const calculateEarnedXp = (awakened: Awakened) => {
    const startDate = new Date(getStartDate(awakened));
    const currentDate = new Date();
    const monthsSinceStart = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth());
    const earnedXp = monthsSinceStart * 6;
    return earnedXp < 0 ? 0 : Math.min(earnedXp, calculateMaxXp());
};

export const calculateFloorXp = () => {
    const startDate = getChronicleStartDate();
    const currentDate = new Date();
    const monthsSinceStart = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth());
    const floorXp = monthsSinceStart * 2;
    return floorXp < 0 ? 0 : floorXp;
};

export const totalExperience = (awakened: Awakened) => {
    const total = 50 + calculateFloorXp() + calculateEarnedXp(awakened)
    const ceiling = 50 + calculateMaxXp()
    return Math.min(total, ceiling)
};

export const attributeExperience = (awakened: Awakened): number => {
    let attributeXp = 0;
    Object.entries(awakened.attributes).map(([, attributeInfo]) => {
        attributeXp += attributeInfo.experiencePoints;
        return null;
    });
    return attributeXp;
};


export const skillExperience = (awakened: Awakened): number => {
    let skillXp = 0;
    Object.entries(awakened.skills).map(([, skillInfo]) => {
        skillXp += skillInfo.experiencePoints;
        return null; // Explicit return statement (can return any value, even null)
    });
    return skillXp;
};

export const specialityExperience = (awakened: Awakened): number => {
    let specialityXp = 0;
    Object.entries(awakened.skills).map(([, skillInfo]) => {
        skillInfo.specialities.forEach((speciality) =>
            specialityXp += speciality.experiencePoints
        )
        return null;
    });
    return specialityXp;
};


export const arcanaExperience = (awakened: Awakened) => {
    let arcanaXp = 0
    Object.entries(awakened.arcana).map(([, arcanumInfo]) => {
        arcanaXp += arcanumInfo.experiencePoints
    })
    return arcanaXp
}

export const roteExperience = (awakened: Awakened) => {
    let roteXp = 0
    awakened.rotes.forEach((rote) => {
        roteXp += rote.experiencePoints
    })
    return roteXp
}

export const meritExperience = (awakened: Awakened) => {
    let meritXp = 0
    awakened.merits.forEach((merit) => {
        meritXp += merit.experiencePoints
    })
    return meritXp
}

const gnosisExperience = (awakened: Awakened) => {
    let gnosisXp = awakened.gnosis.experiencePoints
    return gnosisXp
}

const wisdomExperience = (awakened: Awakened) => {
    let wisdomXp = awakened.wisdom.experiencePoints
    return wisdomXp
}


export const spentExperience = (awakened: Awakened) => {
    const attributeXp = attributeExperience(awakened);
    const skillXp = skillExperience(awakened);
    const specialityXp = specialityExperience(awakened);
    const arcanaXp = arcanaExperience(awakened);
    const meritXp = meritExperience(awakened);
    const gnosisXp = gnosisExperience(awakened);
    const wisdomXp = wisdomExperience(awakened);
    const roteXp = roteExperience(awakened);

    const spentExperience = (attributeXp + skillXp + specialityXp + arcanaXp + meritXp + gnosisXp + wisdomXp + roteXp);
    return spentExperience;
};

export const currentExperience = (awakened: Awakened) => {
    const experience = totalExperience(awakened);

    const currentExperience = experience - (spentExperience(awakened));
    return currentExperience;
};