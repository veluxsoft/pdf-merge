"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type AddPdfCardProps = {
  onFilesSelected: (files: FileList) => void;
  disabled?: boolean;
};

export function AddPdfCard({ onFilesSelected, disabled = false }: AddPdfCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="h-full border-dashed shadow-none">
      <CardContent className="flex h-full min-h-56 flex-col items-center justify-center gap-3 p-4">
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="flex size-14 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Agregar PDF"
        >
          <Plus className="size-7" />
        </button>
        <p className="text-center text-sm text-muted-foreground">Agregar PDF</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          disabled={disabled}
          onChange={(event) => {
            if (event.target.files && event.target.files.length > 0) {
              onFilesSelected(event.target.files);
              event.target.value = "";
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
