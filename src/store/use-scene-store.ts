/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LightingPreset = "studio" | "threePoint" | "hdri";
export type TransformMode = "translate" | "rotate" | "scale";

type UIState = {
  showGrid: boolean;
  showAxes: boolean;
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
      version: 2, // bump when UI shape changes
      partialize: (state) => ({ ui: state.ui }),
      migrate: (persisted, fromVersion) => {
        // If nothing was persisted yet, just use it as-is.
        if (!persisted) return persisted as any;

        // Ensure we always have a valid UI shape
        const ui = (persisted as any).ui ?? {};
        const nextUI: UIState = {
          ...initialUI,
          ...ui,
          panel: {
            ...initialUI.panel,
            ...(ui.panel ?? {}),
          },
        };

        // Add more migrations per version here if needed
        if (fromVersion < 2) {
          // v1 -> v2 ensured panel + sidebarCollapsed defaulted above
        }

        (persisted as any).ui = nextUI;
        return persisted as any;
      },
    },
  ),
);
