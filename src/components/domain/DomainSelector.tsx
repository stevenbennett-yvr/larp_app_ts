import { Modal, Select, Button } from "@mantine/core"
import { useState } from 'react'
import { MapComponent, getGeolocation, parseLocation } from "./components/MapComponent"
import { useUser } from "../../contexts/UserContext"
import { useAuth } from "../../contexts/AuthContext"
import domains from './data/domains.json'

type DomainSelectorProps = {
    showDomainSelector: boolean,
    setShowDomainSelector: (showDomainSelector:boolean) => void,
    userData: any
}

const DomainSelector = ({showDomainSelector, setShowDomainSelector, userData}: DomainSelectorProps) => {
    const [selectedCoordinates, setSelectedCoordinates] = useState({ lat: 49.2827, lng: -123.1207 });
    const [selectedDomain, setSelectedDomain] = useState('Nova Albion');
    const [selectedDomainId, setSelectedDomainId] = useState('CND-001');

    const { getUser, updateUser } = useUser()
    const { currentUser } = useAuth()

    const handleDomainChange = async (value: any) => {
        const selectedDomain = value;
        const domain = domains.find((domain) => domain.name === selectedDomain)

        if (domain && domain.location) {
            const { city, province } = parseLocation(domain.location);
            const coordinates = await getGeolocation(city, province);

            if (coordinates) {
                setSelectedDomain(selectedDomain)
                setSelectedDomainId(domain.id)
                setSelectedCoordinates({
                    lat: coordinates.lat,
                    lng: coordinates.lng
                })
            }
        }
    }

    const selectData = domains.map((domain) => ({
        value: `${domain.name}`,
        label: `${domain.name}`
    }))
    
    const handleDomainConfirm = async () => {
        try {
          let updatedUser = null;
          if (!userData) {
            const fetchedUserData = await getUser();
            if (fetchedUserData) {
              updatedUser = {
                ...fetchedUserData,
                domain: selectedDomainId
              };
            } else {
              // Handle case when userData is not available
              console.log('User data not found');
              return;
            }
          } else {
            updatedUser = {
              ...userData,
              domain: selectedDomainId
            };
          }
          if (currentUser) {
            console.log(updatedUser)
          await updateUser(currentUser.uid, updatedUser);
          setShowDomainSelector(false);
          localStorage.removeItem("userData")
          window.location.reload();
        } else {
            console.log("User is not authenticated")
        }
    } catch (error) {
        console.error(error);
        // Handle the error as needed
        }
    };

    return(
        <Modal opened={showDomainSelector} onClose={() => setShowDomainSelector(false)}>
            <Modal.Title>
                Select Domain
            </Modal.Title>
            <Modal.Body>
                <Select 
                    data={selectData} 
                    value={selectedDomain}
                    searchable
                    nothingFound="Nothing Found"
                    onChange={(value) => handleDomainChange(value)}>
                </Select>
                <MapComponent center={selectedCoordinates}/>
            </Modal.Body>
            <Button onClick={handleDomainConfirm}>
                Confirm
            </Button>
        </Modal>
    )
}

export default DomainSelector