import { Awakened } from "../../data/Awakened";

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
    const initialMentalAttributes = initialAttributes.mental as any;
    const currentMentalAttributes = currentAttributes.mental as any;
    
    for (const attribute in initialMentalAttributes) {
      if (initialMentalAttributes[attribute].creationPoints !== currentMentalAttributes[attribute].creationPoints) {
        changes.push({
          field: `${attribute}`,
          type: "Creation Points",
          oldValue: initialMentalAttributes[attribute].creationPoints,
          newValue: currentMentalAttributes[attribute].creationPoints,
        })
      }
      if (initialMentalAttributes[attribute].experiencePoints !== currentMentalAttributes[attribute].experiencePoints) {
        changes.push({
          field: `${attribute}`,
          type: "Experience Points",
          oldValue: initialMentalAttributes[attribute].experiencePoints,
          newValue: currentMentalAttributes[attribute].experiencePoints,
        })
      }
      if (initialMentalAttributes[attribute].freebiePoints !== currentMentalAttributes[attribute].freebiePoints) {
        changes.push({
          field: `${attribute}`,
          type: "Freebie Points",
          oldValue: initialMentalAttributes[attribute].freebiePoints,
          newValue: currentMentalAttributes[attribute].freebiePoints,
        })
      }
    }

    const initialPhysicalAttributes = initialAttributes.physical as any;
    const currentPhysicalAttributes = currentAttributes.physical as any; 

    for (const attribute in initialPhysicalAttributes) {
      if (initialPhysicalAttributes[attribute].creationPoints !== currentPhysicalAttributes[attribute].creationPoints) {
        changes.push({
          field: `${attribute}`,
          type: "Creation Points",
          oldValue: initialPhysicalAttributes[attribute].creationPoints,
          newValue: currentPhysicalAttributes[attribute].creationPoints,
        })
      }
      if (initialPhysicalAttributes[attribute].experiencePoints !== currentPhysicalAttributes[attribute].experiencePoints) {
        changes.push({
          field: `${attribute}`,
          type: "Experience Points",
          oldValue: initialPhysicalAttributes[attribute].experiencePoints,
          newValue: currentPhysicalAttributes[attribute].experiencePoints,
        })
      }
      if (initialPhysicalAttributes[attribute].freebiePoints !== currentPhysicalAttributes[attribute].freebiePoints) {
        changes.push({
          field: `${attribute}`,
          type: "Freebie Points",
          oldValue: initialPhysicalAttributes[attribute].freebiePoints,
          newValue: currentPhysicalAttributes[attribute].freebiePoints,
        })
      }
    }

    const initialSocialAttributes = initialAttributes.social as any;
    const currentSocialAttributes = currentAttributes.social as any; 

    for (const attribute in initialSocialAttributes) {
      if (initialSocialAttributes[attribute].creationPoints !== currentSocialAttributes[attribute].creationPoints) {
        changes.push({
          field: `${attribute}`,
          type: "Creation Points",
          oldValue: initialSocialAttributes[attribute].creationPoints,
          newValue: currentSocialAttributes[attribute].creationPoints,
        })
      }
      if (initialSocialAttributes[attribute].experiencePoints !== currentSocialAttributes[attribute].experiencePoints) {
        changes.push({
          field: `${attribute}`,
          type: "Experience Points",
          oldValue: initialSocialAttributes[attribute].experiencePoints,
          newValue: currentSocialAttributes[attribute].experiencePoints,
        })
      }
      if (initialSocialAttributes[attribute].freebiePoints !== currentSocialAttributes[attribute].freebiePoints) {
        changes.push({
          field: `${attribute}`,
          type: "Freebie Points",
          oldValue: initialSocialAttributes[attribute].freebiePoints,
          newValue: currentSocialAttributes[attribute].freebiePoints,
        })
      }
    }
  }

  // Compare Skills

  const initialSkills = initialAwakened.skills as any;
  const currentSkills = awakened.skills as any;

  if (initialSkills !== currentSkills) {
    const initialMentalSkills = initialSkills.mental as any;
    const currentMentalSkills = currentSkills.mental as any;
    
    for (const skill in initialMentalSkills) {
      if (initialMentalSkills[skill].creationPoints !== currentMentalSkills[skill].creationPoints) {
        changes.push({
          field: `${skill}`,
          type: "Creation Points",
          oldValue: initialMentalSkills[skill].creationPoints,
          newValue: currentMentalSkills[skill].creationPoints,
        })
      }
      if (initialMentalSkills[skill].experiencePoints !== currentMentalSkills[skill].experiencePoints) {
        changes.push({
          field: `${skill}`,
          type: "Experience Points",
          oldValue: initialMentalSkills[skill].experiencePoints,
          newValue: currentMentalSkills[skill].experiencePoints,
        })
      }
      if (initialMentalSkills[skill].freebiePoints !== currentMentalSkills[skill].freebiePoints) {
        changes.push({
          field: `${skill}`,
          type: "Freebie Points",
          oldValue: initialMentalSkills[skill].freebiePoints,
          newValue: currentMentalSkills[skill].freebiePoints,
        })
      }

      const initialSpecialities = initialMentalSkills[skill].specialities
      const currentSpecialties = currentMentalSkills[skill].specialities

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

    const initialPhysicalSkills = initialSkills.physical as any;
    const currentPhysicalSkills = currentSkills.physical as any; 

    for (const skill in initialPhysicalSkills) {
      if (initialPhysicalSkills[skill].creationPoints !== currentPhysicalSkills[skill].creationPoints) {
        changes.push({
          field: `${skill}`,
          type: "Creation Points",
          oldValue: initialPhysicalSkills[skill].creationPoints,
          newValue: currentPhysicalSkills[skill].creationPoints,
        })
      }
      if (initialPhysicalSkills[skill].experiencePoints !== currentPhysicalSkills[skill].experiencePoints) {
        changes.push({
          field: `${skill}`,
          type: "Experience Points",
          oldValue: initialPhysicalSkills[skill].experiencePoints,
          newValue: currentPhysicalSkills[skill].experiencePoints,
        })
      }
      if (initialPhysicalSkills[skill].freebiePoints !== currentPhysicalSkills[skill].freebiePoints) {
        changes.push({
          field: `${skill}`,
          type: "Freebie Points",
          oldValue: initialPhysicalSkills[skill].freebiePoints,
          newValue: currentPhysicalSkills[skill].freebiePoints,
        })
      }

      const initialSpecialities = initialPhysicalSkills[skill].specialities
      const currentSpecialties = currentPhysicalSkills[skill].specialities


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

    const initialSocialSkills = initialSkills.social as any;
    const currentSocialSkills = currentSkills.social as any; 

    for (const skill in initialSocialSkills) {
      if (initialSocialSkills[skill].creationPoints !== currentSocialSkills[skill].creationPoints) {
        changes.push({
          field: `${skill}`,
          type: "Creation Points",
          oldValue: initialSocialSkills[skill].creationPoints,
          newValue: currentSocialSkills[skill].creationPoints,
        })
      }
      if (initialSocialSkills[skill].experiencePoints !== currentSocialSkills[skill].experiencePoints) {
        changes.push({
          field: `${skill}`,
          type: "Experience Points",
          oldValue: initialSocialSkills[skill].experiencePoints,
          newValue: currentSocialSkills[skill].experiencePoints,
        })
      }
      if (initialSocialSkills[skill].freebiePoints !== currentSocialSkills[skill].freebiePoints) {
        changes.push({
          field: `${skill}`,
          type: "Freebie Points",
          oldValue: initialSocialSkills[skill].freebiePoints,
          newValue: currentSocialSkills[skill].freebiePoints,
        })
      }

      const initialSpecialities = initialSocialSkills[skill].specialities
      const currentSpecialties = currentSocialSkills[skill].specialities
  

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

  const initialRotes = initialAwakened.rotes as any
  const currentRotes = awakened.rotes as any

  if (initialRotes !== currentRotes) {
    for (let i = 0; i < Math.max(initialRotes.length, currentRotes.length); i++) {
      if (i >= initialRotes.length) {
        // New specialty added
        if (currentRotes[i].creationPoints === 0) {
          continue;
        } else {
          changes.push({
            field: `rote[${currentRotes[i].name}]`,
            type: "Creation Points",
            oldValue: 0,
            newValue: currentRotes[i].creationPoints,
          });
        }
        if (currentRotes[i].experiencePoints === 0) {
          continue;
        } else {
          changes.push({
            field: `rote[${currentRotes[i].name}]`,
            type: "Experience Points",
            oldValue: 0,
            newValue: currentRotes[i].experiencePoints,
          });
        } if (currentRotes[i].freebiePoints === 0) {
          continue;
        } else {
          changes.push({
            field: `rote[${currentRotes[i].name}]`,
            type: "Freebie Points",
            oldValue: 0,
            newValue: currentRotes[i].freebiePoints,
          });
        }
      } else if (i >= currentRotes.length) {
        // Specialty removed
        if (initialRotes[i].creationPoints === 0) {
          continue;
        } else {
          changes.push({
            field: `rote[${initialRotes[i].name}]`,
            type: "Creation Points",
            oldValue: initialRotes[i].creationPoints,
            newValue: 0,
          });
        }
        if (initialRotes[i].experiencePoints === 0) {
          continue;
        } else {
          changes.push({
            field: `rote[${initialRotes[i].name}]`,
            type: "Experience Points",
            oldValue: initialRotes[i].experiencePoints,
            newValue: 0,
          });
        } if (initialRotes[i].freebiePoints === 0) {
          continue;
        } else {
          changes.push({
            field: `rote[${initialRotes[i].name}]`,
            type: "Freebie Points",
            oldValue: initialRotes[i].freebiePoints,
            newValue: 0,
          });
        }
      }
    }
  }

  const initialMerits = initialAwakened.rotes as any
  const currentMerits = awakened.rotes as any

  if (initialMerits !== currentMerits) {
    for (let i = 0; i < Math.max(initialMerits.length, currentMerits.length); i++) {
      if (i >= initialMerits.length) {
        // New specialty added
        if (currentMerits[i].creationPoints === 0) {
          continue;
        } else {
          changes.push({
            field: `merit[${currentMerits[i].name}]`,
            type: "Creation Points",
            oldValue: 0,
            newValue: currentMerits[i].creationPoints,
          });
        }
        if (currentMerits[i].experiencePoints === 0) {
          continue;
        } else {
          changes.push({
            field: `merit[${currentMerits[i].name}]`,
            type: "Experience Points",
            oldValue: 0,
            newValue: currentMerits[i].experiencePoints,
          });
        } if (currentMerits[i].freebiePoints === 0) {
          continue;
        } else {
          changes.push({
            field: `merit[${currentMerits[i].name}]`,
            type: "Freebie Points",
            oldValue: 0,
            newValue: currentMerits[i].freebiePoints,
          });
        }
      } else if (i >= currentMerits.length) {
        // Specialty removed
        if (initialMerits[i].creationPoints === 0) {
          continue;
        } else {
          changes.push({
            field: `merit[${initialMerits[i].name}]`,
            type: "Creation Points",
            oldValue: initialMerits[i].creationPoints,
            newValue: 0,
          });
        }
        if (initialMerits[i].experiencePoints === 0) {
          continue;
        } else {
          changes.push({
            field: `merit[${initialMerits[i].name}]`,
            type: "Experience Points",
            oldValue: initialMerits[i].experiencePoints,
            newValue: 0,
          });
        } if (initialMerits[i].freebiePoints === 0) {
          continue;
        } else {
          changes.push({
            field: `merit[${initialMerits[i].name}]`,
            type: "Freebie Points",
            oldValue: initialMerits[i].freebiePoints,
            newValue: 0,
          });
        }
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