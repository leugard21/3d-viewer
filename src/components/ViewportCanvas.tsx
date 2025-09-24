"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Bounds, useBounds } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { useSceneStore } from "@/store/use-scene-store";

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />
    </>
  );
}
function ThreePointLights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[6, 6, 4]} intensity={0.9} />
      <directionalLight position={[-6, 2, 2]} intensity={0.4} />
      <directionalLight position={[0, 5, -6]} intensity={0.6} />
    </>
  );
}

function Lighting() {
  const preset = useSceneStore((s) => s.ui.lighting);
  if (preset === "threePoint") return <ThreePointLights />;
  return <StudioLights />;
}

function Helpers() {
  const { showGrid, showAxes } = useSceneStore((s) => s.ui);
  return (
    <>
      {showGrid && <gridHelper args={[20, 20]} />}
      {showAxes && <axesHelper args={[2.5]} />}
    </>
  );
}

function SceneObject() {
  const object = useSceneStore((s) => s.object);
  if (!object) return null;
  return <primitive object={object} />;
}

function AutoFitOnSignal() {
  const api = useBounds();
  useEffect(() => {
    const handler = () => {
      try {
        api.refresh().fit().clip();
      } catch {}
    };
    document.addEventListener("viewer-fit-bounds", handler);
    return () => document.removeEventListener("viewer-fit-bounds", handler);
  }, [api]);
  return null;
}

export function ViewportCanvas() {
  const camera = useMemo(
    () => ({ fov: 50, near: 0.1, far: 1000, position: [3, 2, 6] as [number, number, number] }),
    [],
  );

  const filename = useSceneStore((s) => s.filename);
  const stats = useSceneStore((s) => s.stats);
  const error = useSceneStore((s) => s.error);

  return (
    <div className="relative h-full w-full">
      <Canvas camera={camera} gl={{ antialias: true, preserveDrawingBuffer: true }} shadows>
        <color attach="background" args={["#0b0b0c"]} />
        <Lighting />
        <Helpers />

        <Bounds fit clip observe margin={1.2}>
          <SceneObject />
          <AutoFitOnSignal />
        </Bounds>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.9}
          panSpeed={0.8}
          zoomSpeed={0.9}
        />
      </Canvas>

      <div className="pointer-events-none absolute left-2 top-2 rounded-md bg-background/70 p-2 text-xs shadow">
        {filename ? (
          <div>
            <div className="font-medium">{filename}</div>
            {stats && (
              <div className="mt-1 text-muted-foreground">
                ◭ {stats.triangles.toLocaleString()} · 🧱 {stats.materials}
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground">Open or drop a file…</div>
        )}
        {error && <div className="mt-1 text-red-500">{error}</div>}
      </div>
    </div>
  );
}
