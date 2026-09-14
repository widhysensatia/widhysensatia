import Image from "next/image";
import Link from "next/link";

type Props = {
  active?: "directory" | "domains";
  contextLabel: string;
  documentCount?: number;
};

export function SiteHeader({
  active,
  contextLabel,
  documentCount = 12,
}: Props) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand" aria-label="Sensatia Knowledge Library home">
          <Image
            className="sensatia-wordmark"
            src="/sensatia-logo.svg"
            alt="Sensatia"
            width={172}
            height={40}
            priority
          />
          <span className="site-brand-divider" />
          <span className="site-product-name">
            <strong>Knowledge Library</strong>
            <small>Internal workspace</small>
          </span>
        </Link>

        <nav className="site-primary-nav" aria-label="Navigasi utama">
          <Link
            href="/#directory-heading"
            className={active === "directory" ? "active" : ""}
          >
            <span>01</span> Directory
          </Link>
          <Link
            href="/#domain-heading"
            className={active === "domains" ? "active" : ""}
          >
            <span>02</span> Domains
          </Link>
        </nav>

        <div className="site-header-context">
          <div>
            <small>Now viewing</small>
            <strong>{contextLabel}</strong>
          </div>
          <span className="site-header-count">
            <strong>{String(documentCount).padStart(2, "0")}</strong>
            <small>docs</small>
          </span>
        </div>
      </div>
    </header>
  );
}
