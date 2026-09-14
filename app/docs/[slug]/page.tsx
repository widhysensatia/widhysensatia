import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { documents, getDocument } from "@/lib/documents";
import { getDocumentContent } from "@/lib/document-content";
import { NativeDocument } from "@/components/native-document";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return documents.map((document) => ({ slug: document.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = getDocument(slug);
  if (!document) return {};
  return { title: document.shortTitle, description: document.summary };
}

export default async function DocumentPage({ params }: PageProps) {
  const { slug } = await params;
  const document = getDocument(slug);
  const content = getDocumentContent(slug);
  
  if (!document || !content) notFound();

  return <NativeDocument document={document} content={content} />;
}
