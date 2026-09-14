"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { categories, type DocumentCategory, type KnowledgeDocument } from "@/lib/documents";
import { domains, getDomainDocumentCount } from "@/lib/domains";
import {
  ArrowIcon,
  ClockIcon,
  FileIcon,
  FolderIcon,
  SearchIcon,
} from "@/components/icons";
import { SiteHeader } from "@/components/site-header";

type Props = { documents: KnowledgeDocument[] };

export function KnowledgeHub({ documents }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("Semua");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase("id"));

  const sortedDocuments = useMemo(
    () => [...documents].sort((a, b) => b.updated.localeCompare(a.updated)),
    [documents],
  );

  const filteredDocuments = useMemo(() => {
    return sortedDocuments
      .filter(
        (document) =>
          activeCategory === "Semua" || document.category === activeCategory,
      )
      .filter((document) => {
        if (!deferredQuery) return true;
        const haystack = [
          document.title,
          document.summary,
          document.category,
          document.type,
          ...document.tags,
        ]
          .join(" ")
          .toLocaleLowerCase("id");
        return haystack.includes(deferredQuery);
      });
  }, [activeCategory, deferredQuery, sortedDocuments]);

  const categoryCount = (category: (typeof categories)[number]) =>
    category === "Semua"
      ? documents.length
      : documents.filter((document) => document.category === category).length;

  const latestDocument = sortedDocuments[0];
  const quickCategories: Array<{ category: DocumentCategory; label: string }> = [
    { category: "StockWiz", label: "StockWiz" },
    { category: "E-Commerce", label: "E-Commerce" },
    { category: "Meeting & Handover", label: "Meetings" },
    { category: "Ideas", label: "Ideas" },
  ];

  function browseCategory(category: DocumentCategory) {
    setActiveCategory(category);
    requestAnimationFrame(() => {
      document
        .getElementById("directory-heading")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="site-shell home-shell">
      <SiteHeader
        active="directory"
        contextLabel="Knowledge workspace"
        documentCount={documents.length}
      />

      <main className="main-content home-main">
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="landing-hero-copy">
            <p className="eyebrow">Sensatia internal knowledge</p>
            <h1 id="landing-title">
              Temukan konteks kerja.
              <br />
              Lanjutkan tanpa mengulang.
            </h1>
            <p>
              Satu workspace untuk analisis, keputusan, meeting notes, blueprint,
              dan ide yang terus berkembang.
            </p>
            <div className="landing-actions">
              <a className="landing-primary-action" href="#domain-heading">
                Jelajahi domain <ArrowIcon />
              </a>
              <a className="landing-secondary-action" href="#directory-heading">
                Cari dokumen
              </a>
            </div>
          </div>

          {latestDocument && (
            <a
              className={`latest-document accent-${latestDocument.accent}`}
              href={`/docs/${latestDocument.slug}/`}
            >
              <div className="latest-document-topline">
                <span>Terbaru</span>
                <span><ClockIcon /> {latestDocument.updatedLabel}</span>
              </div>
              <div className="latest-document-icon"><FileIcon /></div>
              <p>{latestDocument.category} · {latestDocument.type}</p>
              <h2>{latestDocument.shortTitle}</h2>
              <span className="latest-document-summary">{latestDocument.summary}</span>
              <span className="latest-document-link">
                Buka dokumen <ArrowIcon />
              </span>
            </a>
          )}
        </section>

        <nav className="knowledge-stats" aria-label="Ringkasan kategori">
          <div className="knowledge-total">
            <span>Library</span>
            <strong>{String(documents.length).padStart(2, "0")}</strong>
            <small>dokumen aktif</small>
          </div>
          {quickCategories.map(({ category, label }, index) => (
            <button
              type="button"
              onClick={() => browseCategory(category)}
              key={category}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
              <small>{categoryCount(category)} dokumen</small>
              <ArrowIcon />
            </button>
          ))}
        </nav>

        <section className="home-domain-section" aria-labelledby="domain-heading">
          <div className="home-section-heading">
            <div>
              <p className="section-kicker">Knowledge map</p>
              <h2 id="domain-heading">Mulai dari domain kerja</h2>
            </div>
            <p>
              Pilih area besar untuk melihat topik turunan dan dokumen yang saling
              terhubung.
            </p>
          </div>

          <div className="home-domain-grid">
            {domains.map((domain) => (
              <Link
                className={`home-domain-card accent-${domain.accent}`}
                href={`/domains/${domain.slug}/`}
                key={domain.slug}
              >
                <div className="home-domain-topline">
                  <span className="home-domain-number">{domain.number}</span>
                  <span className="home-domain-icon"><FolderIcon /></span>
                </div>
                <div className="home-domain-copy">
                  <p>{domain.shortTitle}</p>
                  <h3>{domain.title}</h3>
                  <span>{domain.description}</span>
                </div>
                <div className="home-domain-children">
                  {domain.children.slice(0, 4).map((child) => (
                    <span key={child.name}>{child.name}</span>
                  ))}
                  {domain.children.length > 4 && (
                    <span>+{domain.children.length - 4} lainnya</span>
                  )}
                </div>
                <div className="home-domain-footer">
                  <span>
                    <strong>{String(domain.children.length).padStart(2, "0")}</strong>
                    child domain
                  </span>
                  <span>
                    <strong>{String(getDomainDocumentCount(domain)).padStart(2, "0")}</strong>
                    dokumen
                  </span>
                  <span className="home-domain-open"><ArrowIcon /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          className="directory-section home-directory-section"
          aria-labelledby="directory-heading"
        >
          <div className="home-section-heading directory-heading-row">
            <div>
              <p className="section-kicker">Document library</p>
              <h2 id="directory-heading">
                {activeCategory === "Semua" ? "Semua dokumen" : activeCategory}
              </h2>
            </div>
            <p><strong>{filteredDocuments.length}</strong> dokumen ditemukan</p>
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
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Hapus pencarian"
                >×</button>
              )}
            </label>
          </div>

          {filteredDocuments.length > 0 ? (
            <div className="document-grid">
              {filteredDocuments.map((document, index) => (
                <article
                  className={`document-card accent-${document.accent}`}
                  key={document.slug}
                >
                  <div className="card-topline">
                    <span className="document-type">{document.type}</span>
                    <span className="card-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("Semua");
                }}
              >Reset pencarian</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
