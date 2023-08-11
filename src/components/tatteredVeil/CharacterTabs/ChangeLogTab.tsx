import { Awakened } from "../data/Awakened";
import { Center, Table, Stack } from "@mantine/core";
import ExperienceAside from "./components/experienceAside";

type ChangeLogTabProps = {
  awakened: Awakened;
};

const ChangeLogTab = ({ awakened }: ChangeLogTabProps) => {
  const changeLog = awakened.changeLogs as any;

  const rows = Object.keys(changeLog).map((date) => {
    return changeLog[date].map((log: any, index: any) => (
      <tr key={index}>
        <td>{new Date(date).toLocaleString()}</td>
        <td>{log.field}</td>
        <td>{log.newValue}</td>
        <td>{log.oldValue}</td>
        <td>{log.type}</td>
      </tr>
    ));
  });


  return (
    <Center>
      <Stack>
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Field</th>
            <th>New Value</th>
            <th>Old Value</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
      </Stack>
      <ExperienceAside awakened={awakened}></ExperienceAside>

    </Center>
  );
};

export default ChangeLogTab;