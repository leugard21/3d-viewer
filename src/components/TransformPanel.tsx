"use client";

import * as THREE from "three";
import { useSceneStore } from "@/store/use-scene-store";
import { findByUUID } from "@/lib/scene-utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Move3D, Rotate3D, Scale, RefreshCcw } from "lucide-react";
import { useMemo } from "react";

function useSelectedObject(): THREE.Object3D | null {
  const root = useSceneStore((s) => s.object);
  const id = useSceneStore((s) => s.selectionId);
  return useMemo(() => (id ? findByUUID(root, id) : null), [root, id]);
}

function Num({
  label,
  value,
  onChange,
  step = 0.1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-2">
      <Label className="text-xs">{label}</Label>
      <Input
        className="h-8 w-28 text-xs"
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

export function TransformPanel() {
  const mode = useSceneStore((s) => s.ui.transformMode);
  const setUI = useSceneStore((s) => s.setUI);
  const selected = useSelectedObject();

  const pos = selected?.position ?? new THREE.Vector3();
  const rot = selected?.rotation ?? new THREE.Euler();
  const scl = selected?.scale ?? new THREE.Vector3(1, 1, 1);

  return (
    <div className="p-3 space-y-3">
      <h3 className="text-sm font-semibold">Transform</h3>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant={mode === "translate" ? "default" : "secondary"}
          onClick={() => setUI({ transformMode: "translate" })}
        >
          <Move3D className="mr-2 h-4 w-4" /> Move
        </Button>
        <Button
          size="sm"
          variant={mode === "rotate" ? "default" : "secondary"}
          onClick={() => setUI({ transformMode: "rotate" })}
        >
          <Rotate3D className="mr-2 h-4 w-4" /> Rotate
        </Button>
        <Button
          size="sm"
          variant={mode === "scale" ? "default" : "secondary"}
          onClick={() => setUI({ transformMode: "scale" })}
        >
          <Scale className="mr-2 h-4 w-4" /> Scale
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-2">
        <Num label="Pos X" value={pos.x} onChange={(v) => selected && (selected.position.x = v)} />
        <Num label="Pos Y" value={pos.y} onChange={(v) => selected && (selected.position.y = v)} />
        <Num label="Pos Z" value={pos.z} onChange={(v) => selected && (selected.position.z = v)} />
      </div>

      <div className="grid grid-cols-1 gap-2 pt-2">
        <Num
          label="Rot X°"
          step={1}
          value={(rot.x * 180) / Math.PI}
          onChange={(v) => selected && (selected.rotation.x = (v * Math.PI) / 180)}
        />
        <Num
          label="Rot Y°"
          step={1}
          value={(rot.y * 180) / Math.PI}
          onChange={(v) => selected && (selected.rotation.y = (v * Math.PI) / 180)}
        />
        <Num
          label="Rot Z°"
          step={1}
          value={(rot.z * 180) / Math.PI}
          onChange={(v) => selected && (selected.rotation.z = (v * Math.PI) / 180)}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 pt-2">
        <Num label="Scl X" value={scl.x} onChange={(v) => selected && (selected.scale.x = v)} />
        <Num label="Scl Y" value={scl.y} onChange={(v) => selected && (selected.scale.y = v)} />
        <Num label="Scl Z" value={scl.z} onChange={(v) => selected && (selected.scale.z = v)} />
      </div>

      <div className="pt-3">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (!selected) return;
            selected.position.set(0, 0, 0);
            selected.rotation.set(0, 0, 0);
            selected.scale.set(1, 1, 1);
          }}
        >
          <RefreshCcw className="mr-2 h-4 w-4" /> Reset Transform
        </Button>
      </div>
    </div>
  );
}
