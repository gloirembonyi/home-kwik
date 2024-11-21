//components/providers/MapProvider.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        strategy="beforeInteractive"
        onLoad={() => setIsMapLoaded(true)}
      />
      {isMapLoaded ? children : <div>Loading map...</div>}
    </>
  );
}