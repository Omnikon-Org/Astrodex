"use client"

import { useRef, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { useAppState } from "@/lib/store"
import { trackedPosition } from "./AsteroidField"

const EARTH_POSITION = new THREE.Vector3(0, 0, 13)
const EARTH_TARGET = new THREE.Vector3(0, 0, 0)
const _previousTrackedPosition = new THREE.Vector3()
const _trackedDelta = new THREE.Vector3()
const _initialOffset = new THREE.Vector3()

interface CameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>
}

export function CameraController({ controlsRef }: CameraControllerProps) {
  const { camera } = useThree()
  const { selectedAsteroid, resetCamera, clearReset } = useAppState()
  const hasSelection = useRef(false)
  const isAcquiring = useRef(false)

  useEffect(() => {
    if (resetCamera) {
      hasSelection.current = false
      isAcquiring.current = false
      camera.position.copy(EARTH_POSITION)
      controlsRef.current?.target.copy(EARTH_TARGET)
      controlsRef.current?.update()
      clearReset()
    }
  }, [resetCamera, clearReset, camera, controlsRef])

  useEffect(() => {
    if (selectedAsteroid) {
      hasSelection.current = false
      isAcquiring.current = true
    }
  }, [selectedAsteroid])

  useFrame(() => {
    const controls = controlsRef.current
    if (!controls) return

    if (isAcquiring.current && selectedAsteroid) {
      const pos = trackedPosition.current
      if (pos.lengthSq() > 0) {
        controls.target.copy(pos)
        _initialOffset.copy(camera.position).sub(pos)
        if (_initialOffset.length() > 2.8) _initialOffset.setLength(2.8)
        camera.position.copy(pos).add(_initialOffset)
        controls.update()
        _previousTrackedPosition.copy(pos)
        hasSelection.current = true
        isAcquiring.current = false
      }
      return
    }

    if (hasSelection.current && selectedAsteroid) {
      const pos = trackedPosition.current
      _trackedDelta.subVectors(pos, _previousTrackedPosition)
      if (_trackedDelta.lengthSq() > 0) {
        controls.target.add(_trackedDelta)
        camera.position.add(_trackedDelta)
        _previousTrackedPosition.copy(pos)
      }
    }
  })

  return null
}
