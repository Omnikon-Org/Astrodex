"use client"

import { useCallback } from "react"
import * as THREE from "three"
import { ThreeEvent } from "@react-three/fiber"
import type { AsteroidData } from "@/lib/types"
import { useOrbitalObjects, ASTEROID_COUNT, DEBRIS_COUNT } from "@/hooks/useOrbitalObjects"

export const trackedPosition = { current: new THREE.Vector3() }

interface AsteroidFieldProps {
  onAsteroidClick: (data: AsteroidData) => void
  getSelectedIndex: () => number | null
}

export function AsteroidField({ onAsteroidClick, getSelectedIndex }: AsteroidFieldProps) {
  const { asteroidMeshRef, debrisMeshRef, dataRef } = useOrbitalObjects(getSelectedIndex)

  const handleAsteroidClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (e.instanceId === undefined) return
      onAsteroidClick(dataRef.current[e.instanceId])
    },
    [onAsteroidClick, dataRef]
  )

  const handleDebrisClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (e.instanceId === undefined) return
      onAsteroidClick(dataRef.current[ASTEROID_COUNT + e.instanceId])
    },
    [onAsteroidClick, dataRef]
  )

  return (
    <>
      {/* ─── Asteroids Field (Rocky) ─── */}
      <instancedMesh
        ref={asteroidMeshRef}
        args={[undefined as any, undefined as any, ASTEROID_COUNT]}
        onClick={handleAsteroidClick}
        frustumCulled={false}
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.8} metalness={0.2} />
      </instancedMesh>

      {/* ─── Space Debris Field (Spent parts, fragments) ─── */}
      <instancedMesh
        ref={debrisMeshRef}
        args={[undefined as any, undefined as any, DEBRIS_COUNT]}
        onClick={handleDebrisClick}
        frustumCulled={false}
      >
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial roughness={0.4} metalness={0.8} />
      </instancedMesh>
    </>
  )
}
