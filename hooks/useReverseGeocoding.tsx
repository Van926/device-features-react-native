import { useState } from 'react';
import { Platform } from 'react-native';
import Geocoder from 'react-native-geocoding';


Geocoder.init('YOUR_GOOGLE_MAPS_API_KEY');

const useReverseGeocoding = () => {
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await Geocoder.from(latitude, longitude);
      const firstResult = response.results[0];
      const formattedAddress = firstResult.formatted_address;

      setAddress(formattedAddress);
      return formattedAddress;
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Failed to get address. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { address, isLoading, error, getAddressFromCoords };
};

export default useReverseGeocoding;