"use client"

import { useRef, useCallback, useMemo, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
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
  const { selectAsteroid, searchAsteroidById } = useAppState()
  const selectedIndexRef = useRef<number | null>(null)

  const handleAsteroidClick = useCallback(
    (data: any) => {
      selectedIndexRef.current = data.index
      selectAsteroid(data)
    },
    [selectAsteroid]
  )

  const getSelectedIndex = useCallback(() => selectedIndexRef.current, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (document.activeElement?.tagName === "INPUT") return

      let currentIndex = selectedIndexRef.current
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        const nextIndex = currentIndex === null ? 1 : Math.min(currentIndex + 1, 600)
        selectedIndexRef.current = nextIndex
        searchAsteroidById(nextIndex)
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        const prevIndex = currentIndex === null ? 600 : Math.max(currentIndex - 1, 1)
        selectedIndexRef.current = prevIndex
        searchAsteroidById(prevIndex)
      } else if (e.key === "Escape") {
        selectedIndexRef.current = null
        selectAsteroid(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchAsteroidById, selectAsteroid])

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
    </div>
  )
}
