"use client"

import { useRef, useCallback, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { Stars, Loader } from "@react-three/drei"
import * as THREE from "three"

import { Earth } from "./earth/Earth"
import { CloudLayer } from "./earth/CloudLayer"
import { Atmosphere } from "./earth/Atmosphere"
import { AsteroidField, trackedPosition } from "./AsteroidField"
import { SatelliteSystem } from "./SatelliteSystem"
import { CameraController } from "./CameraController"
import { Effects } from "./Effects"
import { useAppState } from "@/lib/store"

function SceneContent() {
  const sunDirection = useMemo(() => new THREE.Vector3(5, 3, 5).normalize(), [])
  const { selectAsteroid } = useAppState()
  const selectedIndexRef = useRef<number | null>(null)

  const handleAsteroidClick = useCallback(
    (data: any) => {
      selectedIndexRef.current = data.index
      selectAsteroid(data)
    },
    [selectAsteroid]
  )

  const getSelectedIndex = useCallback(() => selectedIndexRef.current, [])

  return (
    <>
      <color attach="background" args={["#000008"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={2} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

      <Earth sunDirection={sunDirection} />
      <CloudLayer sunDirection={sunDirection} />
      <Atmosphere sunDirection={sunDirection} />

      <SatelliteSystem />

      <AsteroidField
        onAsteroidClick={handleAsteroidClick}
        getSelectedIndex={getSelectedIndex}
      />
      <CameraController />
      <Effects />
    </>
  )
}

export function Scene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
      >
        <SceneContent />
      </Canvas>
      <Loader
        containerStyles={{ background: "rgba(10, 16, 28, 0.95)" }}
        innerStyles={{ width: "300px", border: "1px solid rgba(56, 189, 248, 0.4)", background: "rgba(0,0,0,0)" }}
        barStyles={{ background: "var(--accent-cyan)", height: "4px" }}
        dataInterpolation={(p) => `Astrodex Booting... ${p.toFixed(0)}%`}
      />
    </div>
  )
}
