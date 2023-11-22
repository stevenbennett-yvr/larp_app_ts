import { Table } from "@mantine/core"
import { Kindred } from "../../data/GoodIntentions/types/Kindred"


type LogPageProps = {
    kindred: Kindred
}

const LogPage = ({ kindred }: LogPageProps) => {

    let changeLog = kindred.changeLogs as any

    const logEntries = Object.keys(changeLog).flatMap((date) =>
        changeLog[date].map((log: any) => ({
            originalDate: new Date(date),
            sortableDate: new Date(date).getTime(),
            log,
        }))
    );

    logEntries.sort((a, b) => a.sortableDate - b.sortableDate);


        console.log(logEntries)

    const rows = logEntries.map(({ originalDate, log }, index) => (
        <tr key={index}>
          <td>{originalDate.toLocaleString()}</td>
          <td>{log.category}</td>
          <td>{log.item}</td>
          <td>{log.newValue}</td>
          <td>{log.oldValue}</td>
          <td></td>
        </tr>
      ));

    return (
        <Table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Item</th>
                    <th>Old Value</th>
                    <th>New Value</th>
                    <th>Change</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
    )
}

export default LogPage