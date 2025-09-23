import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LightingPreset = "studio" | "threePoint" | "hdri";

type UIState = {
  showGrid: boolean;
  showAxes: boolean;
  lighting: LightingPreset;
};

type SceneState = {
  loadedFileName: string | null;
  selectionId: string | null;
  ui: UIState;
  setFileName: (name: string | null) => void;
  setSelection: (id: string | null) => void;
  setUI: (patch: Partial<UIState>) => void;
};

export const useSceneStore = create<SceneState>()(
  persist(
    (set) => ({
      loadedFileName: null,
      selectionId: null,
      ui: { showGrid: true, showAxes: true, lighting: "studio" },
      setFileName: (name) => set({ loadedFileName: name }),
      setSelection: (id) => set({ selectionId: id }),
      setUI: (patch) => set((s) => ({ ui: { ...s.ui, ...patch } })),
    }),
    { name: "viewer-ui" },
  ),
);
