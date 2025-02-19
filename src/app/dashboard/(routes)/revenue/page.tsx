"use client";

import dynamic from "next/dynamic";

const RevenuePage = dynamic(
  () => import("@/components/dashboard/Revenue/page"),
  { ssr: false }
);

export default function Revenue() {
  return <RevenuePage />;
}
