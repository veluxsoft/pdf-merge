"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, FileText, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PdfItem } from "@/lib/types";

type PdfCardProps = {
  item: PdfItem;
  position: number;
  onRemove: (id: string) => void;
};

export function PdfCard({ item, position, onRemove }: PdfCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`h-full overflow-hidden shadow-sm ${isDragging ? "z-20 opacity-80 ring-2 ring-primary/30" : ""}`}
    >
      <CardContent className="flex h-full min-h-56 flex-col gap-3 p-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="shrink-0">
            #{position}
          </Badge>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="cursor-grab rounded-md p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing"
              aria-label={`Mover documento ${position}`}
              {...attributes}
              {...listeners}
            >
              <GripVertical className="size-4" />
            </button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onRemove(item.id)}
              aria-label={`Eliminar ${item.name}`}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="relative flex min-h-32 flex-1 items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
          {item.previewUrl ? (
            <Image
              src={item.previewUrl}
              alt={`Vista previa de ${item.name}`}
              fill
              unoptimized
              className="object-contain p-2"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <FileText className="size-10" />
              <span className="text-xs">Sin vista previa</span>
            </div>
          )}
        </div>

        <p className="truncate text-sm font-medium" title={item.name}>
          {item.name}
        </p>
      </CardContent>
    </Card>
  );
}
