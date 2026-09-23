import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";

export type OriginalPageScript = {
  code: string;
  src?: string;
  type?: string;
};

export type OriginalPage = {
  body: string;
  bodyAttributes: Record<string, string>;
  htmlAttributes: Record<string, string>;
  scripts: OriginalPageScript[];
  styles: string;
};

const sourceFiles: Record<string, string> = {
  "b2b-smart-order-intake": "2026-09-11-batch-01/b2b-smart-order-intake.html",
  "bali-ecommerce-fulfillment-presentation": "2026-09-11-batch-01/bali_ecommerce_presentation.html",
  "bali-ecommerce-shared-stock-model": "2026-09-11-batch-01/bali_ecommerce_shared_stock_model.html",
  "guanta-ai-pr-po-stockwizz-analysis": "2026-09-23-batch-08/guanta_ai_pr_po_stockwizz_analysis.html",
  "google-review-qr-rollout-guide": "2026-09-14-batch-02/google_review_qr_ask_for_reviews_guide_updated.html",
  "michael-widhy-meeting-brief": "2026-09-11-batch-01/preview.html",
  "project-phoenix-weekly-handover-2026-09-23": "2026-09-22-batch-07/project_phoenix_weekly_handover_2026-09-23.html",
  "putu-mei-accounting-meeting-pack-2026-09-21": "2026-09-20-batch-06/putu_mei_accounting_meeting_pack_2026-09-21_v2.html",
  "putu-mei-accounting-meeting-notes-2026-09-21": "2026-09-22-batch-07/meeting_notes_putu_mei_2026-09-21.html",
  "putu-mei-stockwizz-three-feature-blueprint": "2026-09-22-batch-07/perancangan_3_feature_putu_mei_stockwizz_visual.html",
  "project-phoenix-dctp-guide": "2026-09-15-batch-03/project_phoenix_dctp_guide.html",
  "sensatia-weekly-meeting-brief-2026-09-17": "2026-09-16-batch-05/sensatia_weekly_meeting_brief_2026-09-17_v7.html",
  "sensatia-weekly-meeting-presentation-2026-09-17": "2026-09-16-batch-05/sensatia_weekly_meeting_presentation_2026-09-17_v2.html",
  "sensatia-systems-handover-master-blueprint": "2026-09-11-batch-01/preview (3).html",
  "sensatia-systems-handover-technical-documentation": "2026-09-15-batch-03/sensatia_systems_handover.html",
  "stockwiz-comprehensive-system-audit": "2026-09-11-batch-01/stockwiz-comprehensive-system-audit.html",
  "stockwiz-documentation-portal": "2026-09-11-batch-01/index.html",
  "stockwiz-erp-architecture-audit": "2026-09-11-batch-01/stockwiz-erp-architecture-audit.html",
  "stockwiz-erp-business-process-module-blueprint": "2026-09-11-batch-01/stockwiz-erp-business-process-module-blueprint.html",
  "stockwiz-future-strategy-options": "2026-09-11-batch-01/stockwiz-future-strategy-options.html",
  "stockwiz-option-3-implementation-blueprint": "2026-09-11-batch-01/stockwiz-option-3-implementation-blueprint.html",
  "stockwiz-stabilization-remediation-playbook": "2026-09-11-batch-01/stockwiz-stabilization-remediation-playbook.html",
  "stockwizz-putu-mei-assessment": "2026-09-14-batch-02/stockwizz_putu_mei_assessment.html",
};

const projectPhoenixPortalSlug = "project-phoenix-command-center";
const projectPhoenixPortalRoot = "2026-09-15-batch-04/sensatia_project_phoenix_portal";

export const projectPhoenixPortalPages = [
  "index.html",
  "september-readiness.html",
  "dtar.html",
  "architecture.html",
  "inventory-flow.html",
  "integrations.html",
  "recovery.html",
  "risks-debt.html",
  "kt-tracker.html",
  "access-2fa.html",
  "evidence.html",
  "final-readiness.html",
] as const;

const routeByLegacyFile: Record<string, string> = Object.fromEntries(
  Object.entries(sourceFiles).map(([slug, filename]) => [
    path.basename(filename),
    `/docs/${slug}/`,
  ]),
);

const pageCache = new Map<string, OriginalPage>();

function parseAttributes(source = "") {
  const attributes: Record<string, string> = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source))) {
    attributes[match[1]] = match[2] ?? match[3] ?? match[4] ?? "";
  }

  return attributes;
}

function getAttribute(source: string, name: string) {
  const pattern = new RegExp(
    `${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  );
  const match = source.match(pattern);
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

function rewriteLegacyDocumentLinks(source: string) {
  let rewritten = source;

  for (const [filename, route] of Object.entries(routeByLegacyFile)) {
    rewritten = rewritten
      .replaceAll(`"${filename}`, `"${route}`)
      .replaceAll(`'${filename}`, `'${route}`);
  }

  return rewritten;
}

function getProjectPhoenixPortalRoute(filename: string) {
  if (filename === "index.html") return `/docs/${projectPhoenixPortalSlug}/`;
  return `/docs/${projectPhoenixPortalSlug}/${filename.replace(/\.html$/i, "")}/`;
}

function getProjectPhoenixPortalFilename(page?: string) {
  if (!page) return "index.html";
  const filename = `${path.basename(page).replace(/\.html$/i, "")}.html`;
  return projectPhoenixPortalPages.includes(filename as (typeof projectPhoenixPortalPages)[number])
    ? filename
    : undefined;
}

function getSourceFilename(slug: string, page?: string) {
  if (slug === projectPhoenixPortalSlug) {
    const filename = getProjectPhoenixPortalFilename(page);
    return filename ? `${projectPhoenixPortalRoot}/${filename}` : undefined;
  }

  return sourceFiles[slug];
}

function rewriteProjectPhoenixPortalLinks(source: string) {
  let rewritten = source;

  for (const filename of projectPhoenixPortalPages) {
    const route = getProjectPhoenixPortalRoute(filename);
    rewritten = rewritten
      .replaceAll(`"${filename}"`, `"${route}"`)
      .replaceAll(`'${filename}'`, `'${route}'`);
  }

  return rewritten
    .replaceAll(`"assets/`, `"/project-phoenix-command-center/assets/`)
    .replaceAll(`'assets/`, `'/project-phoenix-command-center/assets/`);
}

function getLinkedStyles(source: string, sourceDir: string) {
  return [...source.matchAll(/<link\b([^>]*)>/gi)]
    .map((match) => {
      const attributes = match[1];
      const rel = getAttribute(attributes, "rel");
      const href = getAttribute(attributes, "href");
      if (!href || rel?.toLocaleLowerCase() !== "stylesheet" || /^[a-z]+:\/\//i.test(href)) {
        return "";
      }

      return readFileSync(path.join(sourceDir, href), "utf8");
    })
    .join("\n");
}

export function getOriginalPage(slug: string, pageName?: string) {
  const cacheKey = pageName ? `${slug}/${pageName}` : slug;
  const cached = pageCache.get(cacheKey);
  if (cached) return cached;

  const filename = getSourceFilename(slug, pageName);
  if (!filename) return undefined;

  const sourcePath = path.join(process.cwd(), "inbox", filename);
  const sourceDir = path.dirname(sourcePath);
  const rawSource = readFileSync(sourcePath, "utf8");
  const source =
    slug === projectPhoenixPortalSlug
      ? rewriteProjectPhoenixPortalLinks(rawSource)
      : rewriteLegacyDocumentLinks(rawSource);
  const htmlMatch = source.match(/<html\b([^>]*)>/i);
  const bodyMatch = source.match(/<body\b([^>]*)>([\s\S]*?)<\/body\s*>/i);
  if (!bodyMatch) return undefined;

  const styles = [
    getLinkedStyles(rawSource, sourceDir),
    ...[...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)].map((match) => match[1]),
  ].join("\n");
  const scripts: OriginalPageScript[] = [];
  const body = bodyMatch[2].replace(
    /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi,
    (_tag, rawAttributes: string, code: string) => {
      const src = getAttribute(rawAttributes, "src");
      if (src && !src.startsWith("/") && !/^[a-z]+:\/\//i.test(src)) {
        scripts.push({
          code: readFileSync(path.join(sourceDir, src), "utf8"),
          type: getAttribute(rawAttributes, "type"),
        });
        return "";
      }

      scripts.push({
        code,
        src,
        type: getAttribute(rawAttributes, "type"),
      });
      return "";
    },
  );

  const page: OriginalPage = {
    body,
    bodyAttributes: parseAttributes(bodyMatch[1]),
    htmlAttributes: parseAttributes(htmlMatch?.[1]),
    scripts,
    styles,
  };
  pageCache.set(cacheKey, page);
  return page;
}
