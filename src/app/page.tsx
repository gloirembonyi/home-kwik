"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    
    if (window ) {
      window.location.href = "/login";
    }
  }, []);
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  return <></>;
}
