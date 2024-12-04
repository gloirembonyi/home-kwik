import React, { useEffect, useState, useCallback } from 'react';

// Improved Google Maps Script Loader Hook
const useGoogleMaps = (apiKey: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Prevent multiple script loads
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already in the doc
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true));
      existingScript.addEventListener('error', () => setLoadError('Failed to load Google Maps script'));
      return;
    }

    // load the Google Maps script
    const loadGoogleMapsScript = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          setIsLoaded(true);
          resolve();
        };

        script.onerror = () => {
          setLoadError('Failed to load Google Maps script');
          reject(new Error('Google Maps script load failed'));
        };

        document.head.appendChild(script);
      });
    };

    // Prevent multiple script loads
    loadGoogleMapsScript().catch(console.error);

    return () => {
      const script = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey]);

  return { isLoaded, loadError };
};

export default useGoogleMaps;