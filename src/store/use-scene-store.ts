import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Object3D, Material } from "three";

export type LightingPreset = "studio" | "threePoint" | "hdri";

type UIState = {
  showGrid: boolean;
  showAxes: boolean;
  lighting: LightingPreset;
};

type Stats = {
  triangles: number;
  materials: number;
};

type SceneState = {
  object: Object3D | null;
  filename: string | null;
  stats: Stats | null;
  error: string | null;

  selectionId: string | null;
  ui: UIState;

  setScene: (payload: {
    object: Object3D | null;
    filename: string | null;
    stats: Stats | null;
  }) => void;
  setError: (msg: string | null) => void;
  setSelection: (id: string | null) => void;
  setUI: (patch: Partial<UIState>) => void;

  fileOpenRequestId: number;
  requestFileOpen: () => void;
};

export const useSceneStore = create<SceneState>()(
  persist(
    (set, get) => ({
      object: null,
      filename: null,
      stats: null,
      error: null,

      selectionId: null,
      ui: { showGrid: true, showAxes: true, lighting: "studio" },

      setScene: ({ object, filename, stats }) => set({ object, filename, stats, error: null }),
      setError: (msg) => set({ error: msg }),
      setSelection: (id) => set({ selectionId: id }),
      setUI: (patch) => set((s) => ({ ui: { ...s.ui, ...patch } })),

      fileOpenRequestId: 0,
      requestFileOpen: () => set({ fileOpenRequestId: get().fileOpenRequestId + 1 }),
    }),
    {
      name: "viewer-ui",
      partialize: (state) => ({ ui: state.ui }),
    },
  ),
);
