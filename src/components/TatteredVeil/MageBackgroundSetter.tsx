//Technical Imports
import { Center, Alert, Text } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faList, faMask } from '@fortawesome/free-solid-svg-icons'
import { Awakened } from '../../data/TatteredVeil/types/Awakened'

import { TipTapRTE } from '../TipTapRTE'
//import { getEmptyAwakened } from '../../data/TatteredVeil/types/Awakened'

type MageBackgroundProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
}

const MageBackground = ({ awakened, setAwakened }: MageBackgroundProps) => {
    // Define a function to update a specific editor's content

    return (
        <Center>
            <Alert color="gray" title="ST Info" style={{maxWidth:"700px"}}>
                <Text fz="lg" color="dimmed">
                    <FontAwesomeIcon icon={faBookOpen} /> History
                </Text>
                {awakened.name !== "" ? <TipTapRTE html={awakened.background.history} setHTML={(val) => setAwakened({
                    ...awakened,
                    background: {
                        ...awakened.background,
                        history: val,
                    },
                })} /> : <></>}
                <Text fz="lg" color="dimmed">
                    <FontAwesomeIcon icon={faList} /> Goals
                </Text>
                {awakened.name !== "" ? <TipTapRTE html={awakened.background.goals} setHTML={(val) => setAwakened({
                    ...awakened,
                    background: {
                        ...awakened.background,
                        goals: val,
                    },
                })} /> : <></>}
                <Text fz="lg" color="dimmed">
                    <FontAwesomeIcon icon={faMask} /> Description
                </Text>
                {awakened.name !== "" ? <TipTapRTE html={awakened.background.description} setHTML={(val) => setAwakened({
                    ...awakened,
                    background: {
                        ...awakened.background,
                        description: val,
                    },
                })} /> : <></>}
            </Alert>
        </Center>
    );
};

export default MageBackground