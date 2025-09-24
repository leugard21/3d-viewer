"use client";
import * as React from "react";
import { useSceneStore } from "@/store/use-scene-store";

export function KeyboardShortcuts() {
  const ui = useSceneStore((s) => s.ui);
  const setUI = useSceneStore((s) => s.setUI);
  const selectionId = useSceneStore((s) => s.selectionId);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      switch (e.key.toLowerCase()) {
        case "g":
          setUI({ transformMode: "translate" });
          break;
        case "r":
          setUI({ transformMode: "rotate" });
          break;
        case "s":
          setUI({ transformMode: "scale" });
          break;
        case "f":
          document.dispatchEvent(
            new CustomEvent("viewer-fit-selection", { detail: { selectionId } }),
          );
          break;
        case "h":
          setUI({ showGrid: !ui.showGrid, showAxes: !ui.showAxes });
          break;
        case "m":
          setUI({ sidebarCollapsed: !ui.sidebarCollapsed });
          break;
        case "1":
          setUI({ lighting: "studio" });
          break;
        case "2":
          setUI({ lighting: "threePoint" });
          break;
        case "3":
          setUI({ lighting: "hdri" });
          break;
        default:
          return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ui, setUI, selectionId]);

  return null;
}
