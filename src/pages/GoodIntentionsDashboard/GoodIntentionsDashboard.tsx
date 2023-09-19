import { Center, Stack, Card, Button, Avatar, Text } from "@mantine/core"
import { DiscordLogo } from "../../assets/images/CaM"
import SoftCoverV5 from '../../assets/images/GoodIntentions/core/Soft_Cover_3d__88604.png'

export default function GoodIntentionsDashboard() {

    return (
        <Center h={"100%"}>
            <Card>
                <Stack>
                    <Center>
                        <Text>This is under construction.</Text>
                    </Center>
                    <Center>
                        <Text>See the book and Discord group for more information...</Text>
                    </Center>
                    <Center>
                        <a href="https://bynightstudios.com/products/laws-of-the-night-v5-pdf-pre-order.html" target="_blank" rel="noopener noreferrer">
                            <img width={200} src={SoftCoverV5} alt="Laws of the Night v5" />
                        </a>
                    </Center>

                    <Button variant='link' onClick={() => window.open('https://discord.gg/rvGtygKkyq')}>
                        <Avatar radius="xs" size="sm" src={DiscordLogo} /> Discord
                    </Button>
                </Stack>
            </Card>
        </Center>
    )
}
