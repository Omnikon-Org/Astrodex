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
const _shake = new THREE.Vector3()

export function CameraController() {
  const { camera } = useThree()
  const { selectedAsteroid, resetCamera, clearReset, reduceMotion } = useAppState()
  const targetPos = useRef(EARTH_POSITION.clone())
  const targetLook = useRef(EARTH_TARGET.clone())
  const lastTargetPos = useRef(EARTH_POSITION.clone())
  const shakeTime = useRef(0)
  

  useEffect(() => {
    if (resetCamera) {
      clearReset()
    }
  }, [resetCamera, clearReset])


  useFrame((_, delta) => {
    if (selectedAsteroid) {
      const pos = trackedPosition.current
      if (pos.lengthSq() > 0) {
        targetLook.current.copy(pos)
        _offset.copy(pos).normalize().multiplyScalar(1.5)
        targetPos.current.copy(pos).add(_offset)
      }
    } else{
      targetPos.current.copy(EARTH_POSITION)
      targetLook.current.copy(EARTH_TARGET)
    }

    if (reduceMotion) {
      camera.position.copy(targetPos.current)
    } else {
      camera.position.lerp(targetPos.current, 3 * delta)
    }
    _lookTarget.copy(targetLook.current)
    if (shakeTime.current > 0) {
      const amp = shakeTime.current * 0.018
      _shake.set(
        Math.sin(shakeTime.current * 80) * amp,
        Math.cos(shakeTime.current * 97) * amp,
        0
      )
      camera.position.add(_shake)
      shakeTime.current = Math.max(0, shakeTime.current - delta)
    }
    camera.lookAt(_lookTarget)
  })

  return null
}
