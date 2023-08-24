//Technical Imports
import { Center, Alert, Text } from '@mantine/core'
import RichTextEditor from '@mantine/rte'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faBullseye, faMask } from '@fortawesome/free-solid-svg-icons'

type MageBackgroundProps = {
    richTextValue: any,
    setRichTextValue: (richTextValue: object) => void
}

const MageBackground = ({richTextValue, setRichTextValue}: MageBackgroundProps) => {

    const handleRichTextChange = (field:string, value:string) => {
        setRichTextValue({
            ...richTextValue,
            [field]: value,
        });
      };

    return(
        <Center>
        <Alert color="gray" title="ST Info">
  
          <Text fz="lg" color="dimmed">
              <FontAwesomeIcon icon={faBookOpen} /> History
          </Text>
          <RichTextEditor
              id="rte-history"
              placeholder="How did your character come to be?"
              value={richTextValue.history}
              style={{ padding: '5px' }}
              onChange={val => handleRichTextChange('history', val)}
          />
  
          <Text fz="lg" color="dimmed">
              <FontAwesomeIcon icon={faBullseye} /> Goals
          </Text>
          <RichTextEditor
              id="rte-goals"
              placeholder="What does your character want to achieve?"
              value={richTextValue.goals}
              style={{ padding: '5px' }}
              onChange={val => handleRichTextChange('goals', val)}
          />
  
          <Text fz="lg" color="dimmed">
              <FontAwesomeIcon icon={faMask} /> Description
          </Text>
          <RichTextEditor
              id="rte-description"
              placeholder="What does your character look like?"
              value={richTextValue.description}
              style={{ padding: '5px' }}
              onChange={val => handleRichTextChange('description', val)}
          />
  
            </Alert>
            </Center>
  
    )
}

export default MageBackground