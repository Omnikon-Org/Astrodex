"use client"

import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import * as THREE from "three"

const CHROMATIC_OFFSET = new THREE.Vector2(0.0012, 0.0008)

export function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={1.5} luminanceThreshold={0.6} luminanceSmoothing={0.02} mipmapBlur />
      <Vignette offset={0.3} darkness={0.7} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  )
}
