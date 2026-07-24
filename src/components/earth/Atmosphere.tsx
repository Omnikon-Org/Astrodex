"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldNormal;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform vec3 sunDirection;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldNormal;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(-vPosition);

  float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
  fresnel = pow(fresnel, 3.0);

  vec3 sunDir = normalize(sunDirection);
  float sunFace = dot(normalize(vWorldNormal), sunDir);
  float daySide = clamp(sunFace * 0.5 + 0.5, 0.0, 1.0);

  vec3 atmosphereColor = vec3(0.3, 0.6, 1.0);

  float alpha = fresnel * daySide * 0.5;

  gl_FragColor = vec4(atmosphereColor, alpha);
}
`

interface AtmosphereProps {
  sunDirection: THREE.Vector3
}

export function Atmosphere({ sunDirection }: AtmosphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(() => ({
    sunDirection: { value: sunDirection.clone() },
  }), [sunDirection])

  useFrame(() => {
    uniforms.sunDirection.value.copy(sunDirection)
  })

  return (
    <mesh ref={meshRef} renderOrder={3}>
      <sphereGeometry args={[2.0, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  )
}
