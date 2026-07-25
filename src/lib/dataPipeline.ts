import type { AsteroidData } from "./types"

export const ASTEROID_COUNT = 400
export const DEBRIS_COUNT = 200
export const TOTAL_COUNT = ASTEROID_COUNT + DEBRIS_COUNT

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
    velocity: "0.0 km/s", // overwritten on first frame from Vis-Viva
    claimed: false,
    type,
    name,
    atRisk: false,
    eccentricity: isDebris ? Math.random() * 0.18 : Math.random() * 0.28,
    meanAnomaly0: Math.random() * Math.PI * 2,
  }
}
