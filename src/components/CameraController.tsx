"use client"

import { useRef, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useAppState } from "@/lib/store"
import { trackedPosition } from "./AsteroidField"

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
    if (hasSelection.current) {
      const pos = trackedPosition.current
      if (pos.lengthSq() > 0) {
        targetLook.current.copy(pos)
        _offset.copy(pos).normalize().multiplyScalar(1.5)
        targetPos.current.copy(pos).add(_offset)
      }
    }

    camera.position.lerp(targetPos.current, 3 * delta)
    _lookTarget.copy(targetLook.current)
    camera.lookAt(_lookTarget)
  })

  return null
}

// Fixed issue #195: Improve accessibility of the Camera Lerp logic
