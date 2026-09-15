export type DocumentCategory =
  | "StockWiz"
  | "E-Commerce"
  | "Meeting & Handover"
  | "Ideas";

export type KnowledgeDocument = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  category: DocumentCategory;
  type: string;
  updated: string;
  updatedLabel: string;
  tags: string[];
  accent: "forest" | "blue" | "amber" | "plum";
};

export const documents: KnowledgeDocument[] = [
  {
    slug: "project-phoenix-dctp-guide",
    title: "Project Phoenix — Digital Capability Transition Program",
    shortTitle: "Project Phoenix DCTP Guide",
    summary:
      "Panduan program transisi kapabilitas digital enam bulan, mencakup peran, roadmap, evidence, knowledge gaps, dan kriteria penyelesaian.",
    category: "Meeting & Handover",
    type: "Program Guide",
    updated: "2026-09-14",
    updatedLabel: "14 Sep 2026",
    tags: ["Project Phoenix", "Knowledge Transfer", "DCTP"],
    accent: "plum",
  },
  {
    slug: "sensatia-systems-handover-technical-documentation",
    title: "Sensatia Systems — Handover & Technical Documentation",
    shortTitle: "Systems Handover Documentation",
    summary:
      "Dokumentasi teknis konsolidasi untuk portfolio sistem, arsitektur, akses, deployment, incident response, knowledge transfer, dan ownership.",
    category: "Meeting & Handover",
    type: "Handover",
    updated: "2026-09-14",
    updatedLabel: "14 Sep 2026",
    tags: ["Technical Handover", "System Ownership", "Knowledge Transfer"],
    accent: "plum",
  },
  {
    slug: "google-review-qr-rollout-guide",
    title: "Panduan Google Review QR Code & Rollout 52 Toko",
    shortTitle: "Google Review QR Rollout Guide",
    summary:
      "Panduan operasional pembuatan QR review resmi, alur Creative, pemasangan, validasi, dan tracker rollout untuk 52 toko.",
    category: "Ideas",
    type: "Guide",
    updated: "2026-09-14",
    updatedLabel: "14 Sep 2026",
    tags: ["Google Business Profile", "QR Code", "Store Rollout"],
    accent: "amber",
  },
  {
    slug: "stockwizz-putu-mei-assessment",
    title: "StockWizz Order-to-Cash & Fulfillment Automation",
    shortTitle: "StockWizz Order-to-Cash Automation",
    summary:
      "Proposal request Putu Mei untuk credit control NET 30, invoice delivery, warehouse tracking, dan current state WEB ID.",
    category: "StockWiz",
    type: "Proposal",
    updated: "2026-09-14",
    updatedLabel: "14 Sep 2026",
    tags: ["Credit Control", "Order Automation", "Putu Mei"],
    accent: "blue",
  },
  {
    slug: "bali-ecommerce-fulfillment-presentation",
    title: "Sensatia E-Commerce — Fulfillment & Stock Strategy",
    shortTitle: "Fulfillment & Stock Strategy",
    summary:
      "Presentasi ringkas mengenai perbaikan stock movement dan penyederhanaan fulfillment Bali–Jakarta.",
    category: "E-Commerce",
    type: "Presentation",
    updated: "2026-09-11",
    updatedLabel: "11 Sep 2026",
    tags: ["Jubelio", "Fulfillment", "Bali–Jakarta"],
    accent: "forest",
  },
  {
    slug: "bali-ecommerce-shared-stock-model",
    title: "Bali E-Commerce Shared Stock Model",
    shortTitle: "Shared Stock Model",
    summary:
      "Analisis lengkap integrasi Jubelio, website /id, marketplace routing, dan target operating model.",
    category: "E-Commerce",
    type: "Analysis",
    updated: "2026-09-11",
    updatedLabel: "11 Sep 2026",
    tags: ["Stock", "Jubelio", "Operating Model"],
    accent: "forest",
  },
  {
    slug: "sensatia-systems-handover-master-blueprint",
    title: "Sensatia Systems Handover — Master Blueprint",
    shortTitle: "Systems Handover Blueprint",
    summary:
      "Blueprint handover sistem untuk menjaga konteks, ownership, dan kelanjutan kerja lintas tim.",
    category: "Meeting & Handover",
    type: "Handover",
    updated: "2026-09-08",
    updatedLabel: "8 Sep 2026",
    tags: ["Systems", "Ownership", "Handover"],
    accent: "plum",
  },
  {
    slug: "michael-widhy-meeting-brief",
    title: "Michael × Widhy — Meeting Brief",
    shortTitle: "Michael × Widhy Meeting Brief",
    summary:
      "Brief pertemuan yang merangkum konteks pembahasan, fokus diskusi, dan materi tindak lanjut.",
    category: "Meeting & Handover",
    type: "Meeting Notes",
    updated: "2026-09-03",
    updatedLabel: "3 Sep 2026",
    tags: ["Meeting", "Brief", "Follow-up"],
    accent: "plum",
  },
  {
    slug: "b2b-smart-order-intake",
    title: "B2B Smart Order Intake",
    shortTitle: "B2B Smart Order Intake",
    summary:
      "Konsep alur otomatis dari email customer menjadi order yang terstruktur, dapat dicek, dan siap diproses.",
    category: "Ideas",
    type: "Concept",
    updated: "2026-08-30",
    updatedLabel: "30 Agu 2026",
    tags: ["B2B", "Automation", "Order"],
    accent: "amber",
  },
  {
    slug: "stockwiz-documentation-portal",
    title: "Portal Dokumentasi — Sensatia StockWiz",
    shortTitle: "StockWiz Documentation Portal",
    summary:
      "Portal dokumentasi asli StockWiz yang menghubungkan audit, strategi, playbook, dan blueprint implementasi.",
    category: "StockWiz",
    type: "Legacy Index",
    updated: "2026-09-08",
    updatedLabel: "8 Sep 2026",
    tags: ["Portal", "Reference", "StockWiz"],
    accent: "blue",
  },
  {
    slug: "stockwiz-stabilization-remediation-playbook",
    title: "Playbook Perbaikan Sistem Existing — Sensatia StockWiz",
    shortTitle: "Stabilization & Remediation Playbook",
    summary:
      "Urutan perbaikan sistem existing dengan fokus pada fondasi, data, keamanan, dan kontrol operasional.",
    category: "StockWiz",
    type: "Playbook",
    updated: "2026-09-08",
    updatedLabel: "8 Sep 2026",
    tags: ["Remediation", "Stabilization", "Roadmap"],
    accent: "blue",
  },
  {
    slug: "stockwiz-option-3-implementation-blueprint",
    title: "Blueprint Opsi 3 — Implementasi StockWiz Next per Modul",
    shortTitle: "Option 3 Implementation Blueprint",
    summary:
      "Blueprint implementasi bertahap StockWiz Next, dari prinsip arsitektur sampai pilot dan cutover.",
    category: "StockWiz",
    type: "Blueprint",
    updated: "2026-09-05",
    updatedLabel: "5 Sep 2026",
    tags: ["StockWiz Next", "Modules", "Implementation"],
    accent: "blue",
  },
  {
    slug: "stockwiz-erp-business-process-module-blueprint",
    title: "Blueprint Proses Bisnis & Modul ERP — Sensatia StockWiz",
    shortTitle: "ERP Process & Module Blueprint",
    summary:
      "Peta proses dan modul ERP dari bahan baku, manufacturing, quality, inventory, hingga customer.",
    category: "StockWiz",
    type: "Blueprint",
    updated: "2026-09-08",
    updatedLabel: "8 Sep 2026",
    tags: ["ERP", "Business Process", "Modules"],
    accent: "blue",
  },
  {
    slug: "stockwiz-future-strategy-options",
    title: "Masa Depan StockWiz — Opsi Strategi & Arsitektur",
    shortTitle: "Future Strategy Options",
    summary:
      "Perbandingan opsi strategi dan arsitektur untuk menentukan arah evolusi StockWiz berikutnya.",
    category: "StockWiz",
    type: "Strategy",
    updated: "2026-09-05",
    updatedLabel: "5 Sep 2026",
    tags: ["Strategy", "Architecture", "Decision"],
    accent: "blue",
  },
  {
    slug: "stockwiz-comprehensive-system-audit",
    title: "Master Audit Sistem — Sensatia StockWiz",
    shortTitle: "Comprehensive System Audit",
    summary:
      "Laporan menyeluruh mengenai kelemahan sistem, keamanan, data, stock, delivery, dan kesiapan ERP.",
    category: "StockWiz",
    type: "Audit",
    updated: "2026-09-06",
    updatedLabel: "6 Sep 2026",
    tags: ["Audit", "Risk", "Remediation"],
    accent: "blue",
  },
  {
    slug: "stockwiz-erp-architecture-audit",
    title: "Audit Arsitektur & Kesiapan ERP — Sensatia StockWiz",
    shortTitle: "ERP Architecture Readiness Audit",
    summary:
      "Audit arsitektur StockWiz dan kesiapan bergerak dari stock management menuju ERP manufaktur.",
    category: "StockWiz",
    type: "Audit",
    updated: "2026-09-05",
    updatedLabel: "5 Sep 2026",
    tags: ["Architecture", "ERP", "Readiness"],
    accent: "blue",
  },
];

export const categories: Array<"Semua" | DocumentCategory> = [
  "Semua",
  "StockWiz",
  "E-Commerce",
  "Meeting & Handover",
  "Ideas",
];

export function getDocument(slug: string) {
  return documents.find((document) => document.slug === slug);
}
