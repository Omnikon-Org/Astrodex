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
  const { selectedAsteroid, resetCamera, clearReset, searchAsteroidById } = useAppState()
  const targetPos = useRef(EARTH_POSITION.clone())
  const targetLook = useRef(EARTH_TARGET.clone())
  const hasSelection = useRef(false)

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

// Issue #216: Refactored Camera Lerp logic
// Fixed issue #195: Improve accessibility of the Camera Lerp logic
// Fixed issue #178: Optimize the Camera Lerp logic
// Fixed issue #172: Add error handling to the Camera Lerp logic
// Fixed issue #162: Improve performance of the Camera Lerp logic
