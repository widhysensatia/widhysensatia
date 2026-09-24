export type ChildDomain = {
  name: string;
  description: string;
  documentSlugs: string[];
};

export type KnowledgeDomain = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  accent: "forest" | "blue" | "amber" | "plum";
  children: ChildDomain[];
};

export const domains: KnowledgeDomain[] = [
  {
    slug: "stockwiz-erp",
    number: "01",
    title: "StockWiz & ERP",
    shortTitle: "StockWiz",
    description:
      "Audit, strategi, dan blueprint untuk membangun fondasi sistem operasional Sensatia yang lebih kuat.",
    accent: "blue",
    children: [
      {
        name: "Audit & Readiness",
        description: "Kondisi sistem, risiko, arsitektur, dan kesiapan menuju ERP.",
        documentSlugs: [
          "stockwiz-comprehensive-system-audit",
          "stockwiz-erp-architecture-audit",
        ],
      },
      {
        name: "Order & Fulfillment Automation",
        description:
          "Assessment customer order, credit control, invoice delivery, dan fulfillment automation.",
        documentSlugs: [
          "putu-mei-stockwizz-three-feature-blueprint",
          "putu-mei-accounting-meeting-notes-2026-09-21",
          "putu-mei-accounting-meeting-pack-2026-09-21",
          "stockwizz-putu-mei-assessment",
        ],
      },
      {
        name: "AI & Procurement Automation",
        description:
          "Research dan rancangan pemanfaatan AI untuk procurement dengan workflow terkontrol, human approval, dan auditability.",
        documentSlugs: ["guanta-ai-pr-po-stockwizz-analysis"],
      },
      {
        name: "Strategy & Direction",
        description: "Pilihan arah dan keputusan strategis untuk evolusi StockWiz.",
        documentSlugs: ["stockwiz-future-strategy-options"],
      },
      {
        name: "Implementation Blueprints",
        description: "Rancangan proses, modul, dan tahapan implementasi sistem berikutnya.",
        documentSlugs: [
          "stockwiz-erp-business-process-module-blueprint",
          "stockwiz-option-3-implementation-blueprint",
        ],
      },
      {
        name: "Stabilization",
        description: "Urutan perbaikan sistem existing dan kontrol operasional.",
        documentSlugs: ["stockwiz-stabilization-remediation-playbook"],
      },
      {
        name: "Reference Portal",
        description: "Pintu masuk ke dokumentasi dan referensi StockWiz terdahulu.",
        documentSlugs: ["stockwiz-documentation-portal"],
      },
    ],
  },
  {
    slug: "ecommerce-fulfillment",
    number: "02",
    title: "E-Commerce & Fulfillment",
    shortTitle: "E-Commerce",
    description:
      "Model stok, integrasi channel, dan alur fulfillment untuk operasi Bali–Jakarta yang lebih sederhana.",
    accent: "forest",
    children: [
      {
        name: "Fulfillment Strategy",
        description: "Pergerakan stok dan penyederhanaan fulfillment lintas lokasi.",
        documentSlugs: ["bali-ecommerce-fulfillment-presentation"],
      },
      {
        name: "Jubelio & Shared Stock",
        description: "Integrasi website, marketplace routing, dan target operating model.",
        documentSlugs: ["bali-ecommerce-shared-stock-model"],
      },
    ],
  },
  {
    slug: "meetings-handover",
    number: "03",
    title: "Meetings & Handover",
    shortTitle: "Handover",
    description:
      "Konteks diskusi, keputusan, ownership, dan materi transisi yang perlu tetap tersambung lintas tim.",
    accent: "plum",
    children: [
      {
        name: "Meeting Briefs",
        description: "Persiapan diskusi, fokus pembahasan, dan tindak lanjut.",
        documentSlugs: [
          "michael-weekly-meeting-2026-09-25",
          "sensatia-weekly-meeting-presentation-2026-09-17",
          "sensatia-weekly-meeting-brief-2026-09-17",
          "michael-widhy-meeting-brief",
        ],
      },
      {
        name: "Systems Handover",
        description: "Konteks sistem, ownership, dan kesinambungan pekerjaan.",
        documentSlugs: [
          "sensatia-systems-handover-technical-documentation",
          "sensatia-systems-handover-master-blueprint",
        ],
      },
      {
        name: "Digital Capability Transition",
        description:
          "Program transisi, knowledge transfer, evidence, dan readiness menuju internal ownership.",
        documentSlugs: [
          "project-phoenix-weekly-handover-2026-09-23",
          "project-phoenix-command-center",
          "project-phoenix-dctp-guide",
        ],
      },
    ],
  },
  {
    slug: "ideas-automation",
    number: "04",
    title: "Ideas & Automation",
    shortTitle: "Ideas",
    description:
      "Ruang untuk peluang baru, eksperimen workflow, dan otomasi proses kerja yang layak dikembangkan.",
    accent: "amber",
    children: [
      {
        name: "Accounting & Finance Improvement",
        description:
          "Ide terstruktur untuk efisiensi Accounting, kontrol internal, automasi Finance, dan pengurangan human error.",
        documentSlugs: ["accounting-ideabox-detailed"],
      },
      {
        name: "Customer Experience & Store Operations",
        description:
          "Panduan operasional untuk pengalaman customer, reputasi digital, dan rollout lintas toko.",
        documentSlugs: ["google-review-qr-rollout-guide"],
      },
      {
        name: "B2B Workflow",
        description: "Konsep otomasi dari komunikasi customer menuju order terstruktur.",
        documentSlugs: ["b2b-smart-order-intake"],
      },
    ],
  },
];

export function getDomain(slug: string) {
  return domains.find((domain) => domain.slug === slug);
}

export function getDomainDocumentCount(domain: KnowledgeDomain) {
  return domain.children.reduce((total, child) => total + child.documentSlugs.length, 0);
}

export function getDomainForDocument(documentSlug: string) {
  return domains.find((domain) =>
    domain.children.some((child) => child.documentSlugs.includes(documentSlug)),
  );
}
