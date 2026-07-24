"use client"

import { useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import {
  createProceduralEarthTexture,
  createProceduralNightTexture,
  createProceduralSpecularTexture,
  createProceduralCloudTexture,
} from "./textures"

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
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
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 sunDir = normalize(sunDirection);

  float NdotL = dot(normal, sunDir);

  vec3 dayColor = texture2D(dayTexture, vUv).rgb;
  vec3 nightColor = texture2D(nightTexture, vUv).rgb;
  float specularMap = texture2D(specularTexture, vUv).r;

  // Cloud shadow projected onto Earth surface
  // Offset UV slightly in the sun direction to simulate shadow projection
  vec2 shadowOffset = vec2(sunDir.x, sunDir.y) * 0.012;
  float cloudShadow = texture2D(cloudShadowTexture, vUv + shadowOffset).r;
  float shadowFactor = 1.0 - cloudShadow * 0.35 * step(0.0, NdotL);

  float dayMix = clamp(NdotL * 1.2 + 0.1, 0.0, 1.0);

  float twilight = 1.0 - abs(NdotL);
  twilight = smoothstep(0.0, 0.6, twilight);
  vec3 twilightColor = vec3(0.9, 0.4, 0.1) * twilight * 0.5;

  vec3 warmNight = nightColor * vec3(1.55, 1.05, 0.55) * 0.20;
  vec3 color = mix(warmNight, dayColor * shadowFactor, dayMix);
  color += twilightColor;

  vec3 viewDir = normalize(-vPosition);
  vec3 halfVec = normalize(sunDir + viewDir);
  float spec = pow(max(dot(normal, halfVec), 0.0), 64.0);
  float oceanSpec = spec * specularMap * 0.8;

  color += vec3(1.0, 0.95, 0.8) * oceanSpec;

  gl_FragColor = vec4(color, 1.0);
}
`

interface EarthProps {
  sunDirection: THREE.Vector3
}

export function Earth({ sunDirection }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(() => {
    const day = new THREE.CanvasTexture(createProceduralEarthTexture())
    const night = new THREE.CanvasTexture(createProceduralNightTexture())
    const spec = new THREE.CanvasTexture(createProceduralSpecularTexture())
    const cloud = new THREE.CanvasTexture(createProceduralCloudTexture())
    return {
      dayTexture: { value: day },
      nightTexture: { value: night },
      specularTexture: { value: spec },
      cloudShadowTexture: { value: cloud },
      sunDirection: { value: sunDirection.clone() },
    }
  }, [sunDirection])

  useEffect(() => {
    return () => {
      uniforms.dayTexture.value.dispose()
      uniforms.nightTexture.value.dispose()
      uniforms.specularTexture.value.dispose()
      uniforms.cloudShadowTexture.value.dispose()
    }
  }, [uniforms])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
    }
    uniforms.sunDirection.value.copy(sunDirection)
  })

  return (
    <mesh ref={meshRef} renderOrder={1}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}
