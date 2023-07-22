import { Awakened } from "../data/Awakened";
import { OrderName, Orders, orderNameSchema } from "../data/Order";
import { globals } from "../../../globals";
import { Stack, Button, Modal, Card, Center, Grid, useMantineTheme, Image, Title, Text } from "@mantine/core";
import { useState } from "react";
import OrderSettings from "./utils/OrderSetting";

type OrderPickerProps = {
    awakened: Awakened,
    setAwakened: (awakened: Awakened) => void
    nextStep: () => void
    backStep: () => void
}

const OrderPicker = ({ awakened, setAwakened, nextStep, backStep}: OrderPickerProps) => {
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

    return (
        <Center style={{ paddingTop: globals.isPhoneScreen ? '100px' : undefined, paddingBottom: globals.isPhoneScreen ? '60px' : undefined}}>
            <Stack>
                <Center>
                    <Text fz={"30px"} ta={"center"}>Pick your <b>Order</b></Text>
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
                        setAwakened({...awakened, order})
                        nextStep()
                }}
                >Confirm Order</Button>
            </Modal>
            )}
                <Button.Group style={{ position: "fixed", bottom: "0px", left: isPhoneScreen ? "0px" : isSmallScreen? "15%" : "30%"}}>
                    <Button
                        style={{ margin: "5px" }}
                        color="gray"
                        onClick={backStep}
                    >
                        Back
                    </Button>
                </Button.Group>
                </Stack>
        </Center>
    )

}

export default OrderPicker