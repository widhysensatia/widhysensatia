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
  "michael-widhy-meeting-brief": "2026-09-11-batch-01/preview.html",
  "sensatia-systems-handover-master-blueprint": "2026-09-11-batch-01/preview (3).html",
  "stockwiz-comprehensive-system-audit": "2026-09-11-batch-01/stockwiz-comprehensive-system-audit.html",
  "stockwiz-documentation-portal": "2026-09-11-batch-01/index.html",
  "stockwiz-erp-architecture-audit": "2026-09-11-batch-01/stockwiz-erp-architecture-audit.html",
  "stockwiz-erp-business-process-module-blueprint": "2026-09-11-batch-01/stockwiz-erp-business-process-module-blueprint.html",
  "stockwiz-future-strategy-options": "2026-09-11-batch-01/stockwiz-future-strategy-options.html",
  "stockwiz-option-3-implementation-blueprint": "2026-09-11-batch-01/stockwiz-option-3-implementation-blueprint.html",
  "stockwiz-stabilization-remediation-playbook": "2026-09-11-batch-01/stockwiz-stabilization-remediation-playbook.html",
  "stockwizz-putu-mei-assessment": "2026-09-14-batch-02/stockwizz_putu_mei_assessment.html",
};

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

export function getOriginalPage(slug: string) {
  const cached = pageCache.get(slug);
  if (cached) return cached;

  const filename = sourceFiles[slug];
  if (!filename) return undefined;

  const sourcePath = path.join(process.cwd(), "inbox", filename);
  const source = rewriteLegacyDocumentLinks(readFileSync(sourcePath, "utf8"));
  const htmlMatch = source.match(/<html\b([^>]*)>/i);
  const bodyMatch = source.match(/<body\b([^>]*)>([\s\S]*?)<\/body\s*>/i);
  if (!bodyMatch) return undefined;

  const styles = [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)]
    .map((match) => match[1])
    .join("\n");
  const scripts: OriginalPageScript[] = [];
  const body = bodyMatch[2].replace(
    /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi,
    (_tag, rawAttributes: string, code: string) => {
      scripts.push({
        code,
        src: getAttribute(rawAttributes, "src"),
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
  pageCache.set(slug, page);
  return page;
}
