"use client";

import { useEffect, useRef } from "react";
import type { OriginalPageScript } from "@/lib/original-pages";

type Props = {
  bodyAttributes: Record<string, string>;
  htmlAttributes: Record<string, string>;
  scripts: OriginalPageScript[];
  slug: string;
};

function applyAttributes(element: HTMLElement, attributes: Record<string, string>) {
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
}

export function OriginalPageRuntime({
  bodyAttributes,
  htmlAttributes,
  scripts,
  slug,
}: Props) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    applyAttributes(document.documentElement, htmlAttributes);
    applyAttributes(document.body, bodyAttributes);

    async function runScripts() {
      for (const original of scripts) {
        const script = document.createElement("script");
        if (original.type) script.type = original.type;

        if (original.src) {
          await new Promise<void>((resolve) => {
            script.src = original.src!;
            script.onload = () => resolve();
            script.onerror = () => resolve();
            document.body.appendChild(script);
          });
        } else {
          script.textContent = original.code;
          document.body.appendChild(script);
        }
      }
    }

    void runScripts();
  }, [slug]);

  return null;
}
