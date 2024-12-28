import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define a custom icon
const customIcon = L.icon({
    iconUrl: '/images/location.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [-3, -76],
});

interface MapProps {
    locationText: string;
}

export default function Map({ locationText }: MapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const [marker, setMarker] = useState<L.Marker | null>(null);

    useEffect(() => {
        // Function to initialize the map
        const initializeMap = async () => {
            try {
                // Check if the map is already initialized
                if (!mapRef.current) {
                    // Create the map instance
                    mapRef.current = L.map('map').setView([0, 0], 13); // Default location
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    }).addTo(mapRef.current);
                }

                // Fetch the geocode data
                const geocodeResponse = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}`
                );
                const geocodeData = await geocodeResponse.json();

                if (geocodeData.length > 0) {
                    const { lat, lon } = geocodeData[0];
                    const latitude = parseFloat(lat);
                    const longitude = parseFloat(lon);

                    // Update the map view and marker
                    mapRef.current.setView([latitude, longitude], 13);

                    if (marker) {
                        // Update existing marker
                        marker.setLatLng([latitude, longitude]).bindPopup(`Location: ${locationText}`).openPopup();
                    } else {
                        // Add a new marker
                        const newMarker = L.marker([latitude, longitude], { icon: customIcon })
                            .addTo(mapRef.current)
                            .bindPopup(`Location: ${locationText}`)
                            .openPopup();
                        setMarker(newMarker);
                    }
                } else {
                    alert('Location not found');
                }
            } catch (error) {
                console.error('Error fetching or geocoding location:', error);
            }
        };

        initializeMap();

        return () => {
            // Cleanup on unmount
            if (mapRef.current) {
                mapRef.current.off();
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [locationText]);

    return (
        <div
            id="map"
            style={{
                width: '100%',
                height: '300px',
            }}
        />
    );
}
