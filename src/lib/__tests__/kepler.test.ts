import { describe, expect, it } from "vitest"

import {
  KM_PER_UNIT_CONST,
  LEO_DECAY_KM_PER_SEC,
  SCENE_TIME_SCALE,
  hohmannDeltaVKmPerSec,
  kmToSceneUnits,
  meanMotion,
  sceneUnitsToKm,
  solveKepler,
  velocityToKmPerSec,
  visViva,
  visVivaKmPerSec,
} from "../kepler"

function wrapMeanAnomaly(M: number) {
  const TAU = Math.PI * 2
  return ((M % TAU) + TAU + Math.PI) % TAU - Math.PI
}

function expectKeplerResidual(M: number, e: number, tolerance = 1e-10) {
  const E = solveKepler(M, e, 1e-12)
  const wrappedM = wrapMeanAnomaly(M)
  const residual = E - e * Math.sin(E) - wrappedM
  expect(Math.abs(residual)).toBeLessThan(tolerance)
  expect(Number.isFinite(E)).toBe(true)
  return E
}

function simulateDecay(initialAltitudeKm: number, elapsedRealSeconds: number) {
  let altitude = initialAltitudeKm
  for (let i = 0; i < elapsedRealSeconds; i++) {
    altitude = Math.max(180, altitude - LEO_DECAY_KM_PER_SEC)
  }
  return altitude
}

describe("solveKepler", () => {
  it("returns the mean anomaly directly for a circular orbit", () => {
    const M = 1.2345
    const E = solveKepler(M, 0, 1e-12)

    expect(E).toBeCloseTo(M, 12)
  })

  it("solves low-eccentricity orbits accurately", () => {
    const E = expectKeplerResidual(0.4, 0.1)

    expect(E).toBeGreaterThan(0.3)
    expect(E).toBeLessThan(0.5)
  })

  it("handles high-eccentricity orbits robustly", () => {
    const E = expectKeplerResidual(1.2, 0.9)

    expect(E).toBeGreaterThan(0)
    expect(E).toBeLessThan(Math.PI)
  })

  it("satisfies Kepler's equation for multiple representative mean anomalies", () => {
    const meanAnomalies = [-1.8, -0.4, 0, 0.35, 1.2, 2.4]

    meanAnomalies.forEach((M) => {
      expectKeplerResidual(M, 0.6)
    })
  })

  it("stays numerically stable across negative and large anomalies", () => {
    const MValues = [-3.5, -2.0, -0.25, 0.25, 3.0, 5.5]

    MValues.forEach((M) => {
      const E = solveKepler(M, 0.8, 1e-12)
      const residual = E - 0.8 * Math.sin(E) - wrapMeanAnomaly(M)

      expect(Math.abs(residual)).toBeLessThan(1e-10)
      expect(Number.isFinite(E)).toBe(true)
    })
  })
})

describe("visViva", () => {
  it("matches the expected Earth-surface orbital speed in km/s", () => {
    const speed = visVivaKmPerSec(6371, 6371)

    expect(speed).toBeCloseTo(7.9, 1)
  })

  it("produces realistic orbital velocities at common LEO altitudes", () => {
    const leo200 = visVivaKmPerSec(6371 + 200, 6371 + 200)
    const leo400 = visVivaKmPerSec(6371 + 400, 6371 + 400)

    expect(leo200).toBeCloseTo(7.79, 2)
    expect(leo400).toBeCloseTo(7.67, 2)
  })

  it("matches a realistic GEO orbital speed", () => {
    const geoSpeed = visVivaKmPerSec(42164, 42164)

    expect(geoSpeed).toBeCloseTo(3.07, 2)
  })

  it("returns a non-negative scene-unit speed for elliptical motion", () => {
    const speed = visViva(1.8, 2.2)

    expect(speed).toBeGreaterThan(0)
    expect(speed).toBeCloseTo(Math.sqrt(0.005 * (2 / 1.8 - 1 / 2.2)), 12)
  })
})

describe("meanMotion", () => {
  it("returns the documented reference value for a nominal Earth-radius orbit", () => {
    const n = meanMotion(1.8)

    expect(n).toBeCloseTo(0.02928, 5)
  })

  it("decreases as the orbital radius grows", () => {
    const inner = meanMotion(1.8)
    const outer = meanMotion(2.5)

    expect(inner).toBeGreaterThan(outer)
  })

  it("stays numerically precise for larger orbital radii", () => {
    const n = meanMotion(10)

    expect(n).toBeCloseTo(Math.sqrt(0.005 / 1000), 12)
  })
})

describe("unit conversions", () => {
  it("converts scene units to kilometers and back", () => {
    expect(sceneUnitsToKm(1)).toBe(KM_PER_UNIT_CONST)
    expect(kmToSceneUnits(KM_PER_UNIT_CONST)).toBeCloseTo(1, 12)
    expect(kmToSceneUnits(6378)).toBeCloseTo(1.8, 1)
  })

  it("converts scene velocities to km/s using the scene time scale", () => {
    const converted = velocityToKmPerSec(1)

    expect(converted).toBeCloseTo(KM_PER_UNIT_CONST / SCENE_TIME_SCALE, 10)
  })
})

describe("LEO decay behavior", () => {
  it("never drops below the lower altitude floor during simulated decay", () => {
    const altitude = simulateDecay(400, 10000)

    expect(altitude).toBe(180)
  })

  it("reaches the documented lower-bound threshold after enough decay steps", () => {
    const altitude = simulateDecay(200, 4000)

    expect(altitude).toBe(180)
  })

  it("behaves normally for a short decay interval without hitting the floor", () => {
    const altitude = simulateDecay(400, 2)

    expect(altitude).toBeCloseTo(399.9, 2)
  })

  it("exposes the documented decay rate constant", () => {
    expect(LEO_DECAY_KM_PER_SEC).toBe(0.05)
  })
})

describe("hohmannDeltaVKmPerSec", () => {
  it("returns zero for invalid orbital radii", () => {
    expect(hohmannDeltaVKmPerSec(0, 10000)).toBe(0)
    expect(hohmannDeltaVKmPerSec(7000, 0)).toBe(0)
  })

  it("computes a realistic transfer delta-v for a LEO to GEO transfer", () => {
    const deltaV = hohmannDeltaVKmPerSec(7000, 42164)

    expect(deltaV).toBeGreaterThan(0)
    expect(deltaV).toBeCloseTo(3.77, 2)
  })
})
