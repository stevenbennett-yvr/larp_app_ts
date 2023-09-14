//Technical Imports
import { Title, Table } from '@mantine/core'
import React from 'react'
//Data Import
import { Awakened } from '../../../data/TatteredVeil/types/Awakened'
import { currentMeritLevel } from '../../../data/TatteredVeil/types/Merits'
import { getMeritByName } from '../../../data/TatteredVeil/types/Merits'
import Dots from '../../../utils/dots'

type MageMeritPrintProps = {
    awakened: Awakened
}

const MageMeritPrint = ({ awakened }: MageMeritPrintProps) => {

    const textStyle: React.CSSProperties = {
        fontFamily: "Courier New"
    }

    return (
        <>
            <hr style={{ width: "50%" }} />
            <Title order={3}>Merits</Title>
            <Table striped fontSize="xs">
                <thead>
                    <tr>
                        <th>
                            Merit
                        </th>
                        <th>
                            Level
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        awakened.merits
                            .map((merit) => {
                                const meritData = getMeritByName(merit.name);
                                const htmlParser = new DOMParser();
                                const doc = htmlParser.parseFromString(meritData.description, 'text/html');
                                const firstLi = doc.querySelector('li');
                                const level = currentMeritLevel(merit).level;
                                const firstLiContent = firstLi ? firstLi.textContent : meritData.description;
                                return {
                                    name: merit.name,
                                    type: meritData.type, // Assuming you have a type property in your meritData
                                    level: level,
                                    description: firstLiContent,
                                };
                            })
                            .sort((a, b) => {
                                // Define a category order (mental, physical, social)
                                const categoryOrder = ['Mental merits', 'Physical merits', 'Social merits', 'Mage merits', "Sanctum merits"];

                                // Get the category index for each merit
                                const categoryIndexA = categoryOrder.indexOf(a.type);
                                const categoryIndexB = categoryOrder.indexOf(b.type);

                                // Compare by category first
                                if (categoryIndexA === categoryIndexB) {
                                    // If in the same category, then compare by mage type
                                    return a.name.localeCompare(b.name);
                                }

                                // Compare by category index
                                return categoryIndexA - categoryIndexB;
                            })
                            .map((meritData) => (
                                <React.Fragment key={meritData.name}>
                                    <tr style={textStyle}>
                                        <td>{meritData.name}</td>
                                        <td><Dots n={meritData.level} /></td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>{meritData.description}</td>
                                    </tr>
                                </React.Fragment>
                            ))
                    }
                </tbody>
            </Table>
        </>
    )
}

export default MageMeritPrint