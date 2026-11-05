"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"

const vertexShader = `
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform vec3 sunDirection;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);

  float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
  fresnel = pow(fresnel, 2.25);

  vec3 sunDir = normalize(sunDirection);
  float sunFace = dot(normalize(vWorldNormal), sunDir);
  float daySide = clamp(sunFace * 0.5 + 0.5, 0.0, 1.0);

  vec3 blue = vec3(0.10, 0.42, 1.0);
  float twilightBand = 1.0 - smoothstep(0.008, 0.10, abs(sunFace));
  vec3 atmosphereColor = mix(blue, vec3(0.48, 0.72, 1.0), twilightBand * 0.28);

  float alpha = fresnel * (0.045 + daySide * 0.22 + twilightBand * 0.04);

  gl_FragColor = vec4(atmosphereColor, alpha);
}
`

interface AtmosphereProps {
  sunDirection: THREE.Vector3
}

export function Atmosphere({ sunDirection }: AtmosphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const uniformsRef = useRef({
    sunDirection: { value: sunDirection.clone() },
  })

  useEffect(() => {
    uniformsRef.current.sunDirection.value.copy(sunDirection)
  }, [sunDirection])

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.94, 64, 64]} />
      <shaderMaterial
        uniforms={uniformsRef.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  )
}
