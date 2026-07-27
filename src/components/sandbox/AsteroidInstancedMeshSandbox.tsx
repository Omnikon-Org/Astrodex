"use client"

import { Canvas } from "@react-three/fiber"
import { AsteroidField } from "../AsteroidField"
import { AppProvider } from "@/lib/store"

export function AsteroidInstancedMeshSandbox() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <AppProvider>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <color attach="background" args={["#000"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <AsteroidField />
        </Canvas>
      </AppProvider>
    </div>
  )
}
