import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon, BackIcon, FileIcon } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { documents, getDocument, type KnowledgeDocument } from "@/lib/documents";
import { domains, getDomain, getDomainDocumentCount } from "@/lib/domains";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return domains.map((domain) => ({ slug: domain.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const domain = getDomain(slug);
  if (!domain) return {};
  return { title: domain.title, description: domain.description };
}

export default async function DomainPage({ params }: PageProps) {
  const { slug } = await params;
  const domain = getDomain(slug);
  if (!domain) notFound();

  const childDomains = domain.children.map((child) => ({
    ...child,
    documents: child.documentSlugs
      .map(getDocument)
      .filter((document): document is KnowledgeDocument => Boolean(document)),
  }));

  return (
    <div className="site-shell domain-page">
      <SiteHeader
        active="domains"
        contextLabel={domain.shortTitle}
        documentCount={documents.length}
      />

      <main className="main-content domain-main">
        <section className={"domain-hero accent-" + domain.accent}>
          <Link href="/" className="domain-back"><BackIcon /> Semua domain</Link>
          <div className="domain-hero-layout">
            <div className="domain-hero-copy">
              <p className="eyebrow">Domain {domain.number}</p>
              <h1>{domain.title}</h1>
              <p>{domain.description}</p>
            </div>
            <div
              className="domain-hero-index"
              aria-label={domain.children.length + " child domain dan " + getDomainDocumentCount(domain) + " dokumen"}
            >
              <span className="domain-hero-number">{domain.number}</span>
              <div>
                <strong>{String(domain.children.length).padStart(2, "0")}</strong>
                <span>child domain</span>
              </div>
              <div>
                <strong>{String(getDomainDocumentCount(domain)).padStart(2, "0")}</strong>
                <span>dokumen</span>
              </div>
            </div>
          </div>
        </section>

        <section className="child-domain-section" aria-labelledby="child-domain-heading">
          <div className="child-domain-heading">
            <div>
              <p className="section-kicker">Domain index</p>
              <h2 id="child-domain-heading">Area di dalam {domain.shortTitle}</h2>
            </div>
            <p>Pilih dokumen langsung dari kelompok topik yang paling relevan.</p>
          </div>

          <div className="child-domain-grid">
            {childDomains.map((child, index) => (
              <article className={"child-domain-card accent-" + domain.accent} key={child.name}>
                <div className="child-card-topline">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{child.documents.length} dokumen</span>
                </div>
                <h3>{child.name}</h3>
                <p>{child.description}</p>
                <div className="child-document-list">
                  {child.documents.map((document) => (
                    <a href={"/docs/" + document.slug + "/"} key={document.slug}>
                      <span className="child-document-icon"><FileIcon /></span>
                      <span>
                        <small>{document.type}</small>
                        <strong>{document.shortTitle}</strong>
                      </span>
                      <ArrowIcon />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="domain-return">
          <p>Ingin melihat konteks dari area kerja lain?</p>
          <Link href="/"><BackIcon /> Kembali ke directory utama</Link>
        </div>
      </main>
    </div>
  );
}
