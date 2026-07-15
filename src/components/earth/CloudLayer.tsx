"use client"

import { useRef, useEffect, useMemo } from "react"
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
  // Sample the grayscale cloud map and push denser pixels slightly above the
  // Earth sphere so the layer has visible volume at the day/night boundary.
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
  // Use the red channel as both cloud coverage and opacity. Lighting remains
  // directional so clouds brighten on the sun-facing side of the planet.
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

/**
 * Renders the procedural cloud shell around Earth.
 *
 * The texture is created once per sun-direction setup, while the mesh rotates
 * in the frame loop. Transparent blending and disabled depth writes keep the
 * shell from hiding satellites or the atmosphere behind sparse cloud pixels.
 */
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
