import b2bSmartOrderIntake from "@/content/documents/b2b-smart-order-intake.json";
import ecommercePresentation from "@/content/documents/bali-ecommerce-fulfillment-presentation.json";
import ecommerceSharedStock from "@/content/documents/bali-ecommerce-shared-stock-model.json";
import meetingBrief from "@/content/documents/michael-widhy-meeting-brief.json";
import systemsHandover from "@/content/documents/sensatia-systems-handover-master-blueprint.json";
import stockwizAudit from "@/content/documents/stockwiz-comprehensive-system-audit.json";
import stockwizPortal from "@/content/documents/stockwiz-documentation-portal.json";
import stockwizArchitectureAudit from "@/content/documents/stockwiz-erp-architecture-audit.json";
import stockwizProcessBlueprint from "@/content/documents/stockwiz-erp-business-process-module-blueprint.json";
import stockwizStrategy from "@/content/documents/stockwiz-future-strategy-options.json";
import stockwizOptionThree from "@/content/documents/stockwiz-option-3-implementation-blueprint.json";
import stockwizRemediation from "@/content/documents/stockwiz-stabilization-remediation-playbook.json";

export type DocumentContentBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "note"; text: string }
  | { type: "quote"; text: string }
  | { type: "code"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export type DocumentContentSection = {
  id: string;
  number: string;
  title: string;
  blocks: DocumentContentBlock[];
};

export type NativeDocumentContent = {
  slug: string;
  sourceTitle: string;
  sections: DocumentContentSection[];
};

const contentBySlug: Record<string, NativeDocumentContent> = {
  "b2b-smart-order-intake": b2bSmartOrderIntake as NativeDocumentContent,
  "bali-ecommerce-fulfillment-presentation": ecommercePresentation as NativeDocumentContent,
  "bali-ecommerce-shared-stock-model": ecommerceSharedStock as NativeDocumentContent,
  "michael-widhy-meeting-brief": meetingBrief as NativeDocumentContent,
  "sensatia-systems-handover-master-blueprint": systemsHandover as NativeDocumentContent,
  "stockwiz-comprehensive-system-audit": stockwizAudit as NativeDocumentContent,
  "stockwiz-documentation-portal": stockwizPortal as NativeDocumentContent,
  "stockwiz-erp-architecture-audit": stockwizArchitectureAudit as NativeDocumentContent,
  "stockwiz-erp-business-process-module-blueprint": stockwizProcessBlueprint as NativeDocumentContent,
  "stockwiz-future-strategy-options": stockwizStrategy as NativeDocumentContent,
  "stockwiz-option-3-implementation-blueprint": stockwizOptionThree as NativeDocumentContent,
  "stockwiz-stabilization-remediation-playbook": stockwizRemediation as NativeDocumentContent,
};

export function getDocumentContent(slug: string) {
  return contentBySlug[slug];
}
