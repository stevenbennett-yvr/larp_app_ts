import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import axios from 'axios';

type LatLng = {
  lat: number;
  lng: number;
};

type MapComponentProps = {
  center: LatLng
}

const MapComponent = ({ center }: MapComponentProps) => {
  
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '300px',
    zIndex: 1,
  };
  
    const mapOptions = {
      styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
      ],
      disableDefaultUI: true, // Disable default UI controls
      clickableIcons: false, // Disable clickable icons
      draggableCursor: 'default' // Set default cursor
    };

    return (
      <LoadScript googleMapsApiKey="AIzaSyCG2ZgFb_E21MuCn6A8J9WxcX_6AOLC66k">
        <GoogleMap 
          mapContainerStyle={containerStyle} 
          center={center} 
          zoom={10}
          options={mapOptions}
          >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    );
  };
  
  MapComponent.propTypes = {
    center: PropTypes.any,
    onLoad: PropTypes.any,
  };
  
const getGeolocation = async (city: any, province: any) => {
    const apiKey = 'AIzaSyCG2ZgFb_E21MuCn6A8J9WxcX_6AOLC66k';
    const address = `${city}, ${province}`;
  
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
  
      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      }
    } catch (error) {
      console.error('Error occurred during geocoding:', error);
    }
  
    return null;
  };


  const parseLocation = (location: string) => {
    const [city, province] = location.split(',').map((part) => part.trim());
    return { city, province };
  };

  const calculateDistance = (coord1: LatLng, coord2: LatLng) => {
    const { lat: lat1, lng: lng1 } = coord1;
    const { lat: lat2, lng: lng2 } = coord2;
  
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
  
    return distance;
  };
  
  const toRadians = (degrees: number) => {
    return (degrees * Math.PI) / 180;
  };


  
  export { MapComponent,  getGeolocation, parseLocation, calculateDistance};