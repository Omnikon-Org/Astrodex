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

      const lookup = typeIndex === 0 ? asteroidLookupRef.current : debrisLookupRef.current
      const globalIndex = lookup[tierIndex][e.instanceId]
      if (globalIndex === undefined) return

      onAsteroidClick(dataRef.current[globalIndex])
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
