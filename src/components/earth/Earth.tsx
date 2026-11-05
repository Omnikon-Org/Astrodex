"use client"

import { useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import {
  createProceduralNightTexture,
  createProceduralSpecularTexture,
  createProceduralCloudTexture,
} from "./textures"

const vertexShader = `
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D specularTexture;
uniform sampler2D cloudShadowTexture;
uniform vec3 sunDirection;

varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 sunDir = normalize(sunDirection);

  float NdotL = dot(normal, sunDir);

  vec3 dayColor = texture2D(dayTexture, vUv).rgb;
  vec3 nightColor = texture2D(nightTexture, vUv).rgb;
  float specularMap = texture2D(specularTexture, vUv).r;

  // Cloud shadow projected onto Earth surface
  // Offset UV slightly in the sun direction to simulate shadow projection
  vec2 shadowOffset = vec2(sunDir.x, sunDir.y) * 0.012;
  float cloudShadow = texture2D(cloudShadowTexture, vUv + shadowOffset).r;
  float shadowFactor = 1.0 - cloudShadow * 0.28 * step(0.0, NdotL);
  dayColor *= shadowFactor;

  // Keep terrain readable on the unlit hemisphere. City lights should only
  // appear on the true night side, rather than bleeding across the terminator.
  float nightMix = 1.0 - smoothstep(-0.12, -0.025, NdotL);
  float dayLight = 0.22 + max(NdotL, 0.0) * 0.82;
  vec3 litDay = dayColor * dayLight;
  vec3 nightSide = dayColor * 0.30 + nightColor * vec3(0.92, 0.78, 0.56) * 0.24;
  vec3 color = mix(litDay, nightSide, nightMix);

  // A narrow, restrained blue twilight keeps the day/night boundary defined
  // without washing whole regions in amber.
  float twilight = exp(-pow(NdotL / 0.055, 2.0));
  color += vec3(0.18, 0.34, 0.58) * twilight * 0.055;

  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 halfVec = normalize(sunDir + viewDir);
  float spec = pow(max(dot(normal, halfVec), 0.0), 64.0);
  float oceanSpec = spec * specularMap * 0.62;

  color += vec3(1.0, 0.95, 0.8) * oceanSpec;

  gl_FragColor = vec4(color, 1.0);
}
`

interface EarthProps {
  sunDirection: THREE.Vector3
}

export function Earth({ sunDirection }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const dayTexture = useTexture("/earth-blue-marble.jpg")
  dayTexture.colorSpace = THREE.SRGBColorSpace
  dayTexture.anisotropy = 8

  const uniforms = useMemo(() => ({
    dayTexture: { value: dayTexture as THREE.Texture },
    nightTexture: { value: new THREE.CanvasTexture(createProceduralNightTexture()) },
    specularTexture: { value: new THREE.CanvasTexture(createProceduralSpecularTexture()) },
    cloudShadowTexture: { value: new THREE.CanvasTexture(createProceduralCloudTexture()) },
    sunDirection: { value: sunDirection.clone() },
  }), [dayTexture, sunDirection])

  useEffect(() => {
    uniforms.sunDirection.value.copy(sunDirection)
  }, [sunDirection, uniforms])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}
