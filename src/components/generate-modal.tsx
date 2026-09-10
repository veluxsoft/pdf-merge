"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type GenerateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (fileName: string) => Promise<void>;
  isGenerating: boolean;
};

export function GenerateModal({
  open,
  onOpenChange,
  onConfirm,
  isGenerating,
}: GenerateModalProps) {
  const [fileName, setFileName] = useState("documento_unido");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = fileName.trim();

    if (!trimmed) {
      setError("Ingresa un nombre para el documento.");
      return;
    }

    setError(null);
    await onConfirm(trimmed);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isGenerating) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nombre del documento</DialogTitle>
            <DialogDescription>
              El PDF unido se descargará con este nombre en tu dispositivo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 py-4">
            <Label htmlFor="file-name">Nombre del archivo</Label>
            <Input
              id="file-name"
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              placeholder="documento_unido"
              disabled={isGenerating}
              autoFocus
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isGenerating}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? "Generando..." : "Generar y descargar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
