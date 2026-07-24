"use client"

import { useRef, useEffect, useMemo } from "react"
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

  vec3 sunDir = normalize(sunDirection);
  float sunFace = dot(normalize(vWorldNormal), sunDir);
  
  // Sunset glow near terminator
  float sunsetMix = smoothstep(0.2, -0.1, sunFace) * smoothstep(-0.4, -0.1, sunFace);
  vec3 dayColor = vec3(0.2, 0.5, 1.0);
  vec3 sunsetColor = vec3(1.0, 0.4, 0.1);
  vec3 atmosphereColor = mix(dayColor, sunsetColor, sunsetMix);

  // Thinner, brighter edge (Rayleigh approximation)
  float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
  fresnel = pow(fresnel, 5.0) * 1.5;

  // Global alpha based on dayside
  float daySide = smoothstep(-0.2, 0.2, sunFace);
  float alpha = fresnel * daySide;

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

  useEffect(() => {
    uniforms.sunDirection.value.copy(sunDirection)
  }, [sunDirection, uniforms])

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
