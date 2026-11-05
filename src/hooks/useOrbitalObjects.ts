import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { AsteroidData } from "@/lib/types"
import { useAppState } from "@/lib/store"
import { satellitePositions } from "@/components/SatelliteSystem"
import { trackedPosition } from "@/components/AsteroidField"
import {
  solveKepler,
  visViva,
  meanMotion,
  SCENE_TIME_SCALE,
  velocityToKmPerSec,
  KM_PER_UNIT_CONST,
} from "@/lib/kepler"

export const ASTEROID_COUNT = 400
export const DEBRIS_COUNT = 200
export const TOTAL_COUNT = ASTEROID_COUNT + DEBRIS_COUNT

export const ASTEROID_COLORS = ["#8B8B8B", "#A0522D", "#6B6B6B", "#B8860B", "#696969"]
export const DEBRIS_COLORS = ["#ff5500", "#ffaa00", "#00d5ff", "#e100ff", "#ffffff"]

export function generateOrbitalObjectData(index: number): AsteroidData {
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
    velocity: "0.0 km/s",
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
const _objPos = new THREE.Vector3()

const SAT_POSITIONS = [
  { name: "ISS (ZARYA)", pos: satellitePositions.iss },
  { name: "Envisat", pos: satellitePositions.envisat },
  { name: "Hubble", pos: satellitePositions.hubble },
]

export function useOrbitalObjects(getSelectedIndex: () => number | null) {
  const asteroidMeshRef = useRef<THREE.InstancedMesh>(null)
  const debrisMeshRef = useRef<THREE.InstancedMesh>(null)
  const anglesRef = useRef<number[]>([])
  const prevAtRiskRef = useRef<boolean[]>([])
  const lastAlertTimesRef = useRef<Record<number, number>>({})

  const { registerAsteroidData, simulationRunning, filterType, addConjunctionAlert } = useAppState()

  const data = useMemo(() => {
    const d: AsteroidData[] = []
    const a: number[] = []
    for (let i = 0; i < TOTAL_COUNT; i++) {
      d.push(generateOrbitalObjectData(i))
      a.push(0)
    }
    anglesRef.current = a
    prevAtRiskRef.current = new Array(TOTAL_COUNT).fill(false)
    return d
  }, [])

  const dataRef = useRef(data)
  dataRef.current = data

  useEffect(() => {
    registerAsteroidData(data)
  }, [data, registerAsteroidData])

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
    const deltaScaled = delta * SCENE_TIME_SCALE

    for (let i = 0; i < TOTAL_COUNT; i++) {
      const ad = dataRef.current[i]
      const isDebris = ad.type === "debris"
      const instanceIndex = isDebris ? i - ASTEROID_COUNT : i

      if (selectedIdx !== i && simulationRunning) {
        const n = meanMotion(ad.orbitRadius)
        anglesRef.current[i] = solveKepler(n * t * deltaScaled + ad.meanAnomaly0, ad.eccentricity)
      }

      const E = anglesRef.current[i]
      const a = ad.orbitRadius
      const e = ad.eccentricity
      const cosE = Math.cos(E)
      const sinE = Math.sin(E)
      const sqrt1me2 = Math.sqrt(Math.max(0, 1 - e * e))

      const xPlane = a * (cosE - e)
      const zPlane = a * sqrt1me2 * sinE
      _objPos.set(xPlane, zPlane * ad.inclination, zPlane)

      dummy.position.copy(_objPos)
      dummy.rotation.x = E * 0.5
      dummy.rotation.z = E * 0.3

      let activeScale = ad.scale
      if (filterType === "ASTEROIDS" && isDebris) activeScale = 0
      else if (filterType === "DEBRIS" && !isDebris) activeScale = 0
      
      dummy.scale.setScalar(activeScale)
      dummy.updateMatrix()

      const targetMesh = isDebris ? debrisMesh : asteroidMesh
      targetMesh.setMatrixAt(instanceIndex, dummy.matrix)

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

      if (atRisk && simulationRunning && activeScale > 0) {
        const lastAlert = lastAlertTimesRef.current[i] || 0
        if (t - lastAlert > 8) {
          lastAlertTimesRef.current[i] = t
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

      if (atRisk && activeScale > 0) {
        const pulse = Math.sin(t * 8) * 0.5 + 0.5
        colorObj.setRGB(1.0, pulse * 0.3, pulse * 0.3)
        targetMesh.setColorAt(instanceIndex, colorObj)
        prevAtRisk[i] = true
      } else if (prevAtRisk[i]) {
        const defaultColorList = isDebris ? DEBRIS_COLORS : ASTEROID_COLORS
        colorObj.set(defaultColorList[i % defaultColorList.length])
        targetMesh.setColorAt(instanceIndex, colorObj)
        prevAtRisk[i] = false
      }

      const r = _objPos.length()
      if (r > 0 && selectedIdx === i) {
        const v = visViva(r, a)
        ad.velocity = `${velocityToKmPerSec(v).toFixed(2)} km/s`
      }

      if (i === selectedIdx) {
        trackedPosition.current.copy(_objPos)
      }
    }

    asteroidMesh.instanceMatrix.needsUpdate = true
    debrisMesh.instanceMatrix.needsUpdate = true
    if (asteroidMesh.instanceColor) asteroidMesh.instanceColor.needsUpdate = true
    if (debrisMesh.instanceColor) debrisMesh.instanceColor.needsUpdate = true
  })

  return {
    asteroidMeshRef,
    debrisMeshRef,
    dataRef,
  }
}
