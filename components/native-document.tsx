import Link from "next/link";
import { BackIcon, ClockIcon, FileIcon } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import type { KnowledgeDocument } from "@/lib/documents";
import type {
  DocumentContentBlock,
  NativeDocumentContent,
} from "@/lib/document-content";
import type { KnowledgeDomain } from "@/lib/domains";

type Props = {
  document: KnowledgeDocument;
  content: NativeDocumentContent;
  domain?: KnowledgeDomain;
};

function ContentBlock({ block }: { block: DocumentContentBlock }) {
  if (block.type === "heading") {
    if (block.level >= 4) return <h4>{block.text}</h4>;
    return <h3>{block.text}</h3>;
  }

  if (block.type === "paragraph") return <p>{block.text}</p>;
  if (block.type === "note") return <aside className="content-note">{block.text}</aside>;
  if (block.type === "quote") return <blockquote>{block.text}</blockquote>;
  if (block.type === "code") return <pre><code>{block.text}</code></pre>;

  if (block.type === "list") {
    const items = block.items.map((item, index) => <li key={index}>{item}</li>);
    return block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
  }

  return (
    <div className="content-table-wrap">
      <table>
        {block.headers.length > 0 && (
          <thead>
            <tr>{block.headers.map((header, index) => <th key={index}>{header}</th>)}</tr>
          </thead>
        )}
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function NativeDocument({ document, content, domain }: Props) {
  const blockCount = content.sections.reduce((total, section) => total + section.blocks.length, 0);

  return (
    <div className={"native-reader accent-" + document.accent}>
      <SiteHeader
        contextLabel={domain ? domain.shortTitle + " / " + document.type : document.type}
      />

      <main className="native-reader-main">
        <section className="native-document-hero">
          <div className="native-document-breadcrumb">
            <Link href="/">Directory</Link>
            <span>/</span>
            {domain && <Link href={"/domains/" + domain.slug + "/"}>{domain.shortTitle}</Link>}
            {domain && <span>/</span>}
            <span>{document.type}</span>
          </div>
          <div className="native-document-hero-layout">
            <div>
              <p className="native-document-kicker">{document.category} · {document.type}</p>
              <h1>{document.title}</h1>
              <p className="native-document-lead">{document.summary}</p>
              <div className="native-document-tags">
                {document.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
            <div className="native-document-facts">
              <span className="native-document-mark"><FileIcon /></span>
              <div><strong>{String(content.sections.length).padStart(2, "0")}</strong><span>bagian</span></div>
              <div><strong>{String(blockCount).padStart(2, "0")}</strong><span>blok konten</span></div>
              <div className="native-document-updated"><ClockIcon /><span>Diperbarui {document.updatedLabel}</span></div>
            </div>
          </div>
        </section>

        <div className="native-document-layout">
          <aside className="native-document-toc">
            <div>
              <p>Daftar isi</p>
              <nav aria-label="Daftar isi dokumen">
                {content.sections.map((section) => (
                  <a href={"#" + section.id} key={section.id}>
                    <span>{section.number}</span>{section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="native-document-content">
            {content.sections.map((section) => (
              <section id={section.id} className="native-content-section" key={section.id}>
                <div className="native-section-heading">
                  <span>{section.number}</span>
                  <h2>{section.title}</h2>
                </div>
                <div className="native-section-body">
                  {section.blocks.map((block, index) => (
                    <ContentBlock block={block} key={index} />
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>

        <footer className="native-document-footer">
          <div>
            <span>Selanjutnya</span>
            <strong>Jelajahi dokumen lain yang masih dalam konteks kerja yang sama.</strong>
          </div>
          {domain ? (
            <Link href={"/domains/" + domain.slug + "/"}><BackIcon /> Kembali ke {domain.shortTitle}</Link>
          ) : (
            <Link href="/"><BackIcon /> Kembali ke directory</Link>
          )}
        </footer>
      </main>
    </div>
  );
}
