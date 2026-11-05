"use client"

import { useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { createProceduralCloudTexture } from "./textures"

const vertexShader = `
uniform sampler2D cloudTexture;
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying float vCloudDensity;

void main() {
  vUv = uv;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  float cloudDensity = texture2D(cloudTexture, uv).r;
  vCloudDensity = cloudDensity;
  float displacement = cloudDensity * 0.018;
  vec3 newPosition = position + normal * displacement;
  vec4 worldPosition = modelMatrix * vec4(newPosition, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`

const fragmentShader = `
uniform sampler2D cloudTexture;
uniform vec3 sunDirection;

varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying float vCloudDensity;

void main() {
  vec4 cloudColor = texture2D(cloudTexture, vUv);
  float alpha = smoothstep(0.18, 0.78, cloudColor.r) * 0.30;

  vec3 normal = normalize(vWorldNormal);
  vec3 sunDir = normalize(sunDirection);
  float NdotL = dot(normal, sunDir);
  float lighting = smoothstep(-0.25, 0.72, NdotL);
  float rim = pow(1.0 - max(dot(normal, normalize(cameraPosition - vWorldPosition)), 0.0), 2.0);

  vec3 color = mix(vec3(0.48, 0.70, 0.92), vec3(1.0), lighting) * (0.68 + rim * 0.28);
  alpha *= 0.45 + lighting * 0.55;

  gl_FragColor = vec4(color, alpha);
}
`

interface CloudLayerProps {
  sunDirection: THREE.Vector3
}

export function CloudLayer({ sunDirection }: CloudLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(() => ({
    cloudTexture: { value: null as unknown as THREE.Texture },
    sunDirection: { value: sunDirection.clone() },
  }), [sunDirection])

  useEffect(() => {
    const tex = new THREE.CanvasTexture(createProceduralCloudTexture())
    uniforms.cloudTexture.value = tex
    uniforms.sunDirection.value.copy(sunDirection)
  }, [sunDirection, uniforms])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.06
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.85, 48, 48]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
