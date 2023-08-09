import { Awakened } from "../data/Awakened";
import { OrderName, Orders, orderNameSchema } from "../data/Order";
import { globals } from "../../../globals";
import { Alert, Stack, Button, Modal, Card, Center, Grid, useMantineTheme, Image, Title, Text } from "@mantine/core";
import { useState } from "react";
import OrderSettings from "./utils/OrderSetting";

type OrderPickerProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    nextStep: () => void
    backStep: () => void
    showInstructions: boolean
    setShowInstructions: (showInstruction: boolean) => void
}

const OrderPicker = ({ awakened, setAwakened, nextStep, backStep, showInstructions, setShowInstructions}: OrderPickerProps) => {
    const theme = useMantineTheme()
    const [order, setOrder] = useState<OrderName>(awakened.order);


    const [modalOpen, setModalOpen] = useState(false);

    const c1 = "rgba(26, 27, 30, 0.90)"

    const handleCardClick = (order: OrderName) => {
        setOrder(order);
        setModalOpen(true);
      };

    const handleCloseModal = () => {
    setOrder('');
    setModalOpen(false);
    };

    const createOrderPicker = (order: OrderName, c2: string) => {
        const bgColor = theme.fn.linearGradient(0, c1, c2)

        return (
            <Grid.Col key={order} span={4}>
                <Card 
                    className="hoverCard" 
                    shadow="sm" 
                    padding="lg" 
                    radius="md"  
                    style={{ background: bgColor }}
                    onClick={() => handleCardClick(order)}
                >
                    <Card.Section>
                        <Center>
                            <Image
                                fit="contain"
                                withPlaceholder
                                src={Orders[order].logo}
                                height={250}
                                width={250}
                                alt="order"
                                style={{ filter: 'brightness(0)' }}
                            />
                        </Center>
                        <Center>
                            <Title h={30} size="sm" color="dimmed" ta="center">
                                {Orders[order].name}
                            </Title>
                        </Center>
                    </Card.Section>
                </Card>
            </Grid.Col>
        )
    }

     const getColorByOrder = (order: OrderName) => {
        return Orders[order].color; // Retrieve the color from the Order object
      }; 
    
      const isPhoneScreen = globals.isPhoneScreen
      const isSmallScreen = globals.isSmallScreen


      const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : undefined, paddingBottom: globals.isPhoneScreen ? '60px' : undefined}}>
            <Stack>
                <Center>
                    <Alert color="gray">
                    <Text mt={"xl"} ta="center" fz="xl" fw={700}>Orders</Text>
                    {showInstructions && (
                    <div>
                        <p>{`The `}
                        <strong>Orders</strong>
                        {` are social organizations of mages united by philosophy, cultural connection, and convenience. These groups find new mages, provide them with training, camaraderie, and initiate them into Awakened Society. The five core orders are allied into an organization known as the Pentacle.`}</p>
                        <p>{`Take a look at the options on offer and see what speaks to you.`}</p>
                    </div>
                    )}
                    <Center>
                        <Button variant="outline" color="gray" onClick={toggleInstructions}>
                            {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                        </Button>
                    </Center>
                    </Alert>
                </Center>
            <Grid grow m={0}>
                {
                    [  "The Adamantine Arrow", "The Free Council", "The Guardians of the Veil", "The Mysterium", "The Silver Ladder", "Apostate" ].map((o) => orderNameSchema.parse(o)).map((order) => createOrderPicker(order, getColorByOrder(order)))
                }
            </Grid>            

            {order && (
            <Modal
                title={Orders[order].name}
                opened={modalOpen}
                onClose={handleCloseModal}
                size={600}
                style={{ background: theme.fn.linearGradient(0, c1, Orders[order].color) }}
                >
                
                <div>
                <Center>
                <a href={Orders[order].link} target="_blank" rel="noopener noreferrer">
                <Image
                    src={Orders[order].cover}
                    height={400}
                    width={300}
                    alt="order"
                    style={{ float: "none", margin: "5px" }}
                />
                </a>
                </Center>
                <Text style={{ textAlign: "left" }}>
                <div dangerouslySetInnerHTML={{ __html: Orders[order].description }} />
                </Text>
                </div>

                <Button
                    onClick={() => {
                        OrderSettings({awakened, setAwakened, order})
                        setAwakened({...awakened, order: order, merits: []})
                        nextStep()
                }}
                >Confirm Order</Button>
            </Modal>
            )}
                <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%"}}>
                <Alert color="dark" variant="filled" radius="xs" style={{padding:"0px"}}>
                        <Button
                            style={{ margin: "5px" }}
                            color="gray"
                            onClick={backStep}
                        >
                            Back
                        </Button>
                    </Alert>
                </Button.Group>
                </Stack>
        </Center>
    )

}

export default OrderPicker