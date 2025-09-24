/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";

export function toStandardMaterial(mat: THREE.Material): THREE.MeshStandardMaterial {
  if (mat instanceof THREE.MeshStandardMaterial) return mat;

  const std = new THREE.MeshStandardMaterial();
  const asAny = mat as any;
  if ("color" in asAny && asAny.color) std.color.copy(asAny.color);
  if ("wireframe" in asAny) std.wireframe = !!asAny.wireframe;

  std.metalness = 0.0;
  std.roughness = 0.8;

  return std;
}

export function replaceMaterial(
  root: THREE.Object3D,
  oldMat: THREE.Material,
  newMat: THREE.Material,
) {
  root.traverse((o: THREE.Object3D) => {
    const m = (o as any).material as THREE.Material | THREE.Material[] | undefined;
    if (!m) return;
    if (Array.isArray(m)) {
      let changed = false;
      const next = m.map((x) => {
        if (x === oldMat) {
          changed = true;
          return newMat;
        }
        return x;
      });
      if (changed) (o as any).material = next;
    } else {
      if (m === oldMat) (o as any).material = newMat;
    }
  });
}

export function colorToHex(c: THREE.Color): string {
  return `#${c.getHexString()}`;
}
export function hexToColor(hex: string): THREE.Color {
  const c = new THREE.Color();
  c.set(hex);
  return c;
}
