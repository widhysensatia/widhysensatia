#!/usr/bin/env python3
"""Convert the archived standalone documents into framework-neutral JSON content."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "content" / "documents"

SOURCES = {
    "bali-ecommerce-fulfillment-presentation": "inbox/2026-09-11-batch-01/bali_ecommerce_presentation.html",
    "bali-ecommerce-shared-stock-model": "inbox/2026-09-11-batch-01/bali_ecommerce_shared_stock_model.html",
    "sensatia-systems-handover-master-blueprint": "inbox/2026-09-11-batch-01/preview (3).html",
    "michael-widhy-meeting-brief": "inbox/2026-09-11-batch-01/preview.html",
    "b2b-smart-order-intake": "inbox/2026-09-11-batch-01/b2b-smart-order-intake.html",
    "stockwiz-documentation-portal": "inbox/2026-09-11-batch-01/index.html",
    "stockwiz-stabilization-remediation-playbook": "inbox/2026-09-11-batch-01/stockwiz-stabilization-remediation-playbook.html",
    "stockwiz-option-3-implementation-blueprint": "inbox/2026-09-11-batch-01/stockwiz-option-3-implementation-blueprint.html",
    "stockwiz-erp-business-process-module-blueprint": "inbox/2026-09-11-batch-01/stockwiz-erp-business-process-module-blueprint.html",
    "stockwiz-future-strategy-options": "inbox/2026-09-11-batch-01/stockwiz-future-strategy-options.html",
    "stockwiz-comprehensive-system-audit": "inbox/2026-09-11-batch-01/stockwiz-comprehensive-system-audit.html",
    "stockwiz-erp-architecture-audit": "inbox/2026-09-11-batch-01/stockwiz-erp-architecture-audit.html",
}

VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}
IGNORED_TAGS = {"script", "style", "svg", "button", "nav", "footer", "form", "noscript"}
BLOCK_TAGS = {"h1", "h2", "h3", "h4", "p", "ul", "ol", "table", "pre", "blockquote"}


@dataclass
class Node:
    tag: str
    attrs: dict[str, str] = field(default_factory=dict)
    children: list["Node | str"] = field(default_factory=list)
    parent: "Node | None" = None


class TreeParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root = Node("document")
        self.stack = [self.root]

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        node = Node(tag.lower(), {key: value or "" for key, value in attrs}, parent=self.stack[-1])
        self.stack[-1].children.append(node)
        if tag.lower() not in VOID_TAGS:
            self.stack.append(node)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        if tag.lower() not in VOID_TAGS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                return

    def handle_data(self, data: str) -> None:
        self.stack[-1].children.append(data)


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def node_text(node: Node) -> str:
    parts: list[str] = []

    def walk(item: Node | str) -> None:
        if isinstance(item, str):
            parts.append(item)
            return
        if item.tag in IGNORED_TAGS:
            return
        for child in item.children:
            walk(child)

    walk(node)
    return normalize(" ".join(parts))


def descendants(node: Node, tags: set[str] | None = None) -> Iterable[Node]:
    for child in node.children:
        if not isinstance(child, Node):
            continue
        if tags is None or child.tag in tags:
            yield child
        yield from descendants(child, tags)


def first_descendant(node: Node, tags: set[str]) -> Node | None:
    return next(descendants(node, tags), None)


def is_chapter_banner(node: Node) -> bool:
    return node.tag == "div" and "chapter-banner" in node.attrs.get("class", "").split()


def is_section_node(node: Node) -> bool:
    return node.tag == "section" or is_chapter_banner(node)


def section_candidates(root: Node) -> list[Node]:
    candidates: list[Node] = []

    def walk(node: Node) -> None:
        for child in node.children:
            if not isinstance(child, Node):
                continue
            if is_section_node(child):
                candidates.append(child)
            walk(child)

    walk(root)
    return candidates


def slugify(value: str, fallback: str) -> str:
    slug = normalize(value).lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug).strip("-")
    return slug[:72] or fallback


def list_items(node: Node) -> list[str]:
    items: list[str] = []
    for item in descendants(node, {"li"}):
        ancestor = item.parent
        nested_in_other_list = False
        while ancestor is not None and ancestor is not node:
            if ancestor.tag in {"ul", "ol"}:
                nested_in_other_list = True
                break
            ancestor = ancestor.parent
        if not nested_in_other_list:
            value = node_text(item)
            if value:
                items.append(value)
    return items


def table_data(node: Node) -> dict[str, object] | None:
    rows: list[tuple[list[str], bool]] = []
    for row in descendants(node, {"tr"}):
        cells: list[str] = []
        is_header = False
        for child in row.children:
            if isinstance(child, Node) and child.tag in {"th", "td"}:
                cells.append(node_text(child))
                is_header = is_header or child.tag == "th"
        if cells:
            rows.append((cells, is_header))

    if not rows:
        return None

    headers: list[str] = []
    body_rows = [cells for cells, _ in rows]
    if rows[0][1]:
        headers = rows[0][0]
        body_rows = body_rows[1:]
    return {"type": "table", "headers": headers, "rows": body_rows}


def has_block_descendant(node: Node) -> bool:
    return any(True for _ in descendants(node, BLOCK_TAGS))


def blocks_for_section(section: Node, title_node: Node | None) -> list[dict[str, object]]:
    blocks: list[dict[str, object]] = []

    def append(block: dict[str, object]) -> None:
        if block.get("type") in {"paragraph", "note", "quote", "code", "heading"}:
            text = str(block.get("text", ""))
            if not text:
                return
            if blocks and blocks[-1].get("type") == block.get("type") and blocks[-1].get("text") == text:
                return
        blocks.append(block)

    def walk(node: Node) -> None:
        if node is not section and is_section_node(node):
            return
        if node.tag in IGNORED_TAGS:
            return
        if node is title_node:
            return
        if node.tag in {"h1", "h2", "h3", "h4"}:
            text = node_text(node)
            if text:
                append({"type": "heading", "level": int(node.tag[1]), "text": text})
            return
        if node.tag == "p":
            text = node_text(node)
            if text:
                append({"type": "paragraph", "text": text})
            return
        if node.tag in {"ul", "ol"}:
            items = list_items(node)
            if items:
                append({"type": "list", "ordered": node.tag == "ol", "items": items})
            return
        if node.tag == "table":
            table = table_data(node)
            if table:
                append(table)
            return
        if node.tag == "pre":
            text = node_text(node)
            if text:
                append({"type": "code", "text": text})
            return
        if node.tag == "blockquote":
            text = node_text(node)
            if text:
                append({"type": "quote", "text": text})
            return
        if node.tag == "summary":
            text = node_text(node)
            if text:
                append({"type": "heading", "level": 4, "text": text})
            return
        if node.tag in {"article", "div", "figure", "dl"} and not has_block_descendant(node):
            text = node_text(node)
            if 2 < len(text) <= 650:
                append({"type": "note", "text": text})
                return
        for child in node.children:
            if isinstance(child, Node):
                walk(child)

    walk(section)
    return blocks


def extract_document(slug: str, source: Path) -> dict[str, object]:
    parser = TreeParser()
    parser.feed(source.read_text(encoding="utf-8", errors="replace"))

    title_tag = first_descendant(parser.root, {"title"})
    source_title = node_text(title_tag) if title_tag else slug
    main = first_descendant(parser.root, {"main"})
    scope = main or first_descendant(parser.root, {"body"}) or parser.root
    candidates = section_candidates(scope)

    if not candidates:
        candidates = [scope]

    sections: list[dict[str, object]] = []
    used_ids: set[str] = set()
    for index, candidate in enumerate(candidates, start=1):
        title_node = first_descendant(candidate, {"h1", "h2"})
        if title_node is None:
            title_node = first_descendant(candidate, {"h3"})
        title = node_text(title_node) if title_node else candidate.attrs.get("data-title", "")
        if not title:
            title = candidate.attrs.get("id", "") or f"Bagian {index}"

        section_id = slugify(candidate.attrs.get("id", "") or title, f"bagian-{index}")
        base_id = section_id
        suffix = 2
        while section_id in used_ids:
            section_id = f"{base_id}-{suffix}"
            suffix += 1
        used_ids.add(section_id)

        blocks = blocks_for_section(candidate, title_node)
        if not blocks and not title:
            continue
        sections.append({
            "id": section_id,
            "number": f"{len(sections) + 1:02d}",
            "title": title,
            "blocks": blocks,
        })

    return {
        "slug": slug,
        "sourceTitle": source_title,
        "sections": sections,
    }


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    summary: list[str] = []
    for slug, relative_source in SOURCES.items():
        source = ROOT / relative_source
        document = extract_document(slug, source)
        target = OUTPUT_DIR / f"{slug}.json"
        target.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        block_count = sum(len(section["blocks"]) for section in document["sections"])
        summary.append(f"{slug}: {len(document['sections'])} sections, {block_count} blocks")
    print("\n".join(summary))


if __name__ == "__main__":
    main()
