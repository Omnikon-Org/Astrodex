import { describe, it, expect } from "vitest"
import * as THREE from "three"
import { calculateCameraTargets } from "../../lib/cameraLogic"

describe("Camera Lerp Logic", () => {
  it("should not change targets when there is no selection", () => {
    const currentPos = new THREE.Vector3(0, 0, 6)
    const currentLook = new THREE.Vector3(0, 0, 0)
    const trackedPos = new THREE.Vector3(10, 0, 0)

    const { targetPos, targetLook } = calculateCameraTargets(
      false,
      trackedPos,
      currentPos,
      currentLook
    )

    expect(targetPos.x).toBe(0)
    expect(targetPos.y).toBe(0)
    expect(targetPos.z).toBe(6)
    expect(targetLook.x).toBe(0)
    expect(targetLook.y).toBe(0)
    expect(targetLook.z).toBe(0)
  })

  it("should update targets when selection is active and tracked position is valid", () => {
    const currentPos = new THREE.Vector3(0, 0, 6)
    const currentLook = new THREE.Vector3(0, 0, 0)
    const trackedPos = new THREE.Vector3(10, 0, 0)

    const { targetPos, targetLook } = calculateCameraTargets(
      true,
      trackedPos,
      currentPos,
      currentLook
    )

    // The logic normalizes the position to add an offset of 1.5
    // For (10, 0, 0), normalized is (1, 0, 0), so offset is (1.5, 0, 0)
    // newTargetPos is (10, 0, 0) + (1.5, 0, 0) = (11.5, 0, 0)
    expect(targetPos.x).toBeCloseTo(11.5)
    expect(targetPos.y).toBe(0)
    expect(targetPos.z).toBe(0)

    expect(targetLook.x).toBe(10)
    expect(targetLook.y).toBe(0)
    expect(targetLook.z).toBe(0)
  })

  it("should ignore tracked position if its length is zero", () => {
    const currentPos = new THREE.Vector3(0, 0, 6)
    const currentLook = new THREE.Vector3(0, 0, 0)
    const trackedPos = new THREE.Vector3(0, 0, 0)

    const { targetPos, targetLook } = calculateCameraTargets(
      true,
      trackedPos,
      currentPos,
      currentLook
    )

    expect(targetPos.x).toBe(0)
    expect(targetPos.y).toBe(0)
    expect(targetPos.z).toBe(6)
    expect(targetLook.x).toBe(0)
    expect(targetLook.y).toBe(0)
    expect(targetLook.z).toBe(0)
  })
})
