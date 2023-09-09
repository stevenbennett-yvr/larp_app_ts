//Technical Imports
import { Title, Table } from '@mantine/core'
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
            <Table fontSize="xs">
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
                        awakened.rotes.map((rote) => {
                            const roteData = getRoteByName(rote.name)
                            const htmlParser = new DOMParser();
                            const doc = htmlParser.parseFromString(roteData.description, 'text/html');
                            const firstLi = doc.querySelector('li');

                            // Get the content of the first <li> element
                            const firstLiContent = firstLi ? firstLi.textContent : '';
                            return (
                                <>
                                    <tr style={textStyle} key={rote.name}>
                                        <td>{roteData.arcanum.slice(0, 3)} {roteData.level}</td>
                                        <td>{roteData.name}</td>
                                        <td>{roteData.rotePool} : {calculatePool(roteData.rotePool, awakened)}</td>
                                    </tr>
                                    <tr>
                                        <td>Description: </td>
                                        <td colSpan={8}>{firstLiContent}</td>
                                    </tr>
                                </>
                            )
                        })
                    }
                </tbody>
            </Table>
        </>
    )
}

export default MageRotePrint