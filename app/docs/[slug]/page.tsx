import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OriginalPageRuntime } from "@/components/original-page-runtime";
import { documents, getDocument } from "@/lib/documents";
import { getOriginalPage } from "@/lib/original-pages";

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
  const originalPage = getOriginalPage(slug);
  if (!document || !originalPage) notFound();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: originalPage.styles }} />
      <div
        data-original-document={slug}
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: originalPage.body }}
      />
      <OriginalPageRuntime
        bodyAttributes={originalPage.bodyAttributes}
        htmlAttributes={originalPage.htmlAttributes}
        scripts={originalPage.scripts}
        slug={slug}
      />
    </>
  );
}
