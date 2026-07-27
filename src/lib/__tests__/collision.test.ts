import { describe, it, expect } from "vitest"
import * as THREE from "three"
import { checkCollision } from "../collision"

describe("Collision Tracker Logic", () => {
  it("should detect no collision when satellites are far", () => {
    const objPos = new THREE.Vector3(0, 0, 0)
    const sats = [
      { name: "Sat1", pos: new THREE.Vector3(10, 0, 0) },
      { name: "Sat2", pos: new THREE.Vector3(0, 10, 0) },
    ]

    const result = checkCollision(objPos, sats, 0.15)
    expect(result.atRisk).toBe(false)
    expect(result.closestSat).toBe("")
    expect(result.minDistance).toBe(Infinity)
  })

  it("should detect collision when a satellite is within threshold", () => {
    const objPos = new THREE.Vector3(0, 0, 0)
    const sats = [
      { name: "Sat1", pos: new THREE.Vector3(0.1, 0, 0) },
    ]

    const result = checkCollision(objPos, sats, 0.15)
    expect(result.atRisk).toBe(true)
    expect(result.closestSat).toBe("Sat1")
    expect(result.minDistance).toBe(0.1)
  })

  it("should return the closest satellite when multiple are within threshold", () => {
    const objPos = new THREE.Vector3(0, 0, 0)
    const sats = [
      { name: "Sat1", pos: new THREE.Vector3(0.12, 0, 0) },
      { name: "Sat2", pos: new THREE.Vector3(0.05, 0, 0) },
      { name: "Sat3", pos: new THREE.Vector3(0.14, 0, 0) },
    ]

    const result = checkCollision(objPos, sats, 0.15)
    expect(result.atRisk).toBe(true)
    expect(result.closestSat).toBe("Sat2")
    expect(result.minDistance).toBe(0.05)
  })
})
