/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Camera, FolderOpen, RotateCcw, Sun, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSceneStore } from "@/store/use-scene-store";

export function TopBar() {
  const lighting = useSceneStore((s) => s.ui.lighting);
  const setUI = useSceneStore((s) => s.setUI);
  const requestFileOpen = useSceneStore((s) => s.requestFileOpen);
  const setScene = useSceneStore((s) => s.setScene);
  const filename = useSceneStore((s) => s.filename);

  return (
    <div className="flex w-full items-center gap-2">
      <div className="font-medium">3D Object Viewer</div>
      <Separator orientation="vertical" className="mx-2 h-6" />

      <div className="flex items-center gap-1">
        <Button size="sm" variant="secondary" onClick={() => requestFileOpen()}>
          <FolderOpen className="mr-2 h-4 w-4" /> Open
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setScene({ object: null, filename: null, stats: null })}
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
        <Button
          size="sm"
          onClick={() => document.dispatchEvent(new CustomEvent("viewer-screenshot"))}
        >
          <Camera className="mr-2 h-4 w-4" /> Screenshot
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            document.dispatchEvent(
              new CustomEvent("viewer-export-glb", {
                detail: { suggested: (filename || "scene").replace(/\.[^.]+$/, "") },
              }),
            )
          }
        >
          <Download className="mr-2 h-4 w-4" /> Export .glb
        </Button>
      </div>

      <Separator orientation="vertical" className="mx-2 h-6" />
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4" />
        <Select value={lighting} onValueChange={(v) => setUI({ lighting: v as any })}>
          <SelectTrigger className="h-8 w-[160px]">
            <SelectValue placeholder="Lighting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="threePoint">Three-Point</SelectItem>
            <SelectItem value="hdri">HDRI (placeholder)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
