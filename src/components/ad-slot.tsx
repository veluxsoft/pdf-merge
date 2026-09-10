type AdSlotProps = {
  index: number;
};

/**
 * Placeholder for future ad providers (AdSense, etc.).
 * Rule for later: show 3 ads per PDF document added before generation.
 */
export function AdSlot({ index }: AdSlotProps) {
  return (
    <div
      className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 px-4 text-center text-xs text-muted-foreground"
      data-ad-slot={index}
      aria-label={`Espacio publicitario ${index}`}
    >
      Espacio publicitario {index}
    </div>
  );
}
