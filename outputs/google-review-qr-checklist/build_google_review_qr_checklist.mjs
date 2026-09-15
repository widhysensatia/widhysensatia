import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const repoRoot = "/Users/widiarsana/Projects/widhysensatia";
const outputDir = path.join(repoRoot, "outputs/google-review-qr-checklist");
const htmlPath = path.join(
  repoRoot,
  "inbox/2026-09-14-batch-02/google_review_qr_ask_for_reviews_guide_updated.html",
);

const html = await fs.readFile(htmlPath, "utf8");
const rowRegex =
  /<tr data-region="([^"]+)" data-store="[^"]+">[\s\S]*?<td class="num">(\d+)<\/td>[\s\S]*?<strong>(.*?)<\/strong>[\s\S]*?<div class="store-meta">(.*?)<\/div>/g;

const stores = [];
for (const match of html.matchAll(rowRegex)) {
  const [, region, number, store, meta] = match;
  const [cityRaw] = meta.split("·");
  stores.push({
    number: Number(number),
    store: store.replace(/&amp;/g, "&").trim(),
    region: region.replace(/&amp;/g, "&").trim(),
    city: cityRaw.replace(/&amp;/g, "&").trim(),
  });
}

if (stores.length !== 52) {
  throw new Error(`Expected 52 stores, found ${stores.length}`);
}

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Rollout Checklist");
sheet.showGridLines = false;
sheet.tabColor = "#174C3F";

const title = "Google Review QR Rollout Checklist";
const subtitle =
  "Checklist operasional untuk 52 toko. IT/Widhy menyiapkan instruksi dan tracker, Jeppy/Marketing menyediakan QR resmi, Creative membuat artwork, Malik/VM memastikan placement, dan Erlin/Retail Operation mengoordinasikan pemasangan toko.";

sheet.getRange("B2:S2").values = [[title, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]];
sheet.getRange("B3:S3").values = [[subtitle, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]];
sheet.getRange("B2:S2").format.font = { bold: true, size: 16, color: "#183B32" };
sheet.getRange("B3:S3").format.font = { italic: true, size: 10, color: "#5F716B" };
sheet.getRange("B4:S4").format.borders = { bottom: { style: "thin", color: "#C9D8D1" } };

const summary = [
  ["Total stores", stores.length, "All active rollout stores"],
  ["Complete", "=COUNTIF(N13:N64,\"Complete\")", "All required steps done"],
  ["In progress", "=COUNTIF(N13:N64,\"In Progress\")", "At least one step done"],
  ["Blocked", "=COUNTIF(N13:N64,\"Blocked\")", "Needs owner follow-up"],
  ["Not started", "=COUNTIF(N13:N64,\"Not Started\")", "No step completed yet"],
  ["Completion rate", "=C6/C5", "Complete stores divided by total"],
];
sheet.getRange("B5:D10").values = summary;
sheet.getRange("B5:D10").format.borders = { preset: "all", style: "thin", color: "#DCE6E1" };
sheet.getRange("B5:D10").format.fill = "#F7FAF8";
sheet.getRange("B5:B10").format.font = { bold: true, color: "#183B32" };
sheet.getRange("C5:C9").setNumberFormat("#,##0");
sheet.getRange("C10").setNumberFormat("0.0%");
sheet.getRange("D5:D10").format.font = { color: "#5F716B" };

const ownerLegend = [
  ["Role", "Primary responsibility"],
  ["IT / Widhy", "Instruksi, tutorial, tracker, standar validasi, dan support teknis."],
  ["Jeppy / Marketing", "Provide official QR dan review link dari Google Business Profile."],
  ["Creative", "Masukkan QR resmi ke artwork tanpa membuat QR alternatif."],
  ["Malik / VM", "Placement, ukuran, posisi display, dan visual merchandising."],
  ["Erlin / Retail Ops", "Distribusi material, instruksi store team, pemasangan, dan final scan test."],
];
sheet.getRange("F5:H10").values = ownerLegend.map((row) => [row[0], row[1], ""]);
sheet.getRange("F5:H5").format.fill = "#174C3F";
sheet.getRange("F5:H5").format.font = { bold: true, color: "#FFFFFF" };
sheet.getRange("F5:H10").format.borders = { preset: "all", style: "thin", color: "#DCE6E1" };
sheet.getRange("F6:H10").format.fill = "#FFFFFF";
sheet.getRange("F6:F10").format.font = { bold: true, color: "#183B32" };
sheet.getRange("G6:H10").format.font = { color: "#5F716B" };

const headers = [
  "#",
  "Store",
  "Region",
  "City",
  "GBP owner",
  "QR by Jeppy",
  "Initial test",
  "Sent to Creative",
  "Design ready",
  "VM placement approved",
  "Installed by Ops",
  "Final test",
  "Status",
  "Current owner",
  "Next action",
  "Priority",
  "Due date",
  "Notes",
  "Last updated",
];
sheet.getRange("B12:T12").values = [headers];
sheet.getRange("B12:T12").format.fill = "#174C3F";
sheet.getRange("B12:T12").format.font = { bold: true, color: "#FFFFFF" };
sheet.getRange("B12:T12").format.horizontalAlignment = "center";
sheet.getRange("B12:T12").format.verticalAlignment = "center";
sheet.getRange("B12:T12").format.borders = { preset: "all", style: "thin", color: "#FFFFFF" };

const dataRows = stores.map((s, idx) => {
  const row = idx + 13;
  const stepRange = `G${row}:M${row}`;
  const statusFormula = `=IF(COUNTIF(${stepRange},"Blocked")>0,"Blocked",IF(COUNTIF(${stepRange},"Done")+COUNTIF(${stepRange},"N/A")=7,"Complete",IF(COUNTIF(${stepRange},"Done")>0,"In Progress","Not Started")))`;
  const ownerFormula = `=IF(N${row}="Complete","Done",IF(G${row}<>"Done","Jeppy / Marketing",IF(H${row}<>"Done","Jeppy / Marketing",IF(I${row}<>"Done","Creative",IF(J${row}<>"Done","Creative",IF(K${row}<>"Done","Malik / VM",IF(L${row}<>"Done","Erlin / Retail Ops",IF(M${row}<>"Done","Store PIC / Retail Ops","Done"))))))))`;
  const actionFormula = `=IF(N${row}="Complete","No further action",IF(G${row}<>"Done","Provide official QR for this store",IF(H${row}<>"Done","Scan QR and verify store name",IF(I${row}<>"Done","Send QR to Creative",IF(J${row}<>"Done","Finalize artwork",IF(K${row}<>"Done","Approve VM placement",IF(L${row}<>"Done","Install at store",IF(M${row}<>"Done","Perform final scan test","No further action"))))))))`;
  return [
    s.number,
    s.store,
    s.region,
    s.city,
    "Jeppy / Marketing",
    "Pending",
    "Pending",
    "Pending",
    "Pending",
    "Pending",
    "Pending",
    "Pending",
    statusFormula,
    ownerFormula,
    actionFormula,
    "Normal",
    null,
    "",
    null,
  ];
});
sheet.getRange("B13:T64").values = dataRows;
sheet.getRange("B13:B64").setNumberFormat("00");
sheet.getRange("R13:R64").setNumberFormat("yyyy-mm-dd");
sheet.getRange("T13:T64").setNumberFormat("yyyy-mm-dd");

const tableRange = sheet.getRange("B12:T64");
tableRange.format.borders = { preset: "all", style: "thin", color: "#DCE6E1" };
tableRange.format.verticalAlignment = "center";
sheet.getRange("B13:T64").format.font = { color: "#253D36", size: 10 };
sheet.getRange("G13:M64").format.horizontalAlignment = "center";
sheet.getRange("N13:Q64").format.horizontalAlignment = "center";
sheet.getRange("B13:B64").format.horizontalAlignment = "center";

sheet.getRange("G13:M64").dataValidation = {
  rule: { type: "list", values: ["Pending", "Done", "Blocked", "N/A"] },
};
sheet.getRange("Q13:Q64").dataValidation = {
  rule: { type: "list", values: ["Low", "Normal", "High", "Urgent"] },
};

const statusRange = sheet.getRange("N13:N64");
statusRange.conditionalFormats.add("containsText", {
  text: "Complete",
  format: { fill: "#DDF4E8", font: { color: "#0D6B45", bold: true } },
});
statusRange.conditionalFormats.add("containsText", {
  text: "In Progress",
  format: { fill: "#E7F0FF", font: { color: "#265AA8", bold: true } },
});
statusRange.conditionalFormats.add("containsText", {
  text: "Blocked",
  format: { fill: "#FDE2E2", font: { color: "#B42318", bold: true } },
});
statusRange.conditionalFormats.add("containsText", {
  text: "Not Started",
  format: { fill: "#F3F4F6", font: { color: "#4B5563", bold: true } },
});

const stepStatusRange = sheet.getRange("G13:M64");
stepStatusRange.conditionalFormats.add("containsText", {
  text: "Done",
  format: { fill: "#DDF4E8", font: { color: "#0D6B45" } },
});
stepStatusRange.conditionalFormats.add("containsText", {
  text: "Blocked",
  format: { fill: "#FDE2E2", font: { color: "#B42318", bold: true } },
});
stepStatusRange.conditionalFormats.add("containsText", {
  text: "Pending",
  format: { fill: "#FFF8E1", font: { color: "#8A5A00" } },
});

const priorityRange = sheet.getRange("Q13:Q64");
priorityRange.conditionalFormats.add("containsText", {
  text: "Urgent",
  format: { fill: "#FDE2E2", font: { color: "#B42318", bold: true } },
});
priorityRange.conditionalFormats.add("containsText", {
  text: "High",
  format: { fill: "#FFF1D6", font: { color: "#8A5A00", bold: true } },
});

sheet.freezePanes.freezeRows(12);
sheet.freezePanes.freezeColumns(3);

const widths = [7, 34, 30, 18, 20, 16, 16, 17, 16, 22, 18, 15, 16, 22, 32, 12, 13, 34, 14];
widths.forEach((width, index) => {
  sheet.getRangeByIndexes(0, index + 1, 1, 1).format.columnWidth = width;
});
sheet.getRange("B2:T64").format.autofitRows();
sheet.getRange("B12:T64").format.rowHeight = 25;
sheet.getRange("B2").format.rowHeight = 26;
sheet.getRange("B3").format.rowHeight = 36;

workbook.recalculate();

const overview = await workbook.inspect({
  kind: "table",
  range: "Rollout Checklist!B2:T20",
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 19,
  maxChars: 8000,
});
console.log(overview.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName: "Rollout Checklist",
  range: "B2:T28",
  scale: 1,
  format: "png",
});
const previewBytes = new Uint8Array(await preview.arrayBuffer());
await fs.writeFile(path.join(outputDir, "preview.png"), previewBytes);

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(path.join(outputDir, "google-review-qr-rollout-checklist.xlsx"));
