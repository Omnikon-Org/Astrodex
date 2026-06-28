"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useAppState } from "@/lib/store"
import {
  solveKepler,
  meanMotion,
  SCENE_TIME_SCALE,
  LEO_DECAY_KM_PER_SEC,
  kmToSceneUnits,
} from "@/lib/kepler"

/**
 * Helper to compute 3D coordinate on an inclined orbit at eccentric anomaly E.
 *
 * Perifocal coordinates (assuming ω = 0):
 *   x_pf = a·(cos E − e)
 *   y_pf = a·√(1−e²)·sin E
 * Then rotated by inclination i about the line of nodes, and by RAAN Ω
 * about the polar axis.
 */
export function getEllipticalOrbitPosition(
  a: number,
  e: number,
  E: number,
  incDeg: number,
  raanDeg: number,
  target = new THREE.Vector3()
) {
  const inc = (incDeg * Math.PI) / 180
  const raan = (raanDeg * Math.PI) / 180
  const cosE = Math.cos(E)
  const sinE = Math.sin(E)
  const sqrt1me2 = Math.sqrt(Math.max(0, 1 - e * e))

  const x_pf = a * (cosE - e)
  const y_pf = a * sqrt1me2 * sinE

  // Inclination rotation about the line of nodes (x_pf axis)
  const x1 = x_pf
  const y1 = y_pf * Math.sin(inc)
  const z1 = y_pf * Math.cos(inc)

  // RAAN rotation about the polar (y) axis
  const x = x1 * Math.cos(raan) - z1 * Math.sin(raan)
  const z = x1 * Math.sin(raan) + z1 * Math.cos(raan)
  const y = y1

  return target.set(x, y, z)
}

/** Circular-orbit convenience wrapper preserved for backwards compatibility. */
export function getOrbitPosition(
  radius: number,
  inclinationDeg: number,
  raanDeg: number,
  theta: number,
  target = new THREE.Vector3()
) {
  return getEllipticalOrbitPosition(radius, 0, theta, inclinationDeg, raanDeg, target)
}

/** Generate geometry path points for visual orbit rings (sweeps E uniformly). */
function createOrbitGeometry(a: number, e: number, incDeg: number, raanDeg: number) {
  const points: THREE.Vector3[] = []
  const temp = new THREE.Vector3()
  for (let i = 0; i <= 96; i++) {
    const E = (i / 96) * Math.PI * 2
    getEllipticalOrbitPosition(a, e, E, incDeg, raanDeg, temp)
    points.push(temp.clone())
  }
  return new THREE.BufferGeometry().setFromPoints(points)
}

// Export the positions of the satellites so AsteroidField can check distance
export const satellitePositions = {
  iss: new THREE.Vector3(),
  envisat: new THREE.Vector3(),
  hubble: new THREE.Vector3(),
}

export function SatelliteSystem() {
  const {
    simulationRunning,
    satAltitude,
    satInclination,
    satRaan,
    satEccentricity,
    decayAltitude,
  } = useAppState()

  const issRef = useRef<THREE.Mesh>(null)
  const envisatRef = useRef<THREE.Mesh>(null)
  const hubbleRef = useRef<THREE.Mesh>(null)

  // Convert km altitude to 3D scene units (Earth radius is 1.8 units = 6378 km)
  const issRadius = useMemo(() => 1.8 + kmToSceneUnits(satAltitude), [satAltitude])
  const envisatRadius = 1.8 + kmToSceneUnits(800) // 800 km polar orbit
  const hubbleRadius = 1.8 + kmToSceneUnits(540) // 540 km orbit

  // Dynamic line geometries — re-build when the ISS altitude decays
  const issOrbitGeo = useMemo(
    () => createOrbitGeometry(issRadius, satEccentricity, satInclination, satRaan),
    [issRadius, satEccentricity, satInclination, satRaan]
  )
  const envisatOrbitGeo = useMemo(() => createOrbitGeometry(envisatRadius, 0.0006, 98.54, 120), [envisatRadius])
  const hubbleOrbitGeo = useMemo(() => createOrbitGeometry(hubbleRadius, 0.0003, 28.5, 45), [hubbleRadius])

  const _tempPos = useRef(new THREE.Vector3()).current

  useFrame((state, delta) => {
    if (!simulationRunning) return

    const time = state.clock.getElapsedTime()
    const tempPos = _tempPos

    // LEO atmospheric drag — slowly drop the ISS altitude in real time
    decayAltitude(LEO_DECAY_KM_PER_SEC * delta)

    // Mean motions
    const nIss = meanMotion(issRadius)
    const nEnv = meanMotion(envisatRadius)
    const nHub = meanMotion(hubbleRadius)

    // 1. Position ISS — solve Kepler for eccentric anomaly
    const Eiss = solveKepler(nIss * time * SCENE_TIME_SCALE, satEccentricity)
    getEllipticalOrbitPosition(issRadius, satEccentricity, Eiss, satInclination, satRaan, tempPos)
    if (issRef.current) issRef.current.position.copy(tempPos)
    satellitePositions.iss.copy(tempPos)

    // 2. Position Envisat
    const Eenv = solveKepler(nEnv * time * SCENE_TIME_SCALE + Math.PI, 0.0006)
    getEllipticalOrbitPosition(envisatRadius, 0.0006, Eenv, 98.54, 120, tempPos)
    if (envisatRef.current) envisatRef.current.position.copy(tempPos)
    satellitePositions.envisat.copy(tempPos)

    // 3. Position Hubble
    const Ehub = solveKepler(nHub * time * SCENE_TIME_SCALE + Math.PI / 2, 0.0003)
    getEllipticalOrbitPosition(hubbleRadius, 0.0003, Ehub, 28.5, 45, tempPos)
    if (hubbleRef.current) hubbleRef.current.position.copy(tempPos)
    satellitePositions.hubble.copy(tempPos)
  })

  return (
    <group>
      {/* ─── ISS Orbit ─── */}
      <lineLoop geometry={issOrbitGeo}>
        <lineBasicMaterial color="#38bdf8" opacity={0.35} transparent linewidth={1} />
      </lineLoop>
      <mesh ref={issRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* ─── Envisat Orbit ─── */}
      <lineLoop geometry={envisatOrbitGeo}>
        <lineBasicMaterial color="#fbbf24" opacity={0.25} transparent linewidth={1} />
      </lineLoop>
      <mesh ref={envisatRef}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* ─── Hubble Orbit ─── */}
      <lineLoop geometry={hubbleOrbitGeo}>
        <lineBasicMaterial color="#34d399" opacity={0.25} transparent linewidth={1} />
      </lineLoop>
      <mesh ref={hubbleRef}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#34d399" />
      </mesh>
    </group>
  )
}
