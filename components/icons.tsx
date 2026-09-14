import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function SearchIcon(props: IconProps) {
  return <svg {...base} {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
}

export function FolderIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M3.5 6.5h6l2 2h9v9.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><path d="M3.5 9h17"/></svg>;
}

export function FileIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M6 3.5h8l4 4V20H6z"/><path d="M14 3.5V8h4M9 12h6M9 15.5h6"/></svg>;
}

export function ArrowIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M7 17 17 7M8 7h9v9"/></svg>;
}

export function ClockIcon(props: IconProps) {
  return <svg {...base} {...props}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>;
}

export function BackIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m15 18-6-6 6-6"/></svg>;
}

export function ExternalIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M13 5h6v6M11 13l8-8M18 13v6H5V6h6"/></svg>;
}
