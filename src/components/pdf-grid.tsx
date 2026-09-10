"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { AddPdfCard } from "@/components/add-pdf-card";
import { PdfCard } from "@/components/pdf-card";
import type { PdfItem } from "@/lib/types";

type PdfGridProps = {
  items: PdfItem[];
  onReorder: (items: PdfItem[]) => void;
  onAddFiles: (files: FileList) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
};

export function PdfGrid({
  items,
  onReorder,
  onAddFiles,
  onRemove,
  disabled = false,
}: PdfGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const next = [...items];
    const [moved] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, moved);
    onReorder(next);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => (
            <PdfCard
              key={item.id}
              item={item}
              position={index + 1}
              onRemove={onRemove}
            />
          ))}
          <AddPdfCard onFilesSelected={onAddFiles} disabled={disabled} />
        </div>
      </SortableContext>
    </DndContext>
  );
}
