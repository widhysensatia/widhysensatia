"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { categories, type KnowledgeDocument } from "@/lib/documents";
import { domains, getDomainDocumentCount } from "@/lib/domains";
import { ArrowIcon, ClockIcon, FileIcon, SearchIcon } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";

type Props = { documents: KnowledgeDocument[] };

export function KnowledgeHub({ documents }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("Semua");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase("id"));

  const filteredDocuments = useMemo(() => {
    return documents
      .filter((document) => activeCategory === "Semua" || document.category === activeCategory)
      .filter((document) => {
        if (!deferredQuery) return true;
        const haystack = [document.title, document.summary, document.category, document.type, ...document.tags]
          .join(" ")
          .toLocaleLowerCase("id");
        return haystack.includes(deferredQuery);
      })
      .sort((a, b) => b.updated.localeCompare(a.updated));
  }, [activeCategory, deferredQuery, documents]);

  const categoryCount = (category: (typeof categories)[number]) =>
    category === "Semua" ? documents.length : documents.filter((document) => document.category === category).length;

  return (
    <div className="site-shell">
      <SiteHeader
        active="directory"
        contextLabel="All documents"
        documentCount={documents.length}
      />

      <main className="main-content">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Internal knowledge workspace</p>
            <h1>Catatan kerja yang<br />tetap terhubung.</h1>
            <p className="intro">Analisis, meeting brief, ide, dan blueprint—rapi, searchable, dan selalu mudah ditemukan kembali.</p>
          </div>
          <div className="hero-index" aria-label={`${documents.length} dokumen dalam 4 kategori`}>
            <div className="hero-total">
              <strong>{String(documents.length).padStart(2, "0")}</strong>
              <span>dokumen tersimpan</span>
            </div>
            <div className="hero-breakdown">
              <div><strong>{String(categoryCount("StockWiz")).padStart(2, "0")}</strong><span>StockWiz</span></div>
              <div><strong>{String(categoryCount("E-Commerce")).padStart(2, "0")}</strong><span>E-Commerce</span></div>
              <div><strong>{String(categoryCount("Meeting & Handover")).padStart(2, "0")}</strong><span>Handover</span></div>
              <div><strong>{String(categoryCount("Ideas")).padStart(2, "0")}</strong><span>Ideas</span></div>
            </div>
          </div>
        </section>

        <section className="directory-section" aria-labelledby="directory-heading">
          <div className="directory-heading-row">
            <div>
              <p className="section-kicker">Directory</p>
              <h2 id="directory-heading">{activeCategory === "Semua" ? "Semua dokumen" : activeCategory}</h2>
            </div>
            <p className="result-count"><strong>{filteredDocuments.length}</strong> dokumen ditemukan</p>
          </div>

          <div className="directory-controls">
            <nav className="category-chips" aria-label="Filter kategori">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? "active" : ""}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}<span>{categoryCount(category)}</span>
                </button>
              ))}
            </nav>
            <label className="search-field">
              <SearchIcon />
              <span className="sr-only">Cari dokumen</span>
              <input
                type="search"
                placeholder="Cari judul, topik, atau tag…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Hapus pencarian">×</button>}
            </label>
          </div>

          {filteredDocuments.length > 0 ? (
            <div className="document-grid">
              {filteredDocuments.map((document, index) => (
                <article className={`document-card accent-${document.accent}`} key={document.slug}>
                  <div className="card-topline">
                    <span className="document-type">{document.type}</span>
                    <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="document-icon"><FileIcon /></div>
                  <div className="card-copy">
                    <p className="document-category">{document.category}</p>
                    <h3><a href={`/docs/${document.slug}/`}>{document.shortTitle}</a></h3>
                    <p className="document-summary">{document.summary}</p>
                  </div>
                  <div className="tag-row">
                    {document.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="card-footer">
                    <span><ClockIcon /> {document.updatedLabel}</span>
                    <a href={`/docs/${document.slug}/`}>Buka <ArrowIcon /></a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <SearchIcon />
              <h3>Dokumen tidak ditemukan</h3>
              <p>Coba kata kunci lain atau kembali ke semua kategori.</p>
              <button type="button" onClick={() => { setQuery(""); setActiveCategory("Semua"); }}>Reset pencarian</button>
            </div>
          )}
        </section>

        <section className="domain-section" aria-labelledby="domain-heading">
          <div className="domain-heading-row">
            <div>
              <p className="section-kicker">Knowledge map</p>
              <h2 id="domain-heading">Jelajahi domain kerja</h2>
            </div>
            <p>
              Masuk lewat area besar, lalu temukan child domain dan dokumen yang saling berhubungan.
            </p>
          </div>

          <div className="domain-grid">
            {domains.map((domain) => (
              <Link
                className={"domain-card accent-" + domain.accent}
                href={"/domains/" + domain.slug + "/"}
                key={domain.slug}
              >
                <div className="domain-card-topline">
                  <span>{domain.number}</span>
                  <span className="domain-arrow"><ArrowIcon /></span>
                </div>
                <div className="domain-card-copy">
                  <p>{domain.shortTitle}</p>
                  <h3>{domain.title}</h3>
                  <span>{domain.description}</span>
                </div>
                <div className="domain-child-preview">
                  {domain.children.slice(0, 3).map((child) => (
                    <span key={child.name}>{child.name}</span>
                  ))}
                  {domain.children.length > 3 && <span>+{domain.children.length - 3} lainnya</span>}
                </div>
                <div className="domain-card-meta">
                  <span><strong>{String(domain.children.length).padStart(2, "0")}</strong> child domain</span>
                  <span><strong>{String(getDomainDocumentCount(domain)).padStart(2, "0")}</strong> dokumen</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
