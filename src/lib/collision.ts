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
  let atRisk = false
  let closestSat = ""
  let minDistance = Infinity

  for (let i = 0; i < satellites.length; i++) {
    const s = satellites[i]
    const d = objPos.distanceTo(s.pos)
    if (d < threshold) {
      atRisk = true
      if (d < minDistance) {
        minDistance = d
        closestSat = s.name
      }
    }
  }

  return { atRisk, closestSat, minDistance }
}
