import { Planets } from "@/modules/Planets/Planets";

export default function PlanetsPage() {
  return (
    <div style={{ position: "absolute", inset: 0, minHeight: "400px" }}>
      <Planets controls />
    </div>
  );
}
