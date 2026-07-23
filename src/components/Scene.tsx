"use client"

import { useRef, useCallback, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Stats, Stars } from "@react-three/drei"
import * as THREE from "three"

import { Earth } from "./earth/Earth"
import { CloudLayer } from "./earth/CloudLayer"
import { Atmosphere } from "./earth/Atmosphere"
import { AsteroidField } from "./AsteroidField"
import { SatelliteSystem } from "./SatelliteSystem"
import { CameraController } from "./CameraController"
import { Effects } from "./Effects"
import { useAppState } from "@/lib/store"
import type { AsteroidData } from "@/lib/types"

function createFlareTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext("2d")!
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, "rgba(255,255,255,0.95)")
  gradient.addColorStop(0.25, "rgba(255,220,140,0.5)")
  gradient.addColorStop(0.55, "rgba(56,189,248,0.18)")
  gradient.addColorStop(1, "rgba(56,189,248,0)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

function seededUnit(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function DynamicStarfield() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const values = new Float32Array(1800 * 3)
    for (let i = 0; i < 1800; i++) {
      const radius = 35 + seededUnit(i * 3 + 1) * 70
      const theta = seededUnit(i * 3 + 2) * Math.PI * 2
      const phi = Math.acos(2 * seededUnit(i * 3 + 3) - 1)
      values[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      values[i * 3 + 1] = radius * Math.cos(phi)
      values[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }
    return values
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.003
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d8f3ff" size={0.035} sizeAttenuation transparent opacity={0.82} />
    </points>
  )
}

function SunRig({ sunDirection }: { sunDirection: THREE.Vector3 }) {
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const flareRef = useRef<THREE.Group>(null)
  const flareTexture = useMemo(() => createFlareTexture(), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.045
    sunDirection.set(Math.cos(t) * 5, 2.6 + Math.sin(t * 0.5) * 0.7, Math.sin(t) * 5).normalize()
    if (lightRef.current) {
      lightRef.current.position.copy(sunDirection).multiplyScalar(6)
    }
    if (flareRef.current) {
      flareRef.current.position.copy(sunDirection).multiplyScalar(6)
    }
  })

  return (
    <>
      <directionalLight ref={lightRef} position={[5, 3, 5]} intensity={2} />
      <group ref={flareRef} position={[4.7, 2.8, 4.7]}>
        <sprite scale={[1.25, 1.25, 1]}>
          <spriteMaterial map={flareTexture} color="#fff2c4" transparent opacity={0.45} depthWrite={false} />
        </sprite>
        <sprite position={[-1.8, -1.1, -1.8]} scale={[0.34, 0.34, 1]}>
          <spriteMaterial map={flareTexture} color="#38bdf8" transparent opacity={0.2} depthWrite={false} />
        </sprite>
      </group>
    </>
  )
}

function SceneContent() {
  const sunDirection = useMemo(() => new THREE.Vector3(5, 3, 5).normalize(), [])
  const { selectedAsteroid, selectAsteroid } = useAppState()
  const selectedIndexRef = useRef<number | null>(null)

  const handleAsteroidClick = useCallback(
    (data: import("@/lib/types").AsteroidData) => {
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
      <Stats />
      <ambientLight intensity={0.5} />
      <SunRig sunDirection={sunDirection} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <DynamicStarfield />

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
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}
