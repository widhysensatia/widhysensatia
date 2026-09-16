import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OriginalPageRuntime } from "@/components/original-page-runtime";
import { getDocument } from "@/lib/documents";
import { getOriginalPage, projectPhoenixPortalPages } from "@/lib/original-pages";

type PageProps = { params: Promise<{ slug: string; page: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projectPhoenixPortalPages
    .filter((page) => page !== "index.html")
    .map((page) => ({
      slug: "project-phoenix-command-center",
      page: page.replace(/\.html$/i, ""),
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, page } = await params;
  const document = getDocument(slug);
  if (!document || slug !== "project-phoenix-command-center") return {};

  const titlePage = page
    .split("-")
    .map((part) => part.charAt(0).toLocaleUpperCase("id") + part.slice(1))
    .join(" ");

  return {
    title: `${titlePage} · ${document.shortTitle}`,
    description: document.summary,
  };
}

export default async function DocumentSubPage({ params }: PageProps) {
  const { slug, page } = await params;
  const document = getDocument(slug);
  const originalPage = getOriginalPage(slug, page);
  if (!document || slug !== "project-phoenix-command-center" || !originalPage) notFound();

  const runtimeSlug = `${slug}-${page}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: originalPage.styles }} />
      <div
        data-original-document={runtimeSlug}
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: originalPage.body }}
      />
      <OriginalPageRuntime
        bodyAttributes={originalPage.bodyAttributes}
        htmlAttributes={originalPage.htmlAttributes}
        scripts={originalPage.scripts}
        slug={runtimeSlug}
      />
    </>
  );
}
