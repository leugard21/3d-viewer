# 3D Object Viewer

An interactive 3D model viewer built with **Next.js** + **three.js** via `@react-three/fiber`.  
Supports loading `.glb`, `.gltf`, `.obj`, and `.fbx` (basic). Features orbit controls, materials editing, transform gizmos, and export.

---

## Features

- **Load Models** via drag & drop or file picker
  - Supports `.glb`, `.gltf`, `.obj` (FBX optional with worker/fallback)
  - Shows file name, triangle count, material count
- **Viewport**
  - OrbitControls (rotate/pan/zoom)
  - Grid + axes helpers (toggle)
  - Lighting presets: Studio, Three-Point, HDRI placeholder
  - Fit-to-view, fit selection, reset camera
- **Inspector**
  - Scene hierarchy tree
  - Click-to-select + selection highlight
  - Visibility toggles per node
- **Materials Panel**
  - List unique materials
  - Edit base color, metalness, roughness
  - Wireframe toggle
- **Transform Tools**
  - Translate / Rotate / Scale via gizmo
  - Numeric input fields
  - Reset transform
- **Export**
  - Screenshot (PNG)
  - Export to `.glb` (GLTFExporter)
- **Polish**
  - Collapsible sidebar + per-panel collapse
  - Keyboard shortcuts (G/R/S/F/H/M, 1/2/3)
  - Optional performance stats (Stats.js)

---

## Tech Stack

- [Next.js App Router](https://nextjs.org/) (TypeScript)
- [three.js](https://threejs.org/) via [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
- [@react-three/drei](https://github.com/pmndrs/drei) helpers
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [lucide-react](https://lucide.dev/) icons
- [zustand](https://github.com/pmndrs/zustand) for state
- Utilities: `file-type`, `three/examples/GLTFExporter`

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/leugard21/3d-viewer.git
cd 3d-viewer
yarn install
```
