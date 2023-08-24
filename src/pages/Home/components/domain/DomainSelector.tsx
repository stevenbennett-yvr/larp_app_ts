import { Modal, Select, Button } from "@mantine/core"
import { useState } from 'react'
import { MapComponent, getGeolocation, parseLocation } from "./components/MapComponent"
import { useUser } from "../../../../contexts/UserContext"
import { useAuth } from "../../../../contexts/AuthContext"
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

    const activeDomains = domains.filter((domain) => domain.status === "active");

    const selectData = activeDomains.map((domain) => ({
        value: domain.name,
        label: domain.name
    }));
    
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

    // Extra showDomainSelector is just to make sure I'm not overcharged for the map component.
    return(
    <Modal opened={showDomainSelector} onClose={() => setShowDomainSelector(false)}>
      <Modal.Title style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}>
        Choose Domain
      </Modal.Title>
      <Modal.Body>
        <div style={{ marginBottom: '15px', fontSize: '16px' }}>
          Domains are local chapters of the Canada at Midnight club. Below is the list of all active domains, choose the one nearest you to see what games are available there.
        </div>
        <div style={{ marginBottom: '15px', fontSize: '16px' }}>
          If you do not have any domains in your area, you can join the Northern Winds Virtual Domain, or you can organize your own domain.
        </div>
        <div style={{ marginBottom: '15px' }}>
          <Button
            variant="link"
            onClick={() => window.open("https://docs.google.com/document/d/1gY629DxclYA_rREYa4vWzqHFdEvXm--pOmNSJIoDpFI/edit?usp=sharing")}
            style={{ fontSize: '16px', color: '#007BFF' }}
          >
            To organize a domain,
            click here.
          </Button>
        </div>
        <Select
          data={selectData}
          value={selectedDomain}
          searchable
          nothingFound="Nothing Found"
          style={{ marginBottom: '15px' }}
          onChange={(value) => handleDomainChange(value)}
        />
        {showDomainSelector ? <MapComponent center={selectedCoordinates} /> : <></>}
      </Modal.Body>
      <Button onClick={handleDomainConfirm} variant="outline">
        Confirm
      </Button>
    </Modal>
    )
}

export default DomainSelector