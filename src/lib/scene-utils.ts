/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";

export type SceneNode = {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  children: SceneNode[];
};

export function buildTree(obj: THREE.Object3D | null): SceneNode[] {
  if (!obj) return [];
  const toNode = (o: THREE.Object3D): SceneNode => ({
    id: o.uuid,
    name: o.name || o.type,
    type: o.type,
    visible: o.visible,
    children: o.children.map(toNode),
  });
  return obj.children.length ? obj.children.map(toNode) : [toNode(obj)];
}

export function findByUUID(root: THREE.Object3D | null, uuid: string): THREE.Object3D | null {
  if (!root) return null;
  let found: THREE.Object3D | null = null;
  root.traverse((o: THREE.Object3D) => {
    if (o.uuid === uuid) found = o;
  });
  return found;
}

export function getMeshAncestor(o: THREE.Object3D | null): THREE.Object3D | null {
  let cur = o;
  while (cur && !(cur as any).isMesh && cur.parent) cur = cur.parent;
  return cur ?? null;
}

export function setVisibility(
  root: THREE.Object3D | null,
  uuid: string,
  visible: boolean,
  recursive = false,
): void {
  const maybe = findByUUID(root, uuid);
  if (!maybe) return;
  const target: THREE.Object3D = maybe;

  if (recursive) {
    target.traverse((o: THREE.Object3D) => {
      o.visible = visible;
    });
    return;
  }
  target.visible = visible;
}

export function collectMaterials(root: THREE.Object3D | null): Set<THREE.Material> {
  const mats = new Set<THREE.Material>();
  if (!root) return mats;
  root.traverse((o: THREE.Object3D) => {
    const mesh = o as THREE.Mesh;
    if ((mesh as any).isMesh) {
      const m = mesh.material;
      if (Array.isArray(m)) m.forEach((x) => x && mats.add(x));
      else if (m) mats.add(m);
    }
  });
  return mats;
}
