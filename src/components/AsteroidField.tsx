"use client"

import { useRef, useMemo, useCallback, useEffect } from "react"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
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

const HIGH_DETAIL_SEGMENTS = 16
const MEDIUM_DETAIL_SEGMENTS = 8
const LOW_DETAIL_SEGMENTS = 4

const LOD_NEAR_DISTANCE = 5.5
const LOD_FAR_DISTANCE = 10.0
const LOD_REBUCKET_INTERVAL = 12

const ASTEROID_COLORS = ["#8B8B8B", "#A0522D", "#6B6B6B", "#B8860B", "#696969"]
const DEBRIS_COLORS = ["#ff5500", "#ffaa00", "#00d5ff", "#e100ff", "#ffffff"]

type ObjectTypeIndex = 0 | 1
type LODTierIndex = 0 | 1 | 2
type TierLookup = [number[], number[], number[]]
type TierMeshRefs = [THREE.InstancedMesh | null, THREE.InstancedMesh | null, THREE.InstancedMesh | null]

interface TierPlacement {
  tierIndex: LODTierIndex
  localIndex: number
}

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

function getTierIndex(distance: number): LODTierIndex {
  if (distance <= LOD_NEAR_DISTANCE) return 2
  if (distance <= LOD_FAR_DISTANCE) return 1
  return 0
}

function createTierLookup(): TierLookup {
  return [[], [], []]
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
  const asteroidMeshRefs = useRef<TierMeshRefs>([null, null, null])
  const debrisMeshRefs = useRef<TierMeshRefs>([null, null, null])

  const { registerAsteroidData, simulationRunning, filterType, addConjunctionAlert } = useAppState()

  // Track alert timestamps per object index to avoid spamming the feed
  const lastAlertTimesRef = useRef<Record<number, number>>({})

  const asteroidLookupRef = useRef<TierLookup>(createTierLookup())
  const debrisLookupRef = useRef<TierLookup>(createTierLookup())
  const asteroidPlacementRef = useRef<TierPlacement[]>(
    Array.from({ length: ASTEROID_COUNT }, () => ({ tierIndex: 0 as LODTierIndex, localIndex: 0 }))
  )
  const debrisPlacementRef = useRef<TierPlacement[]>(
    Array.from({ length: DEBRIS_COUNT }, () => ({ tierIndex: 0 as LODTierIndex, localIndex: 0 }))
  )
  const asteroidTierCountsRef = useRef<[number, number, number]>([0, 0, 0])
  const debrisTierCountsRef = useRef<[number, number, number]>([0, 0, 0])
  const frameCounterRef = useRef(0)

  const generated = useMemo(() => {
    const d: AsteroidData[] = []
    const a: number[] = []
    for (let i = 0; i < TOTAL_COUNT; i++) {
      d.push(generateOrbitalObjectData(i))
      a.push(0) // placeholder; first frame resolves it via Kepler
    }
    return {
      data: d,
      angles: a,
    }
  }, [])

  const data = generated.data
  const anglesRef = useRef(generated.angles)
  const dataRef = useRef(data)

  const asteroidGeometries = useMemo(
    () => [
      new THREE.SphereGeometry(1, HIGH_DETAIL_SEGMENTS, HIGH_DETAIL_SEGMENTS),
      new THREE.SphereGeometry(1, MEDIUM_DETAIL_SEGMENTS, MEDIUM_DETAIL_SEGMENTS),
      new THREE.SphereGeometry(1, LOW_DETAIL_SEGMENTS, LOW_DETAIL_SEGMENTS),
    ] as [THREE.SphereGeometry, THREE.SphereGeometry, THREE.SphereGeometry],
    []
  )

  const debrisGeometries = useMemo(
    () => [
      new THREE.SphereGeometry(1, HIGH_DETAIL_SEGMENTS, HIGH_DETAIL_SEGMENTS),
      new THREE.SphereGeometry(1, MEDIUM_DETAIL_SEGMENTS, MEDIUM_DETAIL_SEGMENTS),
      new THREE.SphereGeometry(1, LOW_DETAIL_SEGMENTS, LOW_DETAIL_SEGMENTS),
    ] as [THREE.SphereGeometry, THREE.SphereGeometry, THREE.SphereGeometry],
    []
  )

  // Register data in the store on mount
  useEffect(() => {
    registerAsteroidData(data)
  }, [data, registerAsteroidData])

  useEffect(() => {
    return () => {
      asteroidGeometries[0].dispose()
      asteroidGeometries[1].dispose()
      asteroidGeometries[2].dispose()
      debrisGeometries[0].dispose()
      debrisGeometries[1].dispose()
      debrisGeometries[2].dispose()
    }
  }, [asteroidGeometries, debrisGeometries])

  useFrame((state) => {
    const selectedIdx = getSelectedIndex()
    const t = state.clock.getElapsedTime()
    const elapsedSceneTime = t * SCENE_TIME_SCALE
    const shouldRebucket = frameCounterRef.current % LOD_REBUCKET_INTERVAL === 0
    frameCounterRef.current += 1

    const asteroidMeshes = asteroidMeshRefs.current
    const debrisMeshes = debrisMeshRefs.current
    const asteroidLookups = asteroidLookupRef.current
    const debrisLookups = debrisLookupRef.current
    const asteroidPlacement = asteroidPlacementRef.current
    const debrisPlacement = debrisPlacementRef.current

    const nextAsteroidLookups: TierLookup = shouldRebucket ? createTierLookup() : asteroidLookups
    const nextDebrisLookups: TierLookup = shouldRebucket ? createTierLookup() : debrisLookups
    const nextAsteroidPlacement: TierPlacement[] = shouldRebucket ? new Array(ASTEROID_COUNT) : asteroidPlacement
    const nextDebrisPlacement: TierPlacement[] = shouldRebucket ? new Array(DEBRIS_COUNT) : debrisPlacement

    const asteroidMatrixDirty: [boolean, boolean, boolean] = [false, false, false]
    const debrisMatrixDirty: [boolean, boolean, boolean] = [false, false, false]
    const asteroidColorDirty: [boolean, boolean, boolean] = [false, false, false]
    const debrisColorDirty: [boolean, boolean, boolean] = [false, false, false]

    const cameraPosition = state.camera.position

    for (let i = 0; i < TOTAL_COUNT; i++) {
      const ad = dataRef.current[i]
      const typeIndex: ObjectTypeIndex = ad.type === "debris" ? 1 : 0
      const isDebris = typeIndex === 1
      const baseColors = isDebris ? DEBRIS_COLORS : ASTEROID_COLORS

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

      let tierIndex: LODTierIndex
      let localIndex: number

      if (shouldRebucket) {
        const distanceToCamera = cameraPosition.distanceTo(_objPos)
        tierIndex = getTierIndex(distanceToCamera)

        const nextLookups = isDebris ? nextDebrisLookups : nextAsteroidLookups
        localIndex = nextLookups[tierIndex].length
        nextLookups[tierIndex].push(i)

        const nextPlacement = isDebris ? nextDebrisPlacement : nextAsteroidPlacement
        nextPlacement[isDebris ? i - ASTEROID_COUNT : i] = { tierIndex, localIndex }

        const targetMeshes = isDebris ? debrisMeshes : asteroidMeshes
        const targetMesh = targetMeshes[tierIndex]
        if (!targetMesh) continue

        targetMesh.setMatrixAt(localIndex, dummy.matrix)
        if (isDebris) debrisMatrixDirty[tierIndex] = true
        else asteroidMatrixDirty[tierIndex] = true
      } else {
        const placement = isDebris ? debrisPlacement[i - ASTEROID_COUNT] : asteroidPlacement[i]
        tierIndex = placement.tierIndex
        localIndex = placement.localIndex

        const targetMeshes = isDebris ? debrisMeshes : asteroidMeshes
        const targetMesh = targetMeshes[tierIndex]
        if (!targetMesh) continue

        targetMesh.setMatrixAt(localIndex, dummy.matrix)
        if (isDebris) debrisMatrixDirty[tierIndex] = true
        else asteroidMatrixDirty[tierIndex] = true
      }

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

      // 4. Color updates keyed by the stable global object index so tier moves remain correct.
      const targetMeshes = isDebris ? debrisMeshes : asteroidMeshes
      const targetMesh = targetMeshes[tierIndex]
      if (!targetMesh) continue

      if (atRisk && activeScale > 0) {
        const pulse = Math.sin(t * 8) * 0.5 + 0.5
        colorObj.setRGB(1.0, pulse * 0.3, pulse * 0.3) // pulsing red
      } else {
        colorObj.set(baseColors[i % baseColors.length])
      }

      targetMesh.setColorAt(localIndex, colorObj)
      if (isDebris) debrisColorDirty[tierIndex] = true
      else asteroidColorDirty[tierIndex] = true

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

    if (shouldRebucket) {
      asteroidLookupRef.current = nextAsteroidLookups
      debrisLookupRef.current = nextDebrisLookups
      asteroidPlacementRef.current = nextAsteroidPlacement
      debrisPlacementRef.current = nextDebrisPlacement
      asteroidTierCountsRef.current = [
        nextAsteroidLookups[0].length,
        nextAsteroidLookups[1].length,
        nextAsteroidLookups[2].length,
      ]
      debrisTierCountsRef.current = [
        nextDebrisLookups[0].length,
        nextDebrisLookups[1].length,
        nextDebrisLookups[2].length,
      ]
    }

    for (let tierIndex = 0 as LODTierIndex; tierIndex < 3; tierIndex = (tierIndex + 1) as LODTierIndex) {
      const asteroidMesh = asteroidMeshes[tierIndex]
      if (asteroidMesh) {
        asteroidMesh.count = asteroidTierCountsRef.current[tierIndex]
        if (asteroidMatrixDirty[tierIndex]) asteroidMesh.instanceMatrix.needsUpdate = true
        if (asteroidColorDirty[tierIndex] && asteroidMesh.instanceColor) asteroidMesh.instanceColor.needsUpdate = true
      }

      const debrisMesh = debrisMeshes[tierIndex]
      if (debrisMesh) {
        debrisMesh.count = debrisTierCountsRef.current[tierIndex]
        if (debrisMatrixDirty[tierIndex]) debrisMesh.instanceMatrix.needsUpdate = true
        if (debrisColorDirty[tierIndex] && debrisMesh.instanceColor) debrisMesh.instanceColor.needsUpdate = true
      }
    }
  })

  const handleMeshClick = useCallback(
    (typeIndex: ObjectTypeIndex, tierIndex: LODTierIndex, e: ThreeEvent<MouseEvent>) => {
      if (e.instanceId === undefined) return

      const lookup = typeIndex === 0 ? asteroidLookupRef.current : debrisLookupRef.current
      const globalIndex = lookup[tierIndex][e.instanceId]
      if (globalIndex === undefined) return

      onAsteroidClick(dataRef.current[globalIndex])
    },
    [onAsteroidClick]
  )

  const handleAsteroidHighClick = useCallback((e: ThreeEvent<MouseEvent>) => handleMeshClick(0, 0, e), [handleMeshClick])
  const handleAsteroidMediumClick = useCallback((e: ThreeEvent<MouseEvent>) => handleMeshClick(0, 1, e), [handleMeshClick])
  const handleAsteroidLowClick = useCallback((e: ThreeEvent<MouseEvent>) => handleMeshClick(0, 2, e), [handleMeshClick])
  const handleDebrisHighClick = useCallback((e: ThreeEvent<MouseEvent>) => handleMeshClick(1, 0, e), [handleMeshClick])
  const handleDebrisMediumClick = useCallback((e: ThreeEvent<MouseEvent>) => handleMeshClick(1, 1, e), [handleMeshClick])
  const handleDebrisLowClick = useCallback((e: ThreeEvent<MouseEvent>) => handleMeshClick(1, 2, e), [handleMeshClick])

  return (
    <>
      <instancedMesh
        ref={(mesh) => {
          asteroidMeshRefs.current[0] = mesh
        }}
        args={[asteroidGeometries[0], undefined, ASTEROID_COUNT]}
        count={0}
        onClick={handleAsteroidHighClick}
        frustumCulled={false}
      >
        <meshStandardMaterial roughness={0.8} metalness={0.2} />
      </instancedMesh>

      <instancedMesh
        ref={(mesh) => {
          asteroidMeshRefs.current[1] = mesh
        }}
        args={[asteroidGeometries[1], undefined, ASTEROID_COUNT]}
        count={0}
        onClick={handleAsteroidMediumClick}
        frustumCulled={false}
      >
        <meshStandardMaterial roughness={0.8} metalness={0.2} />
      </instancedMesh>

      <instancedMesh
        ref={(mesh) => {
          asteroidMeshRefs.current[2] = mesh
        }}
        args={[asteroidGeometries[2], undefined, ASTEROID_COUNT]}
        count={0}
        onClick={handleAsteroidLowClick}
        frustumCulled={false}
      >
        <meshStandardMaterial roughness={0.8} metalness={0.2} />
      </instancedMesh>

      <instancedMesh
        ref={(mesh) => {
          debrisMeshRefs.current[0] = mesh
        }}
        args={[debrisGeometries[0], undefined, DEBRIS_COUNT]}
        count={0}
        onClick={handleDebrisHighClick}
        frustumCulled={false}
      >
        <meshStandardMaterial roughness={0.4} metalness={0.8} />
      </instancedMesh>

      <instancedMesh
        ref={(mesh) => {
          debrisMeshRefs.current[1] = mesh
        }}
        args={[debrisGeometries[1], undefined, DEBRIS_COUNT]}
        count={0}
        onClick={handleDebrisMediumClick}
        frustumCulled={false}
      >
        <meshStandardMaterial roughness={0.4} metalness={0.8} />
      </instancedMesh>

      <instancedMesh
        ref={(mesh) => {
          debrisMeshRefs.current[2] = mesh
        }}
        args={[debrisGeometries[2], undefined, DEBRIS_COUNT]}
        count={0}
        onClick={handleDebrisLowClick}
        frustumCulled={false}
      >
        <meshStandardMaterial roughness={0.4} metalness={0.8} />
      </instancedMesh>
    </>
  )
}
