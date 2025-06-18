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
    // Forza sempre la posizione su Milano
    setUserLocation({
      latitude: 45.4642,
      longitude: 9.1900,
    });
    setIsLoading(false);
  }, []);

  // Fallback: se userLocation è ancora null e non stai caricando, restituisci Milano
  const location = userLocation || { latitude: 45.4642, longitude: 9.1900 };

  return { userLocation: location, locationError, isLoading };
}

