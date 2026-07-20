import * as THREE from "three"

export interface CollisionCheckResult {
  atRisk: boolean
  closestSat: string
  minDistance: number
}

/**
 * Checks for collision/conjunction between an orbital object and a list of satellites.
 * Extracted to standardize and modernize collision detection logic.
 */
export function checkCollision(
  objPos: THREE.Vector3,
  satellites: Array<{ name: string; pos: THREE.Vector3 }>,
  threshold: number = 0.15
): CollisionCheckResult {
  const result = satellites.reduce(
    (acc, s) => {
      const d = objPos.distanceTo(s.pos)
      if (d < threshold) {
        acc.atRisk = true
        if (d < acc.minDistance) {
          acc.minDistance = d
          acc.closestSat = s.name
        }
      }
      return acc
    },
    { atRisk: false, closestSat: "", minDistance: Infinity }
  )

  return result
}
