"use client"

import { useRef, useMemo, useCallback, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { AsteroidData } from "@/lib/types"
import { useAppState } from "@/lib/store"
import { satellitePositions } from "./SatelliteSystem"
import {
  solveKepler,
  visViva,
  meanMotion,
  SCENE_TIME_SCALE,
  velocityToKmPerSec,
  KM_PER_UNIT_CONST,
} from "@/lib/kepler"

const ASTEROID_COUNT = 400
const DEBRIS_COUNT = 200
const TOTAL_COUNT = ASTEROID_COUNT + DEBRIS_COUNT

const ASTEROID_COLORS = ["#8B8B8B", "#A0522D", "#6B6B6B", "#B8860B", "#696969"]
const DEBRIS_COLORS = ["#ff5500", "#ffaa00", "#00d5ff", "#e100ff", "#ffffff"]

function generateOrbitalObjectData(index: number): AsteroidData {
  const isDebris = index >= ASTEROID_COUNT
  const type = isDebris ? "debris" : "asteroid"

  // Space Debris is closer to Earth and satellites for higher collision odds
  const orbitRadius = isDebris
    ? 1.9 + Math.random() * 2.2
    : 3.8 + Math.random() * 7.5

  const speed = (isDebris ? 0.08 + Math.random() * 0.12 : 0.02 + Math.random() * 0.06) * (1 / orbitRadius)
  const id = index + 1
  const name = isDebris
    ? `DEB-${1962 + Math.floor(Math.random() * 63)}-${String(Math.floor(Math.random() * 800)).padStart(3, "0")}A`
    : `AST-${String(id).padStart(4, "0")}`

  return {
    id,
    index,
    orbitRadius,
    speed,
    scale: isDebris ? 0.015 + Math.random() * 0.025 : 0.03 + Math.random() * 0.06,
    inclination: isDebris ? (Math.random() - 0.5) * 1.2 : (Math.random() - 0.5) * 0.35,
    distance: `${(orbitRadius * 0.15).toFixed(2)} AU`,
    velocity: "0.0 km/s", // overwritten on first frame from Vis-Viva
    claimed: false,
    type,
    name,
    atRisk: false,
    eccentricity: isDebris ? Math.random() * 0.18 : Math.random() * 0.28,
    meanAnomaly0: Math.random() * Math.PI * 2,
  }
}

const dummy = new THREE.Object3D()
const colorObj = new THREE.Color()

// Shared ref for camera tracking — only the selected object's position
export const trackedPosition = { current: new THREE.Vector3() }

// Module-level scratch — reused every frame for 600 instances to avoid GC pressure
const _objPos = new THREE.Vector3()

// Satellite position lookup table — hoisted out of useFrame so the array
// literal isn't rebuilt 60 times per second
const SAT_POSITIONS = [
  { name: "ISS (ZARYA)", pos: satellitePositions.iss },
  { name: "Envisat", pos: satellitePositions.envisat },
  { name: "Hubble", pos: satellitePositions.hubble },
]

interface AsteroidFieldProps {
  onAsteroidClick: (data: AsteroidData) => void
  getSelectedIndex: () => number | null
}

export function AsteroidField({ onAsteroidClick, getSelectedIndex }: AsteroidFieldProps) {
  const asteroidMeshRef = useRef<THREE.InstancedMesh>(null)
  const debrisMeshRef = useRef<THREE.InstancedMesh>(null)
  const anglesRef = useRef<number[]>([])

  // Cached "at risk" state per object — colors are only re-pushed on transitions
  const prevAtRiskRef = useRef<boolean[]>([])

  const { registerAsteroidData, simulationRunning, filterType, addConjunctionAlert } = useAppState()

  // Track alert timestamps per object index to avoid spamming the feed
  const lastAlertTimesRef = useRef<Record<number, number>>({})

  const data = useMemo(() => {
    const d: AsteroidData[] = []
    const a: number[] = []
    for (let i = 0; i < TOTAL_COUNT; i++) {
      d.push(generateOrbitalObjectData(i))
      a.push(0) // placeholder; first frame resolves it via Kepler
    }
    anglesRef.current = a
    prevAtRiskRef.current = new Array(TOTAL_COUNT).fill(false)
    return d
  }, [])

  const dataRef = useRef(data)
  dataRef.current = data

  // Register data in the store on mount
  useEffect(() => {
    registerAsteroidData(data)
  }, [data, registerAsteroidData])

  // Initialize colors
  useEffect(() => {
    const updateColors = (mesh: THREE.InstancedMesh | null, start: number, count: number, colors: string[]) => {
      if (!mesh) return
      for (let i = 0; i < count; i++) {
        const objIndex = start + i
        colorObj.set(colors[objIndex % colors.length])
        mesh.setColorAt(i, colorObj)
      }
      if (mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true
      }
    }

    updateColors(asteroidMeshRef.current, 0, ASTEROID_COUNT, ASTEROID_COLORS)
    updateColors(debrisMeshRef.current, ASTEROID_COUNT, DEBRIS_COUNT, DEBRIS_COLORS)
  }, [])

  useFrame((state, delta) => {
    const asteroidMesh = asteroidMeshRef.current
    const debrisMesh = debrisMeshRef.current
    if (!asteroidMesh || !debrisMesh) return

    const selectedIdx = getSelectedIndex()
    const t = state.clock.getElapsedTime()
    const prevAtRisk = prevAtRiskRef.current
    const elapsedSceneTime = t * SCENE_TIME_SCALE

    for (let i = 0; i < TOTAL_COUNT; i++) {
      const ad = dataRef.current[i]
      const isDebris = ad.type === "debris"
      const instanceIndex = isDebris ? i - ASTEROID_COUNT : i

      // 1. Keplerian propagation: M = n·t + M0  →  solve Kepler for E
      if (selectedIdx !== i && simulationRunning) {
        const n = meanMotion(ad.orbitRadius)
        anglesRef.current[i] = solveKepler(n * elapsedSceneTime + ad.meanAnomaly0, ad.eccentricity)
      }

      const E = anglesRef.current[i]
      const a = ad.orbitRadius
      const e = ad.eccentricity
      const cosE = Math.cos(E)
      const sinE = Math.sin(E)
      const sqrt1me2 = Math.sqrt(Math.max(0, 1 - e * e))

      // In-plane perifocal coordinates of the ellipse
      const xPlane = a * (cosE - e)
      const zPlane = a * sqrt1me2 * sinE

      // Apply inclination tilt to break the orbit out of the xz plane
      _objPos.set(xPlane, zPlane * ad.inclination, zPlane)

      dummy.position.copy(_objPos)
      dummy.rotation.x = E * 0.5
      dummy.rotation.z = E * 0.3

      // 2. Filter rendering scale
      let activeScale = ad.scale
      if (filterType === "ASTEROIDS" && isDebris) {
        activeScale = 0
      } else if (filterType === "DEBRIS" && !isDebris) {
        activeScale = 0
      }
      dummy.scale.setScalar(activeScale)
      dummy.updateMatrix()

      const targetMesh = isDebris ? debrisMesh : asteroidMesh
      targetMesh.setMatrixAt(instanceIndex, dummy.matrix)

      // 3. Collision check with satellites
      let atRisk = false
      let closestSat = ""
      let minDistance = Infinity

      for (const s of SAT_POSITIONS) {
        const d = _objPos.distanceTo(s.pos)
        if (d < 0.15) {
          atRisk = true
          if (d < minDistance) {
            minDistance = d
            closestSat = s.name
          }
        }
      }

      ad.atRisk = atRisk

      // Handle conjunction alerts in the store (throttle to once per 8 seconds per object)
      if (atRisk && simulationRunning && activeScale > 0) {
        const lastAlert = lastAlertTimesRef.current[i] || 0
        if (t - lastAlert > 8) {
          lastAlertTimesRef.current[i] = t

          // Miss distance representation in kilometers (0.15 units ≈ 500 km)
          const missKm = (minDistance * KM_PER_UNIT_CONST).toFixed(1)
          const riskLevel = minDistance < 0.05 ? "HIGH" : minDistance < 0.1 ? "MEDIUM" : "LOW"

          addConjunctionAlert({
            tca: "now",
            missKm,
            risk: riskLevel,
            secondaryId: ad.id,
            secondaryName: ad.name,
            type: ad.type,
            satelliteName: closestSat,
          })
        }
      }

      // 4. Color updates ONLY on atRisk transitions (perf optimization)
      if (atRisk && activeScale > 0) {
        const pulse = Math.sin(t * 8) * 0.5 + 0.5
        colorObj.setRGB(1.0, pulse * 0.3, pulse * 0.3) // pulsing red
        targetMesh.setColorAt(instanceIndex, colorObj)
        prevAtRisk[i] = true
      } else if (prevAtRisk[i]) {
        // Reset to default on transition out of at-risk
        const defaultColorList = isDebris ? DEBRIS_COLORS : ASTEROID_COLORS
        colorObj.set(defaultColorList[i % defaultColorList.length])
        targetMesh.setColorAt(instanceIndex, colorObj)
        prevAtRisk[i] = false
      }

      // 5. Vis-Viva speed for HUD telemetry
      const r = _objPos.length()
      if (r > 0 && selectedIdx === i) {
        const v = visViva(r, a)
        ad.velocity = `${velocityToKmPerSec(v).toFixed(2)} km/s`
      }

      // 6. Track position of selected object for camera
      if (i === selectedIdx) {
        trackedPosition.current.copy(_objPos)
      }
    }

    asteroidMesh.instanceMatrix.needsUpdate = true
    debrisMesh.instanceMatrix.needsUpdate = true
    if (asteroidMesh.instanceColor) asteroidMesh.instanceColor.needsUpdate = true
    if (debrisMesh.instanceColor) debrisMesh.instanceColor.needsUpdate = true
  })

  const handleAsteroidClick = useCallback(
    (e: any) => {
      if (e.instanceId === undefined) return
      onAsteroidClick(dataRef.current[e.instanceId])
    },
    [onAsteroidClick]
  )

  const handleDebrisClick = useCallback(
    (e: any) => {
      if (e.instanceId === undefined) return
      onAsteroidClick(dataRef.current[ASTEROID_COUNT + e.instanceId])
    },
    [onAsteroidClick]
  )

  return (
    <>
      {/* ─── Asteroids Field (Rocky) ─── */}
      <instancedMesh
        ref={asteroidMeshRef}
        args={[null as any, null as any, ASTEROID_COUNT]}
        onClick={handleAsteroidClick}
        frustumCulled={false}
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.8} metalness={0.2} />
      </instancedMesh>

      {/* ─── Space Debris Field (Spent parts, fragments) ─── */}
      <instancedMesh
        ref={debrisMeshRef}
        args={[null as any, null as any, DEBRIS_COUNT]}
        onClick={handleDebrisClick}
        frustumCulled={false}
      >
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial roughness={0.4} metalness={0.8} />
      </instancedMesh>
    </>
  )
}
