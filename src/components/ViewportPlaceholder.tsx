"use client";
export function ViewportPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        R3F Canvas will render here (Step 2)
      </div>
    </div>
  );
}
