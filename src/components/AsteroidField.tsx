"use client"

import { useRef, useMemo, useCallback, useEffect } from "react"
import { useFrame, ThreeEvent } from "@react-three/fiber"
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
const ASTEROID_NORMAL_SCALE_HIGH = new THREE.Vector2(0.45, 0.45)
const ASTEROID_NORMAL_SCALE_MEDIUM = new THREE.Vector2(0.4, 0.4)
const ASTEROID_NORMAL_SCALE_LOW = new THREE.Vector2(0.35, 0.35)

// Shared ref for camera tracking — only the selected object's position
export const trackedPosition = { current: new THREE.Vector3() }

// Module-level scratch — reused every frame for 600 instances to avoid GC pressure
const _objPos = new THREE.Vector3()
const _trailPoint = new THREE.Vector3()

// Satellite position lookup table — hoisted out of useFrame so the array
// literal isn't rebuilt 60 times per second
const SAT_POSITIONS = [
  { name: "ISS (ZARYA)", pos: satellitePositions.iss },
  { name: "Envisat", pos: satellitePositions.envisat },
  { name: "Hubble", pos: satellitePositions.hubble },
]

function createAsteroidNormalTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext("2d")!
  const image = ctx.createImageData(canvas.width, canvas.height)
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4
      const ridge = Math.sin(x * 0.25) * Math.cos(y * 0.19)
      const crater = Math.sin((x * x + y * y) * 0.012)
      const n = Math.max(-1, Math.min(1, ridge * 0.45 + crater * 0.35))
      image.data[i] = 128 + n * 48
      image.data[i + 1] = 128 + Math.sin(y * 0.31) * 28
      image.data[i + 2] = 220
      image.data[i + 3] = 255
    }
  }
  ctx.putImageData(image, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

function createOrbitTrailGeometry(item: AsteroidData) {
  const points: THREE.Vector3[] = []
  const a = item.orbitRadius
  const e = item.eccentricity
  const sqrt1me2 = Math.sqrt(Math.max(0, 1 - e * e))
  for (let step = 0; step <= 144; step++) {
    const E = (step / 144) * Math.PI * 2
    const xPlane = a * (Math.cos(E) - e)
    const zPlane = a * sqrt1me2 * Math.sin(E)
    _trailPoint.set(xPlane, zPlane * item.inclination, zPlane)
    points.push(_trailPoint.clone())
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const distances = new Float32Array(points.length)
  let distance = 0
  for (let i = 1; i < points.length; i++) {
    distance += points[i].distanceTo(points[i - 1])
    distances[i] = distance
  }
  geometry.setAttribute("lineDistance", new THREE.BufferAttribute(distances, 1))
  return geometry
}

interface AsteroidFieldProps {
  onAsteroidClick: (data: AsteroidData) => void
  getSelectedIndex: () => number | null
}

export function AsteroidField({ onAsteroidClick, getSelectedIndex }: AsteroidFieldProps) {
  const asteroidMeshRefs = useRef<TierMeshRefs>([null, null, null])
  const debrisMeshRefs = useRef<TierMeshRefs>([null, null, null])

  // Cached "at risk" state per object — colors are only re-pushed on transitions
  const prevAtRiskRef = useRef<boolean[]>([])

  const { simulationRunning, filterType, addConjunctionAlert } = useAppState()

  // Track alert timestamps per object index to avoid spamming the feed
  const lastAlertTimesRef = useRef<Record<number, number>>({})

  const { dataArray, initialAngles } = useMemo(() => {
    const d: AsteroidData[] = []
    const a: number[] = []
    for (let i = 0; i < TOTAL_COUNT; i++) {
      d.push(generateOrbitalObjectData(i))
      a.push(0)
    }
    return { dataArray: d, initialAngles: a }
  }, [])

  const dataRef = useRef(dataArray)
  
  useEffect(() => {
    dataRef.current = dataArray
    anglesRef.current = initialAngles
    prevAtRiskRef.current = new Array(TOTAL_COUNT).fill(false)
  }, [dataArray, initialAngles])

  // Register data in the store on mount
  useEffect(() => {
    const { setAsteroidData } = useAppState.getState()
    setAsteroidData(dataRef.current)
  }, [])

  useEffect(() => {
    return () => {
      asteroidGeometries[0].dispose()
      asteroidGeometries[1].dispose()
      asteroidGeometries[2].dispose()
      debrisGeometries[0].dispose()
      debrisGeometries[1].dispose()
      debrisGeometries[2].dispose()
      asteroidNormalMap.dispose()
    }
  }, [asteroidGeometries, debrisGeometries, asteroidNormalMap])

  useFrame((state, delta) => {
    const selectedIdx = getSelectedIndex()
    // Wall-clock time — used only for the conjunction-alert throttle and the
    // at-risk pulsing red visual, both of which should keep ticking even
    // while the sim is paused (a throttle that pauses would fire a burst
    // of duplicate alerts on resume; the pulse is UI feedback, not physics).
    const t = state.clock.getElapsedTime()
    if (simulationRunning) {
      simTimeRef.current += delta
    }
    const elapsedSceneTime = simTimeRef.current * SCENE_TIME_SCALE
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
      // Previously this branch was `selectedIdx !== i && simulationRunning`,
      // which meant the currently selected object's eccentric anomaly stopped
      // advancing the moment the user clicked it. Its position froze, the
      // Vis-Viva HUD readout locked to a single km/s value, and conjunction
      // checks under-reported collisions against the object the user was
      // inspecting (see issue #551). Propagate for every object; the
      // per-object work here is cheap and the AGENTS docs explicitly promise
      // "propagation happening for each of 600 objects" with no carve-out
      // for the selected one.
      if (simulationRunning) {
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
      {trailGeometries.map(({ item, geometry }) => {
        const highlighted = selectedAsteroid?.id === item.id
        return (
          <lineLoop key={`trail-${item.id}`} geometry={geometry}>
            <lineDashedMaterial
              color={highlighted ? "#38bdf8" : "#34d399"}
              opacity={highlighted ? 0.5 : 0.24}
              transparent
              dashSize={0.08}
              gapSize={0.07}
            />
          </lineLoop>
        )
      })}

      <instancedMesh
        ref={asteroidMeshRef}
        args={[undefined as any, undefined as any, ASTEROID_COUNT]}
        onClick={handleAsteroidClick}
        frustumCulled={false}
      >
        <meshStandardMaterial roughness={0.86} metalness={0.14} normalMap={asteroidNormalMap} normalScale={ASTEROID_NORMAL_SCALE_HIGH} />
      </instancedMesh>

      <instancedMesh
        ref={debrisMeshRef}
        args={[undefined as any, undefined as any, DEBRIS_COUNT]}
        onClick={handleDebrisClick}
        frustumCulled={false}
      >
        <meshStandardMaterial roughness={0.4} metalness={0.8} />
      </instancedMesh>
    </>
  )
}
