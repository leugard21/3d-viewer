"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Bounds } from "@react-three/drei";
import { useMemo } from "react";
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

function ThreePointsLight() {
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
  if (preset === "threePoint") return <ThreePointsLight />;

  return <StudioLights />;
}

function Helpers() {
  const { showGrid, showAxes } = useSceneStore((s) => s.ui);

  return (
    <>
      {showGrid && <gridHelper args={[20, 20]} />} {showAxes && <axesHelper args={[2.5]} />}
    </>
  );
}

export function ViewportCanvas() {
  const camera = useMemo(
    () => ({
      fov: 50,
      near: 0.1,
      far: 1000,
      position: [3, 2, 6] as [number, number, number],
    }),
    [],
  );

  return (
    <div className="h-full w-full">
      <Canvas camera={camera} gl={{ antialias: true, preserveDrawingBuffer: true }} shadows>
        <color attach={"background"} args={["#0b0b0c"]} />
        <Lighting />
        <Helpers />

        <Bounds fit clip observe margin={1.2}>
          <group name="sceneRoot" />
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
    </div>
  );
}
