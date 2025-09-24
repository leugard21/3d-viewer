/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSceneStore } from "@/store/use-scene-store";
import { computeStats, loadModel } from "@/lib/loaders";
import { useBounds } from "@react-three/drei";

export function SceneLoader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useSceneStore((s) => s.fileOpenRequestId);
  const setScene = useSceneStore((s) => s.setScene);
  const setError = useSceneStore((s) => s.setError);

  useEffect(() => {
    inputRef.current?.click();
  }, [requestId]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const { object, filename } = await loadModel(file);
      const stats = computeStats(object);
      setScene({ object, filename, stats });
      setError(null);
      document.dispatchEvent(new CustomEvent("viewer-fit-bounds"));
    } catch (e: any) {
      setScene({ object: null, filename: null, stats: null });
      setError(e?.message || "Failed to load model");
    }
  }

  const [dragging, setDragging] = useState(false);
  const overlay = useMemo(
    () => (
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ display: dragging ? "flex" : "none" }}
      >
        <div className="rounded-xl border border-dashed bg-background/80 px-6 py-4 text-sm text-muted-foreground">
          Drop a .glb / .gltf / .obj file to load
        </div>
      </div>
    ),
    [dragging],
  );

  useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      setDragging(true);
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dt = e.dataTransfer;
      if (dt && dt.files?.length) handleFiles(dt.files);
    };
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".glb,.gltf,.obj,.fbx"
        className="hidden"
        onChange={(e) => handleFiles(e.currentTarget.files)}
      />
      {overlay}
    </>
  );
}
