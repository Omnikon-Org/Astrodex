"use client"

import { useRef, useCallback, useEffect, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import * as THREE from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"

import { Earth } from "./earth/Earth"
import { CloudLayer } from "./earth/CloudLayer"
import { Atmosphere } from "./earth/Atmosphere"
import { AsteroidField, trackedPosition } from "./AsteroidField"
import { SatelliteSystem } from "./SatelliteSystem"
import { CameraController } from "./CameraController"
import { Effects } from "./Effects"
import { useAppState } from "@/lib/store"
import type { AsteroidData } from "@/lib/types"

function SceneContent() {
  const sunDirection = useMemo(() => new THREE.Vector3(5, 3, 5).normalize(), [])
  const { selectedAsteroid, selectAsteroid } = useAppState()
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const selectedIndexRef = useRef<number | null>(null)

  const handleAsteroidClick = useCallback(
    (data: AsteroidData) => {
      selectedIndexRef.current = data.index
      selectAsteroid(data)
    },
    [selectAsteroid]
  )

  useEffect(() => {
    selectedIndexRef.current = selectedAsteroid?.index ?? null
  }, [selectedAsteroid])

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
      <CameraController controlsRef={controlsRef} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan
        enableZoom
        enableRotate
        enableDamping
        dampingFactor={0.06}
        minDistance={2.12}
        maxDistance={24}
        screenSpacePanning
        rotateSpeed={0.72}
        zoomSpeed={0.82}
        panSpeed={0.72}
      />
      <Effects />
    </>
  )
}

export function Scene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 13], fov: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: false }}
      >
        <SceneContent />
      </Canvas>
      <div className="globe-gesture-hint" aria-hidden="true">
        <span>DRAG</span> ROTATE <i /> <span>PINCH / WHEEL</span> ZOOM <i /> <span>RIGHT DRAG</span> PAN
      </div>
    </div>
  )
}
