"use client";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <h2 className="text-sm font-semibold">Inspector</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Mesh tree, materials, transforms — coming next.
        </p>
      </div>
      <Separator />
      <div className="p-3">
        <h3 className="text-xs font-medium">Scene</h3>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          <li>• Grid / Axes toggles</li>
          <li>• Lighting presets</li>
          <li>• Camera tools</li>
        </ul>
      </div>
    </div>
  );
}
