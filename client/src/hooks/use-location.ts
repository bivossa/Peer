import { useState, useEffect } from "react";

interface UserLocation {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "L'utente ha negato la richiesta di geolocalizzazione.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Le informazioni sulla posizione non sono disponibili.";
              break;
            case error.TIMEOUT:
              errorMessage = "La richiesta di posizione è scaduta.";
              break;
            default:
              errorMessage = "Si è verificato un errore nella geolocalizzazione.";
          }
          setLocationError(errorMessage);
          setIsLoading(false);
          
          // Fallback to a default location (Milan, Italy)
          setUserLocation({
            latitude: 45.4642,
            longitude: 9.1900,
          });
        }
      );
    } else {
      setLocationError("La geolocalizzazione non è supportata dal tuo browser.");
      setIsLoading(false);
      
      // Fallback to a default location (Milan, Italy)
      setUserLocation({
        latitude: 45.4642,
        longitude: 9.1900,
      });
    }
  }, []);

  return { userLocation, locationError, isLoading };
}
