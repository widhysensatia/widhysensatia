import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sensatia Knowledge Library",
    template: "%s · Sensatia Knowledge Library",
  },
  description: "Internal knowledge workspace untuk catatan, analisis, meeting notes, dan blueprint Sensatia.",
  icons: { icon: "/sensatia-mark.svg" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-image-preview": "none",
      "max-snippet": 0,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
