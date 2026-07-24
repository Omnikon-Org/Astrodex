import * as THREE from "three"

/**
 * Calculates the target position and look-at target for the camera.
 * Extracted from CameraController for easier testing.
 */
export function calculateCameraTargets(
  hasSelection: boolean,
  trackedPosition: THREE.Vector3,
  currentTargetPos: THREE.Vector3,
  currentTargetLook: THREE.Vector3
): { targetPos: THREE.Vector3; targetLook: THREE.Vector3 } {
  const newTargetLook = currentTargetLook.clone()
  const newTargetPos = currentTargetPos.clone()

  if (hasSelection) {
    if (trackedPosition.lengthSq() > 0) {
      newTargetLook.copy(trackedPosition)
      const offset = trackedPosition.clone().normalize().multiplyScalar(1.5)
      newTargetPos.copy(trackedPosition).add(offset)
    }
  }

  return { targetPos: newTargetPos, targetLook: newTargetLook }
}
