"use client";

import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { useSceneStore } from "@/store/use-scene-store";
import { InspectorTree } from "@/components/InspectorTree";
import { MaterialsPanel } from "@/components/MaterialsPanel";
import { TransformPanel } from "@/components/TransformPanel";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { collectMaterials } from "@/lib/scene-utils";

export function Sidebar() {
  const ui = useSceneStore((s) => s.ui);
  const setUI = useSceneStore((s) => s.setUI);
  const selectionId = useSceneStore((s) => s.selectionId);
  const root = useSceneStore((s) => s.object);

  const matCount = collectMaterials(root).size;

  if (ui.sidebarCollapsed) {
    return (
      <div className="flex h-full flex-col items-center gap-2 py-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Expand sidebar"
          onClick={() => setUI({ sidebarCollapsed: false })}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-3">
        <div>
          <h2 className="text-sm font-semibold">Inspector</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Selected UUID: <span className="font-medium">{selectionId ?? "—"}</span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Collapse sidebar"
          onClick={() => setUI({ sidebarCollapsed: true })}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>

      <CollapsibleSection
        title="Hierarchy"
        open={!ui.panel.inspector ? true : false ? false : !ui.panel.inspector}
        onOpenChange={(v) => setUI({ panel: { ...ui.panel, inspector: !v } })}
      >
        <InspectorTree />
      </CollapsibleSection>
      <Separator />

      <CollapsibleSection
        title={
          <span>
            Materials <span className="text-xs text-muted-foreground">({matCount})</span>
          </span>
        }
        open={!ui.panel.materials}
        onOpenChange={(v) => setUI({ panel: { ...ui.panel, materials: !v } })}
      >
        <MaterialsPanel />
      </CollapsibleSection>
      <Separator />

      <CollapsibleSection
        title="Transform"
        open={!ui.panel.transform}
        onOpenChange={(v) => setUI({ panel: { ...ui.panel, transform: !v } })}
      >
        <TransformPanel />
      </CollapsibleSection>
      <Separator />

      <CollapsibleSection
        title="Scene Helpers"
        open={!ui.panel.helpers}
        onOpenChange={(v) => setUI({ panel: { ...ui.panel, helpers: !v } })}
      >
        <div className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="grid" className="text-xs">
              Grid
            </Label>
            <Switch
              id="grid"
              checked={ui.showGrid}
              onCheckedChange={(v) => setUI({ showGrid: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="axes" className="text-xs">
              Axes
            </Label>
            <Switch
              id="axes"
              checked={ui.showAxes}
              onCheckedChange={(v) => setUI({ showAxes: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="stats" className="text-xs">
              Perf Stats
            </Label>
            <Switch
              id="stats"
              checked={ui.showStats}
              onCheckedChange={(v) => setUI({ showStats: v })}
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
