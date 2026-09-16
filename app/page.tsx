import { HomePasswordGate } from "@/components/home-password-gate";
import { documents } from "@/lib/documents";

export default function HomePage() {
  return <HomePasswordGate documents={documents} />;
}
