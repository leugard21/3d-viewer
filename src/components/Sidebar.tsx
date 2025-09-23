"use client";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSceneStore } from "@/store/use-scene-store";

export function Sidebar() {
  const ui = useSceneStore((s) => s.ui);
  const setUI = useSceneStore((s) => s.setUI);

  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <h2 className="text-sm font-semibold">Inspector</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Mesh tree, materials, transforms — coming next.
        </p>
      </div>
      <Separator />
      <div className="p-3 space-y-3">
        <h3 className="text-xs font-medium">Scene Helpers</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="grid" className="text-xs">
            Grid
          </Label>
          <Switch id="grid" checked={ui.showGrid} onCheckedChange={(v) => setUI({ showGrid: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="axes" className="text-xs">
            Axes
          </Label>
          <Switch id="axes" checked={ui.showAxes} onCheckedChange={(v) => setUI({ showAxes: v })} />
        </div>
      </div>
    </div>
  );
}
