/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { fileTypeFromBuffer } from "file-type";

export type LoadResult = { object: THREE.Object3D; filename: string };

export async function loadModel(file: File): Promise<LoadResult> {
  const buf = await file.arrayBuffer();
  const ft = await fileTypeFromBuffer(new Uint8Array(buf)).catch(() => undefined);

  const name = file.name.toLowerCase();
  const byExt = name.split(".").pop() || "";

  const ext = (ft?.ext ?? byExt) as string;

  if (ext === "glb" || ext === "gltf") {
    const loader = new GLTFLoader();
    const url = URL.createObjectURL(new Blob([buf]));
    try {
      const gltf = await loader.loadAsync(url);
      URL.revokeObjectURL(url);
      const object = gltf.scene || new THREE.Group();
      object.name ||= "GLTF_Scene";
      return { object, filename: file.name };
    } catch (e) {
      URL.revokeObjectURL(url);
      throw e;
    }
  }

  if (ext === "obj") {
    const loader = new OBJLoader();
    const text = new TextDecoder().decode(buf);
    const object = loader.parse(text);
    object.name ||= "OBJ_Scene";
    return { object, filename: file.name };
  }

  if (ext === "fbx") {
    throw new Error("FBX support is not enabled yet. Please load .glb/.gltf/.obj.");
  }

  throw new Error(`Unsupported format: ${ext || "unknown"}. Try .glb, .gltf, or .obj`);
}

export function computeStats(root: THREE.Object3D) {
  let tris = 0;
  const mats = new Set<THREE.Material>();

  root.traverse((o: THREE.Object3D) => {
    const m = o as THREE.Mesh;
    if ((m as any).isMesh && m.geometry) {
      const g = m.geometry as THREE.BufferGeometry;
      const pos = g.getAttribute("position");
      if (!pos) return;
      const index = g.getIndex();
      const t = index ? Math.floor(index.count / 3) : Math.floor(pos.count / 3);
      tris += t;

      const mat = m.material;
      if (Array.isArray(mat)) mat.forEach((x) => x && mats.add(x));
      else if (mat) mats.add(mat);
    }
  });

  return { triangles: tris, materials: mats.size };
}
