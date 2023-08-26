//Technical Imports
import { Title, Table } from '@mantine/core'
//Data Import
import { Awakened } from '../../../data/TatteredVeil/types/Awakened'
import { calculatePool } from '../../../data/TatteredVeil/types/Rotes'

type MageRotePrintProps = {
    awakened:Awakened
}

const MageRotePrint = ({awakened}: MageRotePrintProps) => {

    const textStyle: React.CSSProperties = {
        fontFamily: "Courier New"
    }

    return (
    <>
    <hr style={{width:"50%"}}/>
    <Title order={3}>Rotes</Title>
       <Table>
            <thead>
                <th>
                    Arcana
                </th>
                <th>
                    Name
                </th>
                <th>
                    Description
                </th>
                <th>
                    Aspect
                </th>
                <th>
                    Pool
                </th>
            </thead>
            <tbody>
                {
                awakened.rotes.map((rote) => {
                    const htmlParser = new DOMParser();
                    const doc = htmlParser.parseFromString(rote.description, 'text/html');
                    const firstLi = doc.querySelector('li');
                  
                    // Get the content of the first <li> element
                    const firstLiContent = firstLi ? firstLi.textContent : '';
                    return (
                    <tr style={textStyle} key={rote.name}>
                        <td>{rote.arcanum.slice(0, 3)} {rote.level}</td>
                        <td>{rote.name}</td>
                        <td>{firstLiContent}</td>
                        <td>{rote.aspect}</td>
                        <td>{rote.rotePool} : {calculatePool(rote.rotePool, awakened)}</td>
                    </tr>
                    )
                })
                }
            </tbody>
        </Table> 
    </>
    )
}

export default MageRotePrint