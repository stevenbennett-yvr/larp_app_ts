//Technical Imports
import { Title, Table } from '@mantine/core'
//Data Import
import { Awakened } from '../../../data/TatteredVeil/types/Awakened'
import { currentMeritLevel } from '../../../data/TatteredVeil/types/Merits'
import Dots from '../../../utils/dots'

type MageMeritPrintProps = {
    awakened:Awakened
}

const MageMeritPrint = ({awakened}: MageMeritPrintProps) => {

    const textStyle: React.CSSProperties = {
        fontFamily: "Courier New"
    }

    return (
    <>
    <hr style={{width:"50%"}}/>
    <Title order={3}>Merits</Title>
       <Table>
            <thead>
                <th>
                    Merit
                </th>
                <th>
                    Level
                </th>
                <th>
                    Description
                </th>
            </thead>
            <tbody>
                {
                awakened.merits.map((merit) => {
                    const htmlParser = new DOMParser();
                    const doc = htmlParser.parseFromString(merit.description, 'text/html');
                    const firstLi = doc.querySelector('li');
                    const level = currentMeritLevel(merit).level
                    // Get the content of the first <li> element
                    const firstLiContent = firstLi ? firstLi.textContent : merit.description;
                    return (
                    <tr style={textStyle} key={merit.name}>
                        <td>{merit.name}</td>
                        <td><Dots n={level} /></td>
                        <td>{firstLiContent}</td>
                    </tr>
                    )
                })
                }
            </tbody>
        </Table> 
    </>
    )
}

export default MageMeritPrint