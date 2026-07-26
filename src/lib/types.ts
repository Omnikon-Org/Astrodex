export interface AsteroidData {
  id: number
  index: number
  orbitRadius: number // semi-major axis 'a' in scene units
  speed: number // baseline circular speed (kept for HUD backwards-compat; real speed now uses Vis-Viva)
  scale: number
  inclination: number // radians
  distance: string
  velocity: string
  claimed: boolean
  type: "asteroid" | "debris"
  name: string
  atRisk?: boolean
  /** Eccentricity in [0, 1).  Drives Keplerian elliptical motion. */
  eccentricity: number
  /** Mean anomaly at t=0 (radians).  Distributes the objects around their orbit. */
  meanAnomaly0: number
  /** Independent rotation speeds around intrinsic axes */
  rotSpeedX: number
  rotSpeedY: number
  rotSpeedZ: number
}

/** Runtime mutable per-instance state tracked outside the React data array. */
export interface AsteroidInstance {
  data: AsteroidData
  currentAngle: number
  /** Most recent Vis-Viva speed (scene units per scene-second) — used for HUD display. */
  currentVisViva: number
}

/** Parameters of the user-controlled ISS satellite. */
export interface SatelliteParams {
  altitude: number // km above Earth surface
  inclination: number // degrees
  raan: number // degrees
  eccentricity: number // unitless, 0 = circular
  meanAnomaly0: number // radians
}
