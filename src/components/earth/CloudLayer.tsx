"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { createProceduralCloudTexture } from "./textures"

const vertexShader = `
uniform sampler2D cloudTexture;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vCloudDensity;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  float cloudDensity = texture2D(cloudTexture, uv).r;
  vCloudDensity = cloudDensity;
  float displacement = cloudDensity * 0.018;
  vec3 newPosition = position + normal * displacement;
  vPosition = (modelViewMatrix * vec4(newPosition, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`

const fragmentShader = `
uniform sampler2D cloudTexture;
uniform vec3 sunDirection;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vCloudDensity;

void main() {
  vec4 cloudColor = texture2D(cloudTexture, vUv);
  float alpha = cloudColor.r * 0.65;

  vec3 normal = normalize(vNormal);
  vec3 sunDir = normalize(sunDirection);
  float NdotL = dot(normal, sunDir);
  float lighting = clamp(NdotL * 0.5 + 0.5, 0.0, 1.0);

  vec3 color = vec3(1.0) * lighting * 0.9;

  gl_FragColor = vec4(color, alpha);
}
`

interface CloudLayerProps {
  sunDirection: THREE.Vector3
}

export function CloudLayer({ sunDirection }: CloudLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniformsRef = useRef({
    cloudTexture: { value: null as unknown as THREE.Texture },
    sunDirection: { value: sunDirection.clone() },
  })

  useEffect(() => {
    const tex = new THREE.CanvasTexture(createProceduralCloudTexture())
    uniformsRef.current.cloudTexture.value = tex
    uniformsRef.current.sunDirection.value.copy(sunDirection)
  }, [sunDirection])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.06
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.85, 48, 48]} />
      <shaderMaterial
        uniforms={uniformsRef.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
