import { PDFDocument } from "pdf-lib";

export function sanitizeFileName(name: string): string {
  const trimmed = name.trim().replace(/\.pdf$/i, "");
  const safe = trimmed.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").replace(/\s+/g, "_");
  return safe.length > 0 ? `${safe}.pdf` : "documento_unido.pdf";
}

export async function mergePdfFiles(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const source = await PDFDocument.load(bytes);
    const pageIndices = source.getPageIndices();
    const copiedPages = await merged.copyPages(source, pageIndices);

    for (const page of copiedPages) {
      merged.addPage(page);
    }
  }

  return merged.save();
}

export function downloadPdf(bytes: Uint8Array, fileName: string): void {
  const copy = new Uint8Array(bytes);
  const blob = new Blob([copy], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
