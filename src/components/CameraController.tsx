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
    const { targetPos: newPos, targetLook: newLook } = calculateCameraTargets(
      hasSelection.current,
      trackedPosition.current,
      targetPos.current,
      targetLook.current
    )
    
    targetPos.current.copy(newPos)
    targetLook.current.copy(newLook)

    camera.position.lerp(targetPos.current, 3 * delta)
    _lookTarget.copy(targetLook.current)
    camera.lookAt(_lookTarget)
  })

  return null
}
