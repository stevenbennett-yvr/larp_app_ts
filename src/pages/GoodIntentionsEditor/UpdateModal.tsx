import { Modal, Button, Table, Stack, Text, List } from "@mantine/core"
import { Kindred } from "../../data/GoodIntentions/types/Kindred";
import changeLog from "../../utils/GoodIntentions/LoggingTool";
import { useCharacterDb } from "../../contexts/CharacterContext";

type retireUpdateModal = {
    showUpdate: boolean,
    setShowUpdate: (showUpdate: boolean) => void,
    kindred: Kindred,
    setKindred: (kindred:Kindred) => void,
    initialKindred: Kindred,
    setInitialKindred: (initialKindred:Kindred) => void,

}

const UpdateModal = ({showUpdate, setShowUpdate, kindred, setKindred, initialKindred, setInitialKindred}:retireUpdateModal) => {
    const { updateKindred, getCoterieMembers } = useCharacterDb();


    const handleUpdate = () => {
        if (kindred.id && kindred !== initialKindred) {
          const updatedKindred = {
            ...kindred,
            changeLogs: {
              ...kindred.changeLogs,
              [new Date().toISOString()]: changeLog(initialKindred, kindred)
            }
          }
          console.log("handle update")
          updateKindred(kindred.id, updatedKindred)
          setKindred(updatedKindred)
          setInitialKindred(updatedKindred)
          setShowUpdate(false)
          getCoterieMembers(updatedKindred.coterie.id)
        }
      }


    let logs = changeLog(initialKindred, kindred)

    let rows = logs.map((log, index) => (
        <tr key={index}>
            <td>{log.category}</td>
            <td>{log.field}</td>
            <td>{log.oldValue}</td>
            <td>{log.newValue}</td>
            <td>{log.type}</td>
        </tr>
    ));

    return(
        <Modal opened={showUpdate} onClose={() => setShowUpdate(false)}>
            <Modal.Header>
                <Modal.Title>
                    Changelog
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack>
                    <List>
                {initialKindred.name !== kindred.name? <List.Item><Text size="sm" w={200}>Name Changed</Text></List.Item>:null}
                {initialKindred.concept !== kindred.concept? <List.Item><Text size="sm" w={200}>Concept Changed</Text></List.Item>:null}
                {initialKindred.touchstones !== kindred.touchstones? <List.Item><Text size="sm" w={200}>Touchstones Changed</Text></List.Item>:null}
                {initialKindred.backstory.history !== kindred.backstory.history? <List.Item><Text size="sm" w={200}>Character History Changed</Text></List.Item>:null}
                {initialKindred.backstory.goals !== kindred.backstory.goals? <List.Item><Text size="sm" w={200}>Character Goals Changed</Text></List.Item>:null}
                {initialKindred.backstory.description !== kindred.backstory.description? <List.Item><Text size="sm" w={200}>Character Description Changed</Text></List.Item>:null}
                </List>
                {rows.length > 0? 
                <Table w={200}>
                    <thead>
                        <tr>
                            <td>Category</td>
                            <td>Item</td>
                            <td>Old Value</td>
                            <td>New Value</td>
                            <td>Field</td>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
                :null}
                <Button onClick={handleUpdate}>
                    Confirm Update
                </Button>
                </Stack>
            </Modal.Body>

        </Modal>
    )

}

export default UpdateModal