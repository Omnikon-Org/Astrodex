"use client"

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"

export function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.82}
        luminanceThreshold={0.68}
        luminanceSmoothing={0.14}
        mipmapBlur
      />
      <Vignette
        offset={0.28}
        darkness={0.46}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
