import * as Location from 'expo-location';

export const reverseGeocodeAsync = async (lat: number, lon: number): Promise<string> => {
  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
    return `${place.name}, ${place.city}, ${place.region}`;
  } catch (error) {
    console.error('Geocoding error:', error);
    return 'Unknown Location';
  }
};
