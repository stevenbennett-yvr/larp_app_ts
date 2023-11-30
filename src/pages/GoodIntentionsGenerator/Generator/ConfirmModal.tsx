import { Modal, Button } from "@mantine/core"
import { Kindred } from "../../../data/GoodIntentions/types/Kindred"

type confirmModalProps = {
    kindred: Kindred,
    showRetire: boolean,
    setShowRetire: (showRetire: boolean) => void
    handleSubmit: () => void,

}

const ConfirmModal = ({ showRetire, setShowRetire, handleSubmit}:confirmModalProps) => {

    return(
        <Modal opened={showRetire} onClose={() => setShowRetire(false)}>
            <Modal.Header>
                <Modal.Title>
                    WARNING
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Note after submission you will not be able to change or reallocate your creation points. Ensure you character is set how you want before submission.</p>

                <Button onClick={handleSubmit}>
                    Submit Character
                </Button>
            </Modal.Body>

        </Modal>
    )

}

export default ConfirmModal