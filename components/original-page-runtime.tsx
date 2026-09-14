"use client";

import { useEffect } from "react";
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

const executedContainersKey = "__sensatiaOriginalPageExecutedContainers";

type RuntimeWindow = Window & {
  [executedContainersKey]?: WeakSet<Element>;
};

function getExecutedContainers() {
  const runtimeWindow = window as RuntimeWindow;
  runtimeWindow[executedContainersKey] ??= new WeakSet<Element>();
  return runtimeWindow[executedContainersKey];
}

function isolateInlineScript(code: string, slug: string, index: number) {
  const functionNames = [...code.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)]
    .map((match) => match[1])
    .filter((name, position, names) => names.indexOf(name) === position);

  const exposeFunctions = functionNames
    .map(
      (name) =>
        `if (typeof ${name} === "function") window[${JSON.stringify(name)}] = ${name};`,
    )
    .join("\n");

  return `(() => {\n${code}\n${exposeFunctions}\n})();\n//# sourceURL=original-page/${slug}-${index}.js`;
}

export function OriginalPageRuntime({
  bodyAttributes,
  htmlAttributes,
  scripts,
  slug,
}: Props) {
  useEffect(() => {
    const container = document.querySelector(`[data-original-document="${CSS.escape(slug)}"]`);
    if (!container) return;

    const executedContainers = getExecutedContainers();
    if (executedContainers.has(container)) return;
    executedContainers.add(container);

    applyAttributes(document.documentElement, htmlAttributes);
    applyAttributes(document.body, bodyAttributes);

    async function runScripts() {
      for (const [index, original] of scripts.entries()) {
        const script = document.createElement("script");
        if (original.type) script.type = original.type;
        script.dataset.originalPageScript = slug;

        if (original.src) {
          await new Promise<void>((resolve) => {
            script.src = original.src!;
            script.onload = () => resolve();
            script.onerror = () => resolve();
            document.body.appendChild(script);
          });
        } else {
          script.textContent = isolateInlineScript(original.code, slug, index);
          document.body.appendChild(script);
        }

        script.remove();
      }
    }

    void runScripts();
  }, [bodyAttributes, htmlAttributes, scripts, slug]);

  return null;
}
