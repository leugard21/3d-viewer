/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useSceneStore } from "@/store/use-scene-store";
import { collectMaterials } from "@/lib/scene-utils";
import { toStandardMaterial, replaceMaterial, colorToHex, hexToColor } from "@/lib/material-utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

function useThrottle<T>(value: T, delay = 50) {
  const [v, setV] = React.useState(value);
  const t = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setV(value), delay);
    return () => {
      if (t.current) clearTimeout(t.current);
    };
  }, [value, delay]);
  return v;
}

export function MaterialsPanel() {
  const root = useSceneStore((s) => s.object);
  const mats = useMemo(() => Array.from(collectMaterials(root)), [root]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const selected = mats[selectedIndex];

  const [stdMat, setStdMat] = React.useState<THREE.MeshStandardMaterial | null>(null);
  const lastMatRef = useRef<THREE.Material | null>(null);

  React.useEffect(() => {
    setStdMat(null);
    lastMatRef.current = null;
  }, [selectedIndex, root]);

  function ensureStandard(): THREE.MeshStandardMaterial | null {
    if (!root || !selected) return null;
    if (selected instanceof THREE.MeshStandardMaterial) {
      lastMatRef.current = selected;
      setStdMat(selected);
      return selected;
    }
    const converted = toStandardMaterial(selected);
    replaceMaterial(root, selected, converted);
    lastMatRef.current = converted;
    setStdMat(converted);
    return converted;
  }

  const [metalness, setMetalness] = React.useState<number | null>(null);
  const [roughness, setRoughness] = React.useState<number | null>(null);
  const [wireframe, setWireframe] = React.useState<boolean | null>(null);
  const metalnessT = useThrottle(metalness, 50);
  const roughnessT = useThrottle(roughness, 50);

  React.useEffect(() => {
    const m = stdMat ?? (selected instanceof THREE.MeshStandardMaterial ? selected : null);
    if (!m) return;
    if (metalnessT !== null) m.metalness = metalnessT;
    if (roughnessT !== null) m.roughness = roughnessT;
  }, [metalnessT, roughnessT, stdMat, selected]);

  React.useEffect(() => {
    const m = stdMat ?? (selected instanceof THREE.MeshStandardMaterial ? selected : null);
    if (!m || wireframe === null) return;
    m.wireframe = wireframe;
  }, [wireframe, stdMat, selected]);

  if (!root || mats.length === 0) {
    return <div className="p-3 text-xs text-muted-foreground">Load a model to edit materials.</div>;
  }

  const m = (stdMat ??
    (selected instanceof THREE.MeshStandardMaterial
      ? selected
      : null)) as THREE.MeshStandardMaterial | null;

  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <h3 className="text-sm font-semibold">Materials</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Editing applies to every mesh using the same material instance.
        </p>
      </div>
      <Separator />
      <div className="p-3 space-y-2">
        <Label htmlFor="mat-select" className="text-xs">
          Select Material
        </Label>
        <select
          id="mat-select"
          className="w-full rounded border bg-background p-1 text-xs"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(parseInt(e.target.value, 10))}
        >
          {mats.map((mat, i) => (
            <option key={i} value={i}>
              {mat.name || `Material ${i + 1}`} · {mat.type}
            </option>
          ))}
        </select>
      </div>

      <ScrollArea className="h-[22rem] px-3 pb-3">
        <div className="mt-3 space-y-1">
          <Label className="text-xs">Base Color</Label>
          <input
            type="color"
            className="h-8 w-full cursor-pointer rounded border bg-background"
            value={colorToHex(
              ((m ?? (selected as any)?.color)
                ? (selected as any).color
                : new THREE.Color(1, 1, 1)) as THREE.Color,
            )}
            onChange={(e) => {
              const target = ensureStandard();
              if (!target) return;
              target.color.copy(hexToColor(e.target.value));
            }}
          />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Metalness</Label>
            <span className="text-xs text-muted-foreground">
              {(m ? m.metalness : 0).toFixed(2)}
            </span>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.01}
            defaultValue={[m ? m.metalness : 0]}
            onValueChange={([v]) => {
              ensureStandard();
              setMetalness(v);
            }}
          />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Roughness</Label>
            <span className="text-xs text-muted-foreground">
              {(m ? m.roughness : 1).toFixed(2)}
            </span>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.01}
            defaultValue={[m ? m.roughness : 1]}
            onValueChange={([v]) => {
              ensureStandard();
              setRoughness(v);
            }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Label className="text-xs">Wireframe</Label>
          <Switch
            checked={m ? m.wireframe : false}
            onCheckedChange={(v) => {
              ensureStandard();
              setWireframe(v);
            }}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
