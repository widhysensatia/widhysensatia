import { KnowledgeHub } from "@/components/knowledge-hub";
import { documents } from "@/lib/documents";

export default function HomePage() {
  return <KnowledgeHub documents={documents} />;
}
