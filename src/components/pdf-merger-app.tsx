"use client";

import { useEffect, useState } from "react";
import { FileStack, LoaderCircle } from "lucide-react";
import { AdBlockerGate } from "@/components/ad-blocker-gate";
import { AdSlot } from "@/components/ad-slot";
import { GenerateModal } from "@/components/generate-modal";
import { PdfGrid } from "@/components/pdf-grid";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { detectAdBlocker } from "@/lib/detect-adblocker";
import { downloadPdf, mergePdfFiles, sanitizeFileName } from "@/lib/merge-pdfs";
import { renderPdfPreview } from "@/lib/pdf-preview";
import type { PdfItem } from "@/lib/types";

function createId(): string {
  return crypto.randomUUID();
}

function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function PdfMergerApp() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [adBlockerDetected, setAdBlockerDetected] = useState(false);
  const [isCheckingAds, setIsCheckingAds] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function runAdCheck() {
      setIsCheckingAds(true);
      const blocked = await detectAdBlocker();
      if (active) {
        setAdBlockerDetected(blocked);
        setIsCheckingAds(false);
      }
    }

    void runAdCheck();

    return () => {
      active = false;
    };
  }, []);

  async function handleAddFiles(fileList: FileList) {
    setErrorMessage(null);
    const files = Array.from(fileList);
    const validFiles = files.filter(isPdfFile);

    if (validFiles.length !== files.length) {
      setErrorMessage("Solo se permiten archivos PDF.");
    }

    if (validFiles.length === 0) {
      return;
    }

    const newItems = await Promise.all(
      validFiles.map(async (file) => ({
        id: createId(),
        file,
        name: file.name,
        previewUrl: await renderPdfPreview(file),
      })),
    );

    setItems((current) => [...current, ...newItems]);
  }

  function handleRemove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function handleGenerateClick() {
    if (adBlockerDetected) {
      setErrorMessage("No puedes generar el PDF mientras el bloqueador de anuncios esté activo.");
      return;
    }

    if (items.length < 2) {
      setErrorMessage("Agrega al menos 2 documentos PDF para unirlos.");
      return;
    }

    setErrorMessage(null);
    setIsModalOpen(true);
  }

  async function handleConfirmGenerate(rawName: string) {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const bytes = await mergePdfFiles(items.map((item) => item.file));
      downloadPdf(bytes, sanitizeFileName(rawName));
      setIsModalOpen(false);
    } catch {
      setErrorMessage("No se pudo generar el PDF. Verifica que los archivos no estén dañados.");
    } finally {
      setIsGenerating(false);
    }
  }

  const canGenerate = items.length >= 2 && !adBlockerDetected && !isCheckingAds;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          <FileStack className="size-3.5" />
          Herramienta gratuita
        </div>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Unir PDF online
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Combina dos o más documentos PDF en uno solo. Arrastra las tarjetas para definir el
          orden de las páginas. Todo se procesa en tu navegador; tus archivos no se suben a
          ningún servidor.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Espacios publicitarios">
        <AdSlot index={1} />
        <AdSlot index={2} />
        <AdSlot index={3} />
      </section>

      {isCheckingAds ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" />
          Verificando compatibilidad del navegador...
        </div>
      ) : (
        <AdBlockerGate blocked={adBlockerDetected} />
      )}

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <section aria-label="Documentos PDF">
        <PdfGrid
          items={items}
          onReorder={setItems}
          onAddFiles={handleAddFiles}
          onRemove={handleRemove}
          disabled={adBlockerDetected}
        />
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length === 0
            ? "Aún no has agregado documentos."
            : `${items.length} documento${items.length === 1 ? "" : "s"} listo${items.length === 1 ? "" : "s"} para unir.`}
        </p>
        <Button size="lg" onClick={handleGenerateClick} disabled={!canGenerate}>
          Generar PDF unido
        </Button>
      </div>

      <GenerateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleConfirmGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
}
