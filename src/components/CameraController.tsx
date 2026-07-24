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
  const { selectedAsteroid, resetCamera, clearReset } = useAppState()
  const targetPos = useRef(EARTH_POSITION.clone())
  const targetLook = useRef(EARTH_TARGET.clone())
  const hasSelection = useRef(false)

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
