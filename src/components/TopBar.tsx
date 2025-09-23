"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Camera, FolderOpen, RotateCcw } from "lucide-react";

export function TopBar() {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="font-medium">3D Object Viewer</div>
      <Separator orientation="vertical" className="mx-2 h-6" />
      <div className="flex items-center gap-1">
        <Button size="sm" variant="secondary">
          <FolderOpen className="mr-2 h-4 w-4" /> Open
        </Button>
        <Button size="sm" variant="ghost">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
        <Button size="sm">
          <Camera className="mr-2 h-4 w-4" /> Screenshot
        </Button>
      </div>
      <div className="ml-auto text-xs text-muted-foreground">Step 1: Shell</div>
    </div>
  );
}
