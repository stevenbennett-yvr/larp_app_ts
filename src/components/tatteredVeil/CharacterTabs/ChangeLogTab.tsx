import { Awakened } from "../data/Awakened";
import { Center, Table, Stack } from "@mantine/core";
import ExperienceAside from "./components/experienceAside";

type ChangeLogTabProps = {
  awakened: Awakened;
};

const ChangeLogTab = ({ awakened }: ChangeLogTabProps) => {
  const changeLog = awakened.changeLogs as any;

  // Create an array of objects with sortable date representation
  const logEntries = Object.keys(changeLog).flatMap((date) =>
    changeLog[date].map((log: any) => ({
      originalDate: new Date(date),
      sortableDate: new Date(date).getTime(),
      log,
    }))
  );

  // Sort the log entries by the sortable date
  logEntries.sort((a, b) => a.sortableDate - b.sortableDate);

  const rows = logEntries.map(({ originalDate, log }, index) => (
    <tr key={index}>
      <td>{originalDate.toLocaleString()}</td>
      <td>{log.field}</td>
      <td>{log.newValue}</td>
      <td>{log.oldValue}</td>
      <td>{log.type}</td>
    </tr>
  ));

  return (
    <Center>
      <Stack>
        <Table striped highlightOnHover withColumnBorders>
          <thead>
            <tr>
              <th>Date</th>
              <th>Field</th>
              <th>New Value</th>
              <th>Old Value</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Stack>
      <ExperienceAside awakened={awakened}></ExperienceAside>
    </Center>
  );
};

export default ChangeLogTab;
