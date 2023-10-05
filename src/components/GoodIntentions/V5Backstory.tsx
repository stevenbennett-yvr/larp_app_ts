//Technical Imports
import { Center, Alert, Text } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faList, faMask } from '@fortawesome/free-solid-svg-icons'
import { Kindred } from '../../data/GoodIntentions/types/Kindred'

import { TipTapRTE } from '../TipTapRTE'

type MageBackgroundProps = {
    kindred: Kindred,
    setKindred: (kindred: Kindred) => void
}

const V5Backstory = ({ kindred, setKindred }: MageBackgroundProps) => {
    // Define a function to update a specific editor's content

    return (
        <Center>
            <Alert color="gray" style={{maxWidth:"700px"}}>
                <Text fz="lg" color="dimmed">
                    <FontAwesomeIcon icon={faBookOpen} /> History
                </Text>
                <TipTapRTE html={kindred.backstory.history} setHTML={(val) => setKindred({
                    ...kindred,
                    backstory: {
                        ...kindred.backstory,
                        history: val,
                    },
                })} />
                <Text fz="lg" color="dimmed">
                    <FontAwesomeIcon icon={faList} /> Goals
                </Text>
                <TipTapRTE html={kindred.backstory.goals} setHTML={(val) => setKindred({
                    ...kindred,
                    backstory: {
                        ...kindred.backstory,
                        goals: val,
                    },
                })} />
                <Text fz="lg" color="dimmed">
                    <FontAwesomeIcon icon={faMask} /> Description
                </Text>
                <TipTapRTE html={kindred.backstory.description} setHTML={(val) => setKindred({
                    ...kindred,
                    backstory: {
                        ...kindred.backstory,
                        description: val,
                    },
                })} />
            </Alert>
        </Center>
    );
};

export default V5Backstory