import { haversineDistance } from "./distance";

export type CharityCenter = {
    name: string;
    latitude: number;
    longitude: number;
}

// Define the return type for the function
interface LatLong {
    latitude: number;
    longitude: number;
}

// return latitude and longitude in the object format
export const getLatLong = async (address: string): Promise<LatLong | null> => {
    const baseUrl = 'https://nominatim.openstreetmap.org/search';
    const params = new URLSearchParams({
        q: address,
        format: 'json',
        addressdetails: '1',
        limit: '1' // Limit to one result
    });

    try {
        const response = await fetch(`${baseUrl}?${params}`);
        if (!response.ok) {
            console.log(`Error fetching data for the first time: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.length > 0) {
            const { lat, lon } = data[0]; // Get latitude and longitude from the first result
            return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
            console.log("Location for ", address, " is ", { latitude: parseFloat(lat), longitude: parseFloat(lon) });
        } else {
            console.log('No results found for the first address.');
            console.log(`Retrying...`);
            const fallbackAddress = getFallbackAddress(address);
            const fallbackUrl = 'https://nominatim.openstreetmap.org/search';
            const fallbackParams = new URLSearchParams({
                q: fallbackAddress,
                format: 'json',
                addressdetails: '1',
                limit: '1' // Limit to one result
            });
            const fallbackResponse = await fetch(`${fallbackUrl}?${fallbackParams}`);
            if (!fallbackResponse.ok) {
                console.log(`Error fetching data for the second time: ${fallbackResponse.statusText}`);
            }
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.length > 0) {
                const { lat, lon } = fallbackData[0]; // Get latitude and longitude from the first result
                return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
            } else {
                console.log('No results found for the fallback address.');
                return null; // Return null if no results are found
            }
        }
    } catch (error) {
        console.error(error);
        return null; // Return null in case of an error
    }
}

// Function to extract the last three parts of the address
const getFallbackAddress = (address: string): string => {
    const parts = address.split(',').map(part => part.trim()).filter(part => part); // Split by comma and trim
    const fallbackParts = parts.slice(-3); // Get the last three parts
    return fallbackParts.join(', '); // Join them back into a string
};

export const getTopKNearestCharities = (
    charityCenters: any[], 
    userLocation: {latitude: number; longitude: number }, 
    topN: number
) => {
    const distances = charityCenters.map((center) => ({
        ...center,
        distance: haversineDistance(
          userLocation.latitude,
          userLocation.longitude,
          center.latitude,
          center.longitude
        ),
    }));

    return distances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, topN)
        // .map((center) => center.name);
}

