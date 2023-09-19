import React, { useState, useEffect } from 'react';
import { Avatar, Image, Center, Table, Stack, Alert, Group, Button, Text, Input, Select, Accordion } from '@mantine/core'
import { forwardRef } from 'react';

import { Awakened } from "../../../data/TatteredVeil/types/Awakened";
import { nWoD1eCurrentAttributeLevel, AttributesKey, AttributeCategory, nWoD1eHandleAttributeChange, nWoD1eFindMaxAttribute, nWoD1ehandleXpAttributeChange } from '../../../data/nWoD1e/nWoD1eAttributes';
import { currentMeritLevel } from '../../../data/TatteredVeil/types/Merits';
import { globals } from '../../../assets/globals';
import { TopSection } from '../../../components/TatteredVeil/TopSection';
import ExperienceAside from '../../TatteredVeilEditor/CharacterTabs/components/experienceAside';
import { currentExperience } from '../../../data/TatteredVeil/types/Experience';
import '../StEditor.css'
import { SkillsKey, nWoD1eCurrentSkillLevel, nWoD1eFindMaxSkill, nWoD1eHandleSkillChange, nWoD1eHandleXpSkillChange, nWoD1eHandleSpeciality, nWoD1eAddSpeciality, nWoD1eRemoveSpeciality } from '../../../data/nWoD1e/nWoD1eSkills';
import { ArcanaKey, currentArcanumLevel, findMaxArcana, handleArcanumChange, arcanaDescriptions } from '../../../data/TatteredVeil/types/Arcanum';
import { removeRote, roteData, roteRefs, Rote, RoteRef, getRoteByName, getFilteredRotes, handleRoteChange, calculatePool } from '../../../data/TatteredVeil/types/Rotes';

type AwakenedStTabProps = {
    awakened: Awakened,
    setAwakened: (awakend: Awakened) => void,
    handleUpdate: () => void,
};

const AwakenedStTab = ({ awakened, setAwakened, handleUpdate }: AwakenedStTabProps) => {

    const [showAsideBar, setShowAsideBar] = useState(!globals.isSmallScreen)
    useEffect(() => { setShowAsideBar(!globals.isSmallScreen) }, [globals.isSmallScreen])

    //OHTER SECTION

    const otherSection = () => {
        const dexterityLevel = nWoD1eCurrentAttributeLevel(awakened, 'dexterity').level;
        const strengthLevel = nWoD1eCurrentAttributeLevel(awakened, 'strength').level;
        const fleetOfFootMerit = awakened.merits.find(merit => merit.name === 'Fleet of Foot');
        const fleetOfFootLevel = fleetOfFootMerit ? currentMeritLevel(fleetOfFootMerit).level : 0;
        const calculatedSpeed = dexterityLevel + strengthLevel + 5 + fleetOfFootLevel;
        const calculateDefense = Math.min(nWoD1eCurrentAttributeLevel(awakened, 'dexterity').level, nWoD1eCurrentAttributeLevel(awakened, 'wits').level)

        const fastReflexMerit = awakened.merits.find(merit => merit.name === 'Fast Reflexes');
        const fastReflexLevel = fastReflexMerit ? currentMeritLevel(fastReflexMerit).level : 0;
        const calculateInit = nWoD1eCurrentAttributeLevel(awakened, 'dexterity').level + nWoD1eCurrentAttributeLevel(awakened, 'composure').level + fastReflexLevel

        return (
            <Center>
                {globals.isPhoneScreen ?
                    <Table striped withBorder fontSize="sm" style={{ maxWidth: "100px" }}>
                        <tbody>
                            <tr>
                                <td>
                                    Size:
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {awakened.merits.some(merit => merit.name === "Giant") ? 6 : 5}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Speed:
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculatedSpeed}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Defense:
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculateDefense}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Init:
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculateInit}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    :
                    <Table striped withBorder fontSize="xs" style={{ maxWidth: "400px" }}>
                        <thead>
                            <tr>
                                <th>Size</th>
                                <th>Speed</th>
                                <th>Defense</th>
                                <th>Init Mod</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'center' }}>
                                    {awakened.merits.some(merit => merit.name === "Giant") ? 6 : 5}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculatedSpeed}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculateDefense}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {calculateInit}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                }
            </Center>
        )
    }


    // Attributes section.
    const attributesSection = () => {
        const orderedCategories = ['mental', 'physical', 'social'];
        const orderedAttributes = {
            'mental': ['intelligence', 'wits', 'resolve'],
            'physical': ['strength', 'dexterity', 'stamina'],
            'social': ["presence", 'manipulation', 'composure']
        }

        return (
            <Center>
                <Table style={{ maxWidth: "250px" }}>
                    <thead>
                        <tr>
                            <th style={{ verticalAlign: "bottom" }}>Attributes:</th>
                            <th id='vertical-text'>Level</th>
                            <th id='vertical-text'>Creation Points</th>
                            <th id='vertical-text'>Freebie Points</th>
                            <th id='vertical-text'>XP Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderedCategories.map((category) => {
                            let categoryKey = category as AttributeCategory
                            const orderedAttributesForCategory = orderedAttributes[categoryKey];
                            return (
                                <>
                                    <Text fs="italic" ta="center">
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </Text>
                                    {Object.entries(awakened.attributes)
                                        .sort(([a], [b]) => orderedAttributesForCategory.indexOf(a) - orderedAttributesForCategory.indexOf(b))
                                        .map(([attribute, attributeInfo]) => {
                                            const attributeName = attribute as AttributesKey;
                                            const { level } = nWoD1eCurrentAttributeLevel(awakened, attributeName);
                                            if (attributeInfo.category === categoryKey) {
                                                return (
                                                    <tr>
                                                        <td>
                                                            {`${attribute.charAt(0).toUpperCase() + attribute.slice(1)}`}
                                                        </td>
                                                        <td>
                                                            {`${level}`}
                                                        </td>
                                                        <td>
                                                            <Input
                                                                style={{ width: '50px', margin: '0 8px' }}
                                                                type='number'
                                                                key={`${category}-${attribute}`}
                                                                min={1}
                                                                max={5}
                                                                value={attributeInfo.creationPoints}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const value = Number(e.target.value);
                                                                    nWoD1eHandleAttributeChange(awakened, setAwakened, attributeName, 'creationPoints', value)
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                style={{ width: '50px', margin: '0 8px' }}
                                                                type='number'
                                                                key={`${category}-${attribute}`}
                                                                min={1}
                                                                max={10}
                                                                value={attributeInfo.freebiePoints}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const value = Number(e.target.value);
                                                                    nWoD1eHandleAttributeChange(awakened, setAwakened, attributeName, 'freebiePoints', value)
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                style={{ width: '50px', margin: '0 8px' }}
                                                                type="number"
                                                                key={`${category}-${attribute}`}
                                                                min={0}
                                                                max={nWoD1eFindMaxAttribute(awakened, attributeName)}
                                                                value={attributeInfo.experiencePoints}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const value = Number(e.target.value);
                                                                    nWoD1ehandleXpAttributeChange(awakened, setAwakened, attributeName, value);
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                            else {
                                                return null
                                            };
                                        })}
                                </>
                            )

                        })}
                    </tbody>

                </Table>
            </Center>
        )

    }

    // Skills section.
    const [specialitiesState, setSpecialitiesState] = useState<{ [key in SkillsKey]?: string }>({});
    const skillsSection = () => {
        const orderedCategories = ['mental', 'physical', 'social'];

        return (
            <Center>
                <Table>
                    <thead>
                        <tr>
                            <th style={{ verticalAlign: "bottom" }}>Skills:</th>
                            <th id='vertical-text'>Level</th>
                            <th id='vertical-text'>Creation Points</th>
                            <th id='vertical-text'>Freebie Points</th>
                            <th id='vertical-text'>XP Spent</th>
                            <th style={{ verticalAlign: "bottom" }}>Specialities</th>
                            <th id='vertical-text'>Creation Points</th>
                            <th id='vertical-text'>Freebie Points</th>
                            <th id='vertical-text'>XP Spent</th>
                            <th></th>
                        </tr>
                        {orderedCategories.map((category) => {
                            let categoryKey = category as AttributeCategory
                            return (
                                <>
                                    <Text fs="italic" ta="center">
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </Text>
                                    {Object.entries(awakened.skills)
                                        .sort(([skillA], [skillB]) => skillA.localeCompare(skillB))
                                        .map(([skill, skillInfo]) => {
                                            const skillName = skill as SkillsKey;
                                            const { level } = nWoD1eCurrentSkillLevel(awakened, skillName);
                                            const specialities = skillInfo.specialities.map((spec) => spec.name);
                                            const selectedSpeciality = specialitiesState[skillName];
                                            const selectedSpecialityInfo = skillInfo.specialities.find(speciality => speciality.name === selectedSpeciality);
                                            if (skillInfo.category === categoryKey) {
                                                return (
                                                    <tr>
                                                        <td>
                                                            {`${skill.charAt(0).toUpperCase() + skill.slice(1)}`}
                                                        </td>
                                                        <td>
                                                            {`${level}`}
                                                        </td>
                                                        <td>
                                                            <Input
                                                                style={{ width: '50px', margin: '0 8px' }}
                                                                type='number'
                                                                key={`${category}-${skill}-cp`}
                                                                min={1}
                                                                max={5}
                                                                value={skillInfo.creationPoints}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const value = Number(e.target.value);
                                                                    nWoD1eHandleSkillChange(awakened, setAwakened, skillName, 'creationPoints', value)
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                style={{ width: '50px', margin: '0 8px' }}
                                                                type='number'
                                                                key={`${category}-${skill}-fp`}
                                                                min={1}
                                                                max={10}
                                                                value={skillInfo.freebiePoints}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const value = Number(e.target.value);
                                                                    nWoD1eHandleSkillChange(awakened, setAwakened, skillName, 'freebiePoints', value)
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                style={{ width: '50px', margin: '0 8px' }}
                                                                type="number"
                                                                key={`${category}-${skill}-xp`}
                                                                min={0}
                                                                max={nWoD1eFindMaxSkill(awakened, skillName)}
                                                                value={skillInfo.experiencePoints}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const value = Number(e.target.value);
                                                                    nWoD1eHandleXpSkillChange(awakened, setAwakened, skillName, value);
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Select
                                                                data={specialities}
                                                                placeholder={`${skill.charAt(0).toUpperCase() + skill.slice(1)} Specialities`}
                                                                searchable
                                                                allowDeselect
                                                                creatable
                                                                getCreateLabel={(query) => `+ Create ${query}`}
                                                                value={selectedSpeciality}
                                                                onChange={(value) => {
                                                                    // Set the selected speciality for the corresponding skill
                                                                    setSpecialitiesState((prevSpecialitiesState) => ({
                                                                        ...prevSpecialitiesState,
                                                                        [skillName]: value as string,
                                                                    }));
                                                                }}
                                                                onCreate={(query) => {
                                                                    nWoD1eAddSpeciality(awakened, setAwakened, skillName, query, 'experiencePoints');
                                                                    return query;
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                max={1}
                                                                value={selectedSpecialityInfo?.creationPoints || 0}
                                                                onChange={(e) => {
                                                                    const value = Number(e.target.value);
                                                                    if (selectedSpecialityInfo) {
                                                                        nWoD1eHandleSpeciality(awakened, setAwakened, skillName, selectedSpecialityInfo, 'creationPoints', value)
                                                                    }
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                max={1}
                                                                value={selectedSpecialityInfo?.freebiePoints || 0}
                                                                onChange={(e) => {
                                                                    const value = Number(e.target.value);
                                                                    if (selectedSpecialityInfo) {
                                                                        nWoD1eHandleSpeciality(awakened, setAwakened, skillName, selectedSpecialityInfo, 'freebiePoints', value)
                                                                    }
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                max={3}
                                                                value={selectedSpecialityInfo?.experiencePoints || 0}
                                                                onChange={(e) => {
                                                                    const value = Number(e.target.value);
                                                                    if (selectedSpecialityInfo) {
                                                                        nWoD1eHandleSpeciality(awakened, setAwakened, skillName, selectedSpecialityInfo, 'experiencePoints', value)
                                                                    }
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            {selectedSpeciality && (
                                                                <Button
                                                                    size="xs"
                                                                    variant="outline"
                                                                    color="blue"
                                                                    onClick={() => {
                                                                        // Remove the selected speciality
                                                                        nWoD1eRemoveSpeciality(awakened, setAwakened, skillName, selectedSpeciality)
                                                                        setSpecialitiesState((prevSpecialitiesState) => ({
                                                                            ...prevSpecialitiesState,
                                                                            [skillName]: '',
                                                                        }));
                                                                    }}
                                                                >
                                                                    X
                                                                </Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                            else {
                                                return null
                                            };
                                        })}

                                </>
                            )
                        })}
                    </thead>

                </Table>
            </Center>
        )

    }

    // Arcana section

    const arcanaSection = () => {

        return (
            <Center>
                <Table style={{ maxWidth: "400px" }}>
                    <thead>
                        <tr>
                            <th>
                                Arcana
                            </th>
                            <th>
                                Type
                            </th>
                            <th id='vertical-text'>
                                level
                            </th>
                            <th id='vertical-text'>
                                Creation Points
                            </th>
                            <th id='vertical-text'>
                                Freebie Points
                            </th>
                            <th id='vertical-text'>
                                XP Points
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(awakened.arcana)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([arcanum, arcanumInfo]) => {
                                const arcanumName = arcanum as ArcanaKey
                                const level = currentArcanumLevel(awakened, arcanumName).level
                                return (
                                    <tr>
                                        <td>
                                            {`${arcanum.charAt(0).toUpperCase() + arcanum.slice(1)}`}
                                        </td>
                                        <td>
                                            {`${arcanumInfo.type}`}
                                        </td>
                                        <td>
                                            {`${level}`}
                                        </td>
                                        <td>
                                            <Input
                                                style={{ width: '50px', margin: '0 8px' }}
                                                type='number'
                                                key={`${arcanum}-cp`}
                                                min={1}
                                                max={5}
                                                value={arcanumInfo.creationPoints}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const value = Number(e.target.value);
                                                    handleArcanumChange(awakened, setAwakened, arcanumName, 'creationPoints', value)
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                style={{ width: '50px', margin: '0 8px' }}
                                                type='number'
                                                key={`${arcanum}-fp`}
                                                min={1}
                                                max={5}
                                                value={arcanumInfo.freebiePoints}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const value = Number(e.target.value);
                                                    handleArcanumChange(awakened, setAwakened, arcanumName, 'freebiePoints', value)
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                style={{ width: '50px', margin: '0 8px' }}
                                                type='number'
                                                key={`${arcanum}-xp`}
                                                min={1}
                                                max={findMaxArcana(awakened, arcanumName)}
                                                value={arcanumInfo.experiencePoints}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const value = Number(e.target.value);
                                                    handleArcanumChange(awakened, setAwakened, arcanumName, "experiencePoints", value);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </Center>
        )
    }

    // Rotes Section

    const [learnableRotes, setLearnableRotes] = useState<Rote[]>(getFilteredRotes(awakened))
    const [selectedRote, setSelectedRote] = useState<string | null>("");
    useEffect(() => {
        setLearnableRotes(getFilteredRotes(awakened))
    }, [awakened])
    const roteSection = () => {

        const roteInputs = (learnableRotes: Rote[]) => {
            const sortedRotes = learnableRotes.sort((a, b) => {
                const arcanumComparison = a.arcanum.localeCompare(b.arcanum);
                if (arcanumComparison !== 0) {
                    return arcanumComparison;
                }
                if (a.level !== b.level) {
                    return a.level - b.level;
                }
                return a.name.localeCompare(b.name);
            });

            // Filter out the rotes that also appear in awakened.rotes
            const filteredRotes = sortedRotes.filter((rote) => {
                return !awakened.rotes.some((existingRote) => existingRote.name === rote.name);
            });

            const selectData = filteredRotes.map((rote) => ({
                value: `${rote.name}`,
                label: `${rote.arcanum} ${rote.level} - ${rote.name}`,
                image: `${arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey].logo}`,
                bgc: `${arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey]?.color}`
            }));

            interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
                image: string;
                label: string;
                bgc: string;
            }


            const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
                ({ image, label, bgc, ...others }: ItemProps, ref) => (
                    <div ref={ref} {...others} style={{ backgroundColor: bgc, border: '1px solid white' }}>
                        <Group noWrap>
                            <Avatar size={'sm'} src={image} />
                            <div>
                                <Text size="sm" color="white">{label}</Text>
                            </div>
                        </Group>
                    </div>
                )
            );

            const getSelectedRoteData = () => {
                if (selectedRote) {
                    // Find the rote in the sortedRotes array that matches the selectedRote
                    const selectedRoteData = roteData.find((rote) => rote.name === selectedRote);
                    if (selectedRoteData) {
                        const selectedRoteRef = roteRefs.find((r) => r.name === selectedRoteData.name)
                        if (!selectedRoteRef) { return }
                        return (
                            <>
                                {globals.isPhoneScreen ? (
                                    <Table>
                                        <tbody>

                                            <tr>
                                                <td style={{ backgroundColor: arcanaDescriptions[selectedRoteData.arcanum.toLowerCase() as ArcanaKey]?.color ?? "white" }}>
                                                    <Group grow>
                                                        <Stack spacing="xs" align="flex-start">
                                                            <Text fz={globals.smallerFontSize} style={{ color: "white" }}>{selectedRoteData.name}</Text>
                                                            <Image
                                                                fit="contain"
                                                                withPlaceholder
                                                                src={arcanaDescriptions[selectedRoteData.arcanum.toLowerCase() as ArcanaKey].logo}
                                                                height={30}
                                                                width={30}
                                                                alt="order"
                                                                style={{ filter: "brightness(0)" }}
                                                            />
                                                            <p style={{ color: "white" }}>{selectedRoteData.arcanum} {selectedRoteData.level} {selectedRoteData.otherArcana ? `+ ${selectedRoteData.otherArcana}` : ""}</p>
                                                        </Stack>

                                                        <Button
                                                            color="gray"
                                                            disabled={!selectedRote || !learnableRotes.some(rote => rote.name === selectedRote)}
                                                            onClick={() => {
                                                                let xpCost = selectedRoteData.level * 2;
                                                                handleRoteChange(awakened, setAwakened, selectedRoteRef, "experiencePoints", xpCost)
                                                                setSelectedRote("")
                                                            }}>Buy</Button>
                                                    </Group>
                                                </td>
                                            </tr>
                                            <tr key={`${selectedRoteData.name} ${selectedRoteData.arcanum} phone`}>

                                                <td dangerouslySetInnerHTML={{ __html: `${selectedRoteData.description} <p>Rote Pool: ${selectedRoteData.rotePool}  (${calculatePool(selectedRoteData.rotePool, awakened)})</p>` }} />
                                            </tr>
                                        </tbody>
                                    </Table>
                                ) : (
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Rote</th>
                                                <th>Description</th>
                                                <th>Select</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr key={`${selectedRoteData.name} ${selectedRoteData.arcanum} desktop`}>
                                                <td style={{ backgroundColor: arcanaDescriptions[selectedRoteData.arcanum.toLowerCase() as ArcanaKey]?.color ?? "white", minWidth: "150px" }}>
                                                    <Text fz={globals.smallerFontSize} style={{ color: "white" }}>{selectedRoteData.name}</Text>
                                                    <Image
                                                        fit="contain"
                                                        withPlaceholder
                                                        src={arcanaDescriptions[selectedRoteData.arcanum.toLowerCase() as ArcanaKey].logo}
                                                        height={30}
                                                        width={30}
                                                        alt="order"
                                                        style={{ filter: "brightness(0)" }}
                                                    />
                                                    <p style={{ color: "white" }}>{selectedRoteData.arcanum} {selectedRoteData.level} {selectedRoteData.otherArcana ? `+ ${selectedRoteData.otherArcana}` : ""}</p>
                                                </td>
                                                <td dangerouslySetInnerHTML={{ __html: `${selectedRoteData.description} <p>Rote Pool: ${selectedRoteData.rotePool}  (${calculatePool(selectedRoteData.rotePool, awakened)})</p>` }} />
                                                <td>
                                                    <Button
                                                        color="gray"
                                                        disabled={!selectedRote || !learnableRotes.some(rote => rote.name === selectedRote)}
                                                        onClick={() => {
                                                            let xpCost = selectedRoteData.level * 2;
                                                            handleRoteChange(awakened, setAwakened, selectedRoteRef, "experiencePoints", xpCost)
                                                            setSelectedRote("")
                                                        }}>Buy</Button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>

                                )}
                            </>
                        );
                    }
                }
                return null;
            };

            const roteArcanaSet = new Set(Object.values(awakened.rotes).map((rote) => getRoteByName(rote.name).arcanum));
            const roteArcana = Array.from(roteArcanaSet);
            roteArcana.sort()
            let isRoteOutOfOrder = (roteRef: RoteRef) => {
                let rote = getRoteByName(roteRef.name)
                return rote.level > currentArcanumLevel(awakened, rote.arcanum.toLowerCase() as ArcanaKey).level
            }
            const knownCreateRoteAccordian = (arcanum: ArcanaKey) => {
                const knownRotes = awakened.rotes.filter((rote) => getRoteByName(rote.name).arcanum.toLowerCase() === arcanum.toLowerCase())

                knownRotes.sort((a, b) => {
                    if (getRoteByName(a.name).level !== getRoteByName(b.name).level) {
                        return getRoteByName(a.name).level - getRoteByName(b.name).level;
                    }
                    return a.name.localeCompare(b.name);
                });

                let anyRoteOutOfOrder = knownRotes.some(
                    (rote) => isRoteOutOfOrder(rote)
                );

                return (
                    <div key={arcanum}>
                        <Accordion.Item value={arcanum}>
                            <Accordion.Control icon={<Image height={20} width={20} src={arcanaDescriptions[arcanum.toLowerCase() as ArcanaKey].logo} />} style={{ color: "white", border: anyRoteOutOfOrder ? '2px solid red' : 'none', backgroundColor: arcanaDescriptions[arcanum.toLowerCase() as ArcanaKey]?.color ?? "white" }}>{arcanum.toUpperCase()} {anyRoteOutOfOrder ? "⚠️" : ""}</Accordion.Control>
                            <Accordion.Panel>
                                <Table>
                                    <tbody>
                                        {knownRotes.map((roteRef) => {
                                            const rote = getRoteByName(roteRef.name)
                                            return (
                                                <>
                                                    <tr>
                                                        <td colSpan={4} style={{ backgroundColor: arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey]?.color ?? "white" }}>
                                                            <Group grow>
                                                                <Text fz={globals.smallerFontSize} style={{ color: "white" }}>{rote.name}</Text>
                                                                <Image
                                                                    fit="contain"
                                                                    withPlaceholder
                                                                    src={arcanaDescriptions[rote.arcanum.toLowerCase() as ArcanaKey].logo}
                                                                    height={30}
                                                                    width={30}
                                                                    alt="order"
                                                                    style={{ filter: "brightness(0)" }}
                                                                />
                                                                <p style={{ color: "white" }}>{rote.arcanum} {rote.level} {rote.otherArcana ? `+ ${rote.otherArcana}` : ""}</p>
                                                            </Group>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Input.Wrapper label="Creation Points" maw={320} mx="auto">
                                                                <Input
                                                                    style={{ width: '50px', margin: '0 8px' }}
                                                                    type='number'
                                                                    key={`${roteRef.name}-cp`}
                                                                    min={0}
                                                                    max={rote.level}
                                                                    value={roteRef.creationPoints}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                        const value = Number(e.target.value);
                                                                        handleRoteChange(awakened, setAwakened, roteRef, "creationPoints", value)
                                                                    }}
                                                                />
                                                            </Input.Wrapper>
                                                        </td>
                                                        <td>
                                                            <Input.Wrapper label="Freebie Points" maw={320} mx="auto">
                                                                <Input
                                                                    style={{ width: '50px', margin: '0 8px' }}
                                                                    type='number'
                                                                    key={`${roteRef.name}-fp`}
                                                                    min={0}
                                                                    max={rote.level}
                                                                    value={roteRef.freebiePoints}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                        const value = Number(e.target.value);
                                                                        handleRoteChange(awakened, setAwakened, roteRef, "freebiePoints", value)
                                                                    }}
                                                                />
                                                            </Input.Wrapper>
                                                        </td>
                                                        <td>
                                                            <Input.Wrapper label="Experience Points" maw={320} mx="auto">
                                                                <Input
                                                                    style={{ width: '50px', margin: '0 8px' }}
                                                                    type='number'
                                                                    key={`${roteRef.name}-xp`}
                                                                    min={0}
                                                                    max={rote.level * 2}
                                                                    value={roteRef.experiencePoints}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                        const value = Number(e.target.value);
                                                                        handleRoteChange(awakened, setAwakened, roteRef, "freebiePoints", value)
                                                                    }}
                                                                />
                                                            </Input.Wrapper>
                                                        </td>
                                                        <td>
                                                            <Button color="gray" onClick={() => {
                                                                removeRote(awakened, setAwakened, roteRef)
                                                            }}>Remove</Button>
                                                        </td>
                                                    </tr>
                                                    <tr key={`${rote.name} ${rote.arcanum} phone`}>
                                                        <td colSpan={4} dangerouslySetInnerHTML={{ __html: `${rote.description} <p>Rote Pool: ${rote.rotePool}  (${calculatePool(rote.rotePool, awakened)})</p>` }} />
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </Table>

                            </Accordion.Panel>
                        </Accordion.Item>
                    </div>
                )
            }
            return (
                <div>
                    <Group>

                        <Select
                            data={selectData}
                            value={selectedRote}
                            onChange={(val) => setSelectedRote(val)}
                            placeholder="Select Rote to Buy"
                            itemComponent={SelectItem}
                            searchable
                            allowDeselect
                            style={{ width: '70%' }}
                        />
                    </Group>
                    {getSelectedRoteData()}

                    <Text>Known Rotes</Text>
                    <Accordion>
                        {
                            (roteArcana as ArcanaKey[]).map((a) => knownCreateRoteAccordian(a))
                        }
                    </Accordion>
                </div>
            );
        };

        return (
            <>
                <Text mt={"xl"} ta="center" fz="xl" fw={700}>Rotes</Text>
                <hr style={{ width: "50%" }} />
                {roteInputs(learnableRotes)}
            </>
        )
    }

    // end return section

    return (
        <Center>
            <Stack>
                <TopSection awakened={awakened} />
                {otherSection()}

                {attributesSection()}

                {skillsSection()}

                {arcanaSection()}

                {roteSection()}

                <Alert color={0 > currentExperience(awakened) ? "red" : "dark"} variant="outline" radius="xs" style={{ padding: "0px", position: "fixed", bottom: "0px", left: globals.isPhoneScreen ? "0px" : globals.isSmallScreen ? "15%" : "30%" }}>
                    <Group>
                        <Button.Group>
                            <Button
                                style={{ margin: "5px" }}
                                color="gray"
                                disabled={0 > currentExperience(awakened)}
                                onClick={() => handleUpdate()}>
                                Update
                            </Button>
                            <Text fz={globals.smallerFontSize} style={{ margin: "10px" }} color={0 > currentExperience(awakened) ? "#FF6B6B" : "white"}>Remaining Experience: {currentExperience(awakened)}</Text>
                        </Button.Group>
                    </Group>
                </Alert>
            </Stack>
            {showAsideBar ? <ExperienceAside awakened={awakened}></ExperienceAside> : <></>}
        </Center>
    )

};

export default AwakenedStTab