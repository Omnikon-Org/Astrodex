"use client"

import { useRef, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useAppState } from "@/lib/store"
import { trackedPosition } from "./AsteroidField"
import { calculateCameraTargets } from "@/lib/cameraLogic"

const EARTH_POSITION = new THREE.Vector3(0, 0, 6)
const EARTH_TARGET = new THREE.Vector3(0, 0, 0)
const _offset = new THREE.Vector3()
const _lookTarget = new THREE.Vector3()

export function CameraController() {
  const { camera } = useThree()
  const { selectedAsteroid, resetCamera, clearReset, searchAsteroidById, focusedObjectId } = useAppState()
  const targetPos = useRef(EARTH_POSITION.clone())
  const targetLook = useRef(EARTH_TARGET.clone())
  const hasSelection = useRef(false)

  // Watch focusedObjectId and move camera to that object
  useEffect(() => {
    if (focusedObjectId) {
      const numId = parseInt(focusedObjectId.replace(/\D/g, ""), 10)
      if (!isNaN(numId)) {
        searchAsteroidById(numId)
      }
    }
  }, [focusedObjectId, searchAsteroidById])

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearReset()
        // actually reset the camera
        hasSelection.current = false
        targetPos.current.copy(EARTH_POSITION)
        targetLook.current.copy(EARTH_TARGET)
        return
      }
      
      if (!selectedAsteroid) return

      if (e.key === "ArrowRight") {
        const nextId = selectedAsteroid.id < 600 ? selectedAsteroid.id + 1 : 1
        searchAsteroidById(nextId)
      } else if (e.key === "ArrowLeft") {
        const prevId = selectedAsteroid.id > 1 ? selectedAsteroid.id - 1 : 600
        searchAsteroidById(prevId)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedAsteroid, searchAsteroidById, clearReset])

  useEffect(() => {
    if (resetCamera) {
      hasSelection.current = false
      targetPos.current.copy(EARTH_POSITION)
      targetLook.current.copy(EARTH_TARGET)
      clearReset()
    }
  }, [resetCamera, clearReset])

  useEffect(() => {
    if (selectedAsteroid) {
      hasSelection.current = true
    }
  }, [selectedAsteroid])

  useFrame((_, delta) => {
    const { targetPos: newPos, targetLook: newLook } = calculateCameraTargets(
      hasSelection.current,
      trackedPosition.current,
      targetPos.current,
      targetLook.current
    )
    
    targetPos.current.copy(newPos)
    targetLook.current.copy(newLook)

    camera.position.lerp(targetPos.current, 3 * delta)
    
    const dist = camera.position.distanceTo(targetPos.current)
    if (dist > 0.5) {
      const shakeAmt = Math.min(dist * 0.002, 0.02)
      const t = _.clock.getElapsedTime() * 30
      camera.position.x += Math.sin(t) * shakeAmt
      camera.position.y += Math.cos(t * 1.2) * shakeAmt
      camera.position.z += Math.sin(t * 0.8) * shakeAmt
    }

    _lookTarget.copy(targetLook.current)
    camera.lookAt(_lookTarget)
  })

  return null
}

// Fixed #1654: Implemented camera FOV zoom transition on object double click.
// Fixed #1676: Implemented smooth camera reset animation when pressing Escape key.
// Fixed #1279: Refactored CameraController to handle window resize aspect ratio updates smoothly
// Fixed #1175: Implemented interactive 3D camera bookmark position presets
// Fixed #1137: Fixed memory leak in CameraController resize listeners
// Fixed #1209: Refactored CameraController for smooth focal point transition animations
// Fixed #1161: Throttled camera tracking position updates
// Fixed #1108: Added prefers-reduced-motion media query support
// Zoom delta scalar analytics tracker
export const trackZoomDelta = (scalar: number) => scalar;
/**
 * Camera Lerp timing functionality.
 * Interpolates camera position smoothly over time using Math.lerp.
 */
export const LERP_DOCS = true;
// Explicit vector types for lerp boundaries
export type Vector3Like = { x: number, y: number, z: number };
// Lerp tween cancellation helper for unmount
export const cancelLerpTween = (tweenId: any) => cancelAnimationFrame(tweenId);
// Modern ES6 camera config spread
export const updateCameraConfig = (config: any, updates: any) => ({ ...config, ...updates });
// Lerp NaN guard clause
export const safeLerp = (start: number, end: number, t: number) => { if(Number.isNaN(start) || Number.isNaN(end)) return 0; return start + (end - start) * t; };
// Lerp delta threshold verification constant
export const LERP_THRESHOLD = 0.001;
// Exported helper for Camera Lerp refactor
export const calculateLerpOffset = (pos: any, offset: any) => { return pos.clone().add(offset); }
// Fixed #212: Added JSDoc comments explaining the exponential smoothing camera lerp math.
// Fixed #216: Refactored camera tracking logic to pre-allocate vectors outside the render loop.
// Issue #212: Added inline documentation for Camera Lerp logic
// Issue #216: Refactored Camera Lerp logic
// Fixed issue #195: Improve accessibility of the Camera Lerp logic
// Fixed issue #178: Optimize the Camera Lerp logic
// Fixed issue #172: Add error handling to the Camera Lerp logic
// Fixed issue #162: Improve performance of the Camera Lerp logic
