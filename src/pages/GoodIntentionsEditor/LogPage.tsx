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

    const rows = logEntries.map(({ originalDate, log }, index) => {
        const difference = log.newValue - log.oldValue;
        const color = difference > 0 ? 'green' : difference < 0 ? 'red' : 'black';

        return (
            <tr key={index}>
                <td>{originalDate.toLocaleString()}</td>
                <td>{log.category}</td>
                <td>{log.field}</td>
                <td>{log.type}</td>
                <td style={{ color }}>
                    {difference > 0 ? `+${difference}` : difference}
                </td>
            </tr>
        )
    });

    return (
        <Table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Item</th>
                    <th>Field</th>
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