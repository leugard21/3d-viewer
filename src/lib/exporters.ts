/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

export async function exportGLB(root: THREE.Object3D): Promise<Blob> {
  const exporter = new GLTFExporter();
  const options: any = {
    binary: true,
    trs: false,
    onlyVisible: true,
    embedImages: true,
    animations: [],
  };

  return new Promise<Blob>((resolve, reject) => {
    exporter.parse(
      root,
      (result: ArrayBuffer | Record<string, unknown>) => {
        if (result instanceof ArrayBuffer) {
          resolve(new Blob([result], { type: "model/gltf-binary" }));
        } else {
          const json = JSON.stringify(result);
          resolve(new Blob([json], { type: "model/gltf+json" }));
        }
      },
      (error) => reject(error),
      options,
    );
  });
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
