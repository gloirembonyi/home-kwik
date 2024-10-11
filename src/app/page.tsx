"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (window) {
      window.location.href = "/login";
    }
  }, []);
  return <></>;
}
