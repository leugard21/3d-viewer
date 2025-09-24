/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LightingPreset = "studio" | "threePoint" | "hdri";
export type TransformMode = "translate" | "rotate" | "scale";

type UIState = {
  showGrid: boolean;
  showAxes: boolean;
  showStats: boolean;
  lighting: LightingPreset;
  transformMode: TransformMode;
  sidebarCollapsed: boolean;
  panel: {
    inspector: boolean;
    materials: boolean;
    transform: boolean;
    helpers: boolean;
  };
};

type Stats = { triangles: number; materials: number };

type SceneState = {
  object: THREE.Object3D | null;
  filename: string | null;
  stats: Stats | null;
  error: string | null;

  selectionId: string | null;
  ui: UIState;

  isTransforming: boolean;

  setScene: (p: {
    object: THREE.Object3D | null;
    filename: string | null;
    stats: Stats | null;
  }) => void;
  setError: (msg: string | null) => void;
  setSelection: (id: string | null) => void;

  setUI: (patch: Partial<UIState>) => void;
  setUIPanel: (patch: Partial<UIState["panel"]>) => void;

  // File open signal
  fileOpenRequestId: number;
  requestFileOpen: () => void;

  setIsTransforming: (v: boolean) => void;
};

const initialUI: UIState = {
  showGrid: true,
  showAxes: true,
  lighting: "studio",
  showStats: false,
  transformMode: "translate",
  sidebarCollapsed: false,
  panel: {
    inspector: false,
    materials: false,
    transform: false,
    helpers: false,
  },
};

export const useSceneStore = create<SceneState>()(
  persist(
    (set, get) => ({
      object: null,
      filename: null,
      stats: null,
      error: null,

      selectionId: null,
      ui: initialUI,

      isTransforming: false,

      setScene: ({ object, filename, stats }) => set({ object, filename, stats, error: null }),
      setError: (msg) => set({ error: msg }),
      setSelection: (id) => set({ selectionId: id }),

      setUI: (patch) =>
        set((s) => ({
          ui: {
            ...s.ui,
            ...patch,
            panel: patch.panel ? { ...s.ui.panel, ...patch.panel } : s.ui.panel,
          },
        })),

      setUIPanel: (patch) =>
        set((s) => ({
          ui: { ...s.ui, panel: { ...s.ui.panel, ...patch } },
        })),

      fileOpenRequestId: 0,
      requestFileOpen: () => set({ fileOpenRequestId: get().fileOpenRequestId + 1 }),

      setIsTransforming: (v) => set({ isTransforming: v }),
    }),
    {
      name: "viewer-ui",
      version: 2,
      partialize: (state) => ({ ui: state.ui }),
      migrate: (persisted, fromVersion) => {
        if (!persisted) return persisted as any;

        const ui = (persisted as any).ui ?? {};
        const nextUI: UIState = {
          ...initialUI,
          ...ui,
          showStats: ui.showStats ?? initialUI.showStats,
          panel: {
            ...initialUI.panel,
            ...(ui.panel ?? {}),
          },
        };

        if (fromVersion < 2) {
        }

        (persisted as any).ui = nextUI;
        return persisted as any;
      },
    },
  ),
);
