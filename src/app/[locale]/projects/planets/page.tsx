"use client";

import dynamic from "next/dynamic";

// Dynamically import Planets component to prevent SSR issues with p5.js
const Planets = dynamic(
  () =>
    import("@/modules/Planets/Planets").then((mod) => ({
      default: mod.Planets,
    })),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: "100%", height: "100%", minHeight: "400px" }} />
    ),
  }
);

export default function PlanetsPage() {
  return (
    <div style={{ position: "absolute", inset: 0, minHeight: "400px" }}>
      <Planets controls />
    </div>
  );
}
