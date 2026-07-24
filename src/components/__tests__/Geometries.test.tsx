import { describe, it, expect } from "vitest"
import * as THREE from "three"

describe("Three.js Geometries Verification", () => {
  it("verifies that DodecahedronGeometry compiles with expected properties", () => {
    const geo = new THREE.DodecahedronGeometry(1, 1)
    expect(geo.type).toBe("DodecahedronGeometry")
    expect(geo.attributes.position).toBeDefined()
  })

  it("verifies that BoxGeometry compiles with expected properties", () => {
    const geo = new THREE.BoxGeometry(0.7, 0.7, 0.7)
    expect(geo.type).toBe("BoxGeometry")
    expect(geo.attributes.position).toBeDefined()
  })
})
