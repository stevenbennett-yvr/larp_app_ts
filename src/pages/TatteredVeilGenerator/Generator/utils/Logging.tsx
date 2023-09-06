import { Awakened } from "../../../../data/TatteredVeil/types/Awakened";

export const logChanges = (initialAwakened: Awakened, awakened: Awakened): any[] => {
  const changes = [];

  // Compare properties and log changes
  if (initialAwakened.name !== awakened.name) {
    changes.push({
      field: "name",
      type: "string",
      oldValue: initialAwakened.name,
      newValue: awakened.name,
    });
  }



  // Compare attributes

  const initialAttributes = initialAwakened.attributes as any;
  const currentAttributes = awakened.attributes as any;
  
  if (initialAttributes !== currentAttributes) {

    for (const attribute in initialAttributes) {
      if (initialAttributes[attribute].creationPoints !== currentAttributes[attribute].creationPoints) {
        changes.push({
          field: `${attribute}`,
          type: "Creation Points",
          oldValue: initialAttributes[attribute].creationPoints,
          newValue: currentAttributes[attribute].creationPoints,
        })
      }
      if (initialAttributes[attribute].experiencePoints !== currentAttributes[attribute].experiencePoints) {
        changes.push({
          field: `${attribute}`,
          type: "Experience Points",
          oldValue: initialAttributes[attribute].experiencePoints,
          newValue: currentAttributes[attribute].experiencePoints,
        })
      }
      if (initialAttributes[attribute].freebiePoints !== currentAttributes[attribute].freebiePoints) {
        changes.push({
          field: `${attribute}`,
          type: "Freebie Points",
          oldValue: initialAttributes[attribute].freebiePoints,
          newValue: currentAttributes[attribute].freebiePoints,
        })
      }
    }
  }

  // Compare Skills

  const initialSkills = initialAwakened.skills as any;
  const currentSkills = awakened.skills as any;
  console.log(initialSkills)

  if (initialSkills !== currentSkills) {
    
    for (const skill in initialSkills) {
      if (initialSkills[skill].creationPoints !== currentSkills[skill].creationPoints) {
        changes.push({
          field: `${skill}`,
          type: "Creation Points",
          oldValue: initialSkills[skill].creationPoints,
          newValue: currentSkills[skill].creationPoints,
        })
      }
      if (initialSkills[skill].experiencePoints !== currentSkills[skill].experiencePoints) {
        changes.push({
          field: `${skill}`,
          type: "Experience Points",
          oldValue: initialSkills[skill].experiencePoints,
          newValue: currentSkills[skill].experiencePoints,
        })
      }
      if (initialSkills[skill].freebiePoints !== currentSkills[skill].freebiePoints) {
        changes.push({
          field: `${skill}`,
          type: "Freebie Points",
          oldValue: initialSkills[skill].freebiePoints,
          newValue: currentSkills[skill].freebiePoints,
        })
      }

      const initialSpecialities = initialSkills[skill].specialities
      const currentSpecialties = currentSkills[skill].specialities

      for (let i = 0; i < Math.max(initialSpecialities.length, currentSpecialties.length); i++) {
        if (i >= initialSpecialities.length) {
          if (currentSpecialties[i].experiencePoints !== 0) {
            changes.push({
              field: `${skill}.speciality[${currentSpecialties[i].name}]`,
              type: "Experience Points",
              oldValue: 0,
              newValue: currentSpecialties[i].experiencePoints,
            })
          }
          if (currentSpecialties[i].freebiePoints !== 0) {
            changes.push({
              field: `${skill}.speciality[${currentSpecialties[i].name}]`,
              type: "Freebie Points",
              oldValue: 0,
              newValue: currentSpecialties[i].freebiePoints,
            })
          }
          if (currentSpecialties[i].creationPoints !== 0) {
            changes.push({
              field: `${skill}.speciality[${currentSpecialties[i].name}]`,
              type: "Creation Points",
              newValue: 0,
              oldValue: currentSpecialties[i].creationPoints,
            })
          }
        } else if (i >= currentSpecialties.length) {
          if (initialSpecialities[i].experiencePoints !== 0) {
            changes.push({
              field: `${skill}.speciality[${initialSpecialities[i].name}]`,
              type: "Experience Points",
              newValue: initialSpecialities[i].experiencePoints,
              oldValue: 0,
            })
          }
          if (initialSpecialities[i].freebiePoints !== 0) {
            changes.push({
              field: `${skill}.speciality[${initialSpecialities[i].name}]`,
              type: "Freebie Points",
              newValue: initialSpecialities[i].freebiePoints,
              oldValue: 0,
            })
          }
          if (initialSpecialities[i].creationPoints !== 0) {
            changes.push({
              field: `${skill}.speciality[${initialSpecialities[i].name}]`,
              type: "Creation Points",
              newValue: initialSpecialities[i].creationPoints,
              oldValue: 0,
            })
          }
        }
      }
    }
  }

  const initialArcana = initialAwakened.arcana as any
  const currentArcana = awakened.arcana as any

  if (initialArcana !== currentArcana) {
    for (const arcanum in initialArcana) {
      if (initialArcana[arcanum].creationPoints !== currentArcana[arcanum].creationPoints) {
        changes.push({
          field: `${arcanum}`,
          type: "Creation Points",
          oldValue: initialArcana[arcanum].creationPoints,
          newValue: currentArcana[arcanum].creationPoints,
        })
      }
      if (initialArcana[arcanum].experiencePoints !== currentArcana[arcanum].experiencePoints) {
        changes.push({
          field: `${arcanum}`,
          type: "Experience Points",
          oldValue: initialArcana[arcanum].experiencePoints,
          newValue: currentArcana[arcanum].experiencePoints,
        })
      }
      if (initialArcana[arcanum].freebiePoints !== currentArcana[arcanum].freebiePoints) {
        changes.push({
          field: `${arcanum}`,
          type: "Freebie Points",
          oldValue: initialArcana[arcanum].freebiePoints,
          newValue: currentArcana[arcanum].freebiePoints,
        })
      }
    }
  }

  const initialRotes = initialAwakened.rotes as any;
  const currentRotes = awakened.rotes as any;
  
  for (const currentRote of currentRotes) {
    const initialRote = initialRotes.find((rote: any) => rote.name === currentRote.name);
  
    if (!initialRote) {

    if (currentRote.creationPoints > 0) {
      changes.push({
        field: `rote[${currentRote.name}]`,
        type: "Creation Points",
        oldValue: 0,
        newValue: currentRote.creationPoints,
      });
    } else if (currentRote.experiencePoints > 0) {
      changes.push({
        field: `rote[${currentRote.name}]`,
        type: "Experience Points",
        oldValue: 0,
        newValue: currentRote.experiencePoints,
      });
    } else if (currentRote.freebiePoints > 0) {
      changes.push({
        field: `rote[${currentRote.name}]`,
        type: "Freebie Points",
        oldValue: 0,
        newValue: currentRote.freebiePoints,
      });
    }
  }
  }
  
  for (const initialRote of initialRotes) {
    const currentRote = currentRotes.find((rote: any) => rote.name === initialRote.name);
  
    if (!currentRote) {

      // Rote removed
      if (initialRote.creationPoints > 0) {
        changes.push({
          field: `rote[${initialRote.name}]`,
          type: "Creation Points",
          oldValue: initialRote.creationPoints,
          newValue: 0,
        });
      } else if (initialRote.experiencePoints > 0) {
        changes.push({
          field: `rote[${initialRote.name}]`,
          type: "Experience Points",
          oldValue: initialRote.experiencePoints,
          newValue: 0,
        });
      } else if (initialRote.freebiePoints > 0) {
        changes.push({
          field: `rote[${initialRote.name}]`,
          type: "Freebie Points",
          oldValue: initialRote.freebiePoints,
          newValue: 0,
        });
      }
    }
  }

  const initialMerits = initialAwakened.merits as any
  const currentMerits = awakened.merits as any

  for (const currentMerit of currentMerits) {

    const initialMerit = initialMerits.find((merit: any) => merit.name === currentMerit.name);
  
    if (!initialMerit) {

    if (currentMerit.creationPoints > 0) {
      changes.push({
        field: `merit[${currentMerit.name}]`,
        type: "Creation Points",
        oldValue: 0,
        newValue: currentMerit.creationPoints,
      });
    } else if (currentMerit.experiencePoints > 0) {
      changes.push({
        field: `merit[${currentMerit.name}]`,
        type: "Experience Points",
        oldValue: 0,
        newValue: currentMerit.experiencePoints,
      });
    } else if (currentMerit.freebiePoints > 0) {
      changes.push({
        field: `merit[${currentMerit.name}]`,
        type: "Freebie Points",
        oldValue: 0,
        newValue: currentMerit.freebiePoints,
      });
    }
  } else {
    if (currentMerit.creationPoints > initialMerit.creationPoints) {
      changes.push({
        field: `merit[${currentMerit.name}]`,
        type: "Creation Points",
        oldValue: initialMerit.creationPoints,
        newValue: currentMerit.creationPoints,
      });
    } else if (currentMerit.experiencePoints > initialMerit.experiencePoints) {
      changes.push({
        field: `merit[${currentMerit.name}]`,
        type: "Experience Points",
        oldValue: initialMerit.experiencePoints,
        newValue: currentMerit.experiencePoints,
      });
    } else if (currentMerit.freebiePoints > initialMerit.freebiePoints) {
      changes.push({
        field: `merit[${currentMerit.name}]`,
        type: "Freebie Points",
        oldValue: initialMerit.freebiePoints,
        newValue: currentMerit.freebiePoints,
      });
    }
  }

  }
  
  for (const initialMerit of initialMerits) {
    const currentMerit = currentMerits.find((merit: any) => merit.name === initialMerit.name);
  
    if (!currentMerit) {
      // Rote removed
      if (initialMerit.creationPoints > 0) {
        changes.push({
          field: `rote[${initialMerit.name}]`,
          type: "Creation Points",
          oldValue: initialMerit.creationPoints,
          newValue: 0,
        });
      } else if (initialMerit.experiencePoints > 0) {
        changes.push({
          field: `rote[${initialMerit.name}]`,
          type: "Experience Points",
          oldValue: initialMerit.experiencePoints,
          newValue: 0,
        });
      } else if (initialMerit.freebiePoints > 0) {
        changes.push({
          field: `rote[${initialMerit.name}]`,
          type: "Freebie Points",
          oldValue: initialMerit.freebiePoints,
          newValue: 0,
        });
      }
    } else {
      if (initialMerit.creationPoints > currentMerit.creationPoints) {
        changes.push({
          field: `rote[${initialMerit.name}]`,
          type: "Creation Points",
          oldValue: initialMerit.creationPoints,
          newValue: currentMerit.creationPoints,
        });
      } else if (initialMerit.experiencePoints > currentMerit.experiencePoints) {
        changes.push({
          field: `rote[${initialMerit.name}]`,
          type: "Experience Points",
          oldValue: initialMerit.experiencePoints,
          newValue: currentMerit.experiencePoints,
        });
      } else if (initialMerit.freebiePoints > currentMerit.freeibePoints) {
        changes.push({
          field: `rote[${initialMerit.name}]`,
          type: "Freebie Points",
          oldValue: initialMerit.freebiePoints,
          newValue: currentMerit.freeibePoints,
        });
      }
    }
  }

  const initialGnosis = initialAwakened.gnosis
  const currentGnosis = awakened.gnosis

  if (initialGnosis !== currentGnosis) {
    if (initialGnosis.experiencePoints !== currentGnosis.experiencePoints) {
      changes.push({
        field: `gnosis`,
        type: "Experience Points",
        oldValue: initialGnosis.experiencePoints,
        newValue: currentGnosis.experiencePoints,
      })
    }
    if (initialGnosis.creationPoints !== currentGnosis.creationPoints) {
      changes.push({
        field: `gnosis`,
        type: "Creation Points",
        oldValue: initialGnosis.creationPoints,
        newValue: currentGnosis.creationPoints,
      })
    }
    if (initialGnosis.freebiePoints !== currentGnosis.freebiePoints) {
      changes.push({
        field: `gnosis`,
        type: "Freebie Points",
        oldValue: initialGnosis.freebiePoints,
        newValue: currentGnosis.freebiePoints,
      })
    }
  }

  const initialWisdom = initialAwakened.wisdom
  const currentWisdom = awakened.wisdom

  if (initialWisdom !== currentWisdom) {
    if (initialWisdom.experiencePoints !== currentWisdom.experiencePoints) {
      changes.push({
        field: `wisdom`,
        type: "Experience Points",
        oldValue: initialWisdom.experiencePoints,
        newValue: currentWisdom.experiencePoints,
      })
    }
    if (initialWisdom.creationPoints !== currentWisdom.creationPoints) {
      changes.push({
        field: `wisdom`,
        type: "Creation Points",
        oldValue: initialWisdom.creationPoints,
        newValue: currentWisdom.creationPoints,
      })
    }
    if (initialWisdom.freebiePoints !== currentWisdom.freebiePoints) {
      changes.push({
        field: `wisdom`,
        type: "Freebie Points",
        oldValue: initialWisdom.freebiePoints,
        newValue: currentWisdom.freebiePoints,
      })
    }
  }

  return changes;
}