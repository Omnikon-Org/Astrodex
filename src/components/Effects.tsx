"use client"

import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import * as THREE from "three"

const BLOOM_CONFIG = {
  intensity: 1.5,
  luminanceThreshold: 0.6,
  luminanceSmoothing: 0.02,
  mipmapBlur: true,
}

export function Effects() {
  return (
    <EffectComposer>
      <Bloom {...BLOOM_CONFIG} />
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.002, 0.002)}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  )
}
