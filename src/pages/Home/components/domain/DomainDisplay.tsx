import { Card, Text, Button } from "@mantine/core"
import { globals } from "../../../../assets/globals"
import domains from "./data/domains.json"

export const domainCard = (userData: any) => {

    const domain = domains.find((domain) => domain.id === userData.domain)

    if (domain) {
    return (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text fz={globals.largeFontSize} mb={"lg"}>Domain</Text>
                <Text fz={globals.smallerFontSize}>Name: {domain.name}</Text>
                <Text fz={globals.smallerFontSize}>Coordinator: {domain.coordinator.email}</Text>
                {domain.links?.facebook?<Button variant='link' onClick={() => window.open(domain.links.facebook)}>Facebook</Button>:<></>}
                {domain.links?.discord?<Button variant='link' onClick={() => window.open(domain.links.discord)}>Discord</Button>:<></>}
                {domain.links?.website?<Button variant='link' onClick={() => window.open(domain.links.website)}>Website</Button>:<></>}
            </Card>
    )
    } else {
        return <></>
    }
}