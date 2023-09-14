//Technical Imports
import { Title, Table } from '@mantine/core'
import React from 'react'
//Data Import
import { Awakened } from '../../../data/TatteredVeil/types/Awakened'
import { calculatePool, getRoteByName } from '../../../data/TatteredVeil/types/Rotes'

type MageRotePrintProps = {
    awakened: Awakened
}

const MageRotePrint = ({ awakened }: MageRotePrintProps) => {

    const textStyle: React.CSSProperties = {
        fontFamily: "Courier New"
    }

    return (
        <>
            <hr style={{ width: "50%" }} />
            <Title order={3} align='center'>Rotes</Title>
            <Table striped fontSize="xs">
                <thead>
                    <tr>
                        <th>
                            Arcana
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Pool
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        awakened.rotes
                            .map((rote) => {
                                const roteData = getRoteByName(rote.name);
                                const htmlParser = new DOMParser();
                                const doc = htmlParser.parseFromString(roteData.description, 'text/html');
                                const firstLi = doc.querySelector('li');
                                const firstLiContent = firstLi ? firstLi.textContent : '';
                                return {
                                    arcanum: roteData.arcanum.slice(0, 3),
                                    level: roteData.level,
                                    name: roteData.name,
                                    rotePool: roteData.rotePool,
                                    description: firstLiContent,
                                };
                            })
                            .sort((a, b) => {
                                // Compare first by arcanum, then by level
                                if (a.arcanum === b.arcanum) {
                                    return a.level - b.level;
                                }
                                return a.arcanum.localeCompare(b.arcanum);
                            })
                            .map((roteData) => (
                                <React.Fragment key={roteData.name}>
                                    <tr style={textStyle}>
                                        <td>{roteData.arcanum} {roteData.level}</td>
                                        <td>{roteData.name}</td>
                                        <td>{roteData.rotePool} : {calculatePool(roteData.rotePool, awakened)}</td>
                                    </tr>
                                    <tr>
                                        <td>Description: </td>
                                        <td colSpan={8}>{roteData.description}</td>
                                    </tr>
                                </React.Fragment>
                            ))
                    }

                </tbody>
            </Table>
        </>
    )
}

export default MageRotePrint