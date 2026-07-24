# AstroDex Architecture

This document provides a high-level overview of the architectural decisions and systems underlying AstroDex.

## Overview

AstroDex is built as a single-page immersive 3D application using Next.js 16 (App Router) as the framework. The core separation of concerns divides the application into two distinct layers:
1. **The HUD (React DOM)**: 2D user interface overlays, data management, and accessibility layers.
2. **The Scene (React Three Fiber)**: The 3D WebGL context handling rendering, camera physics, and orbital mechanics.

## Key Subsystems

### State Management
State is managed globally using React Context (`src/lib/store.tsx`). The `AppProvider` handles:
- Selection state (which asteroid is targeted)
- Camera animation triggers
- Global simulation controls (time scale, play/pause)
- Claim system state

### 3D Rendering (WebGL)
The 3D environment relies on Three.js and React Three Fiber.
- **InstancedMesh**: To render 600+ asteroids efficiently, we use a single `THREE.InstancedMesh`. Positions, colors, and scales are calculated and updated via `setMatrixAt` and `setColorAt`.
- **Custom Shaders**: The Earth, atmosphere, and cloud layers use custom GLSL shaders (vertex and fragment) embedded directly in the components to minimize loading overhead.
- **Post-processing**: We use `@react-three/postprocessing` for visual polish like Bloom (glow effects) and Vignette.

### Orbital Mechanics Engine
The physics engine (`src/lib/kepler.ts`) simulates Keplerian orbits using real-world mathematical models adapted for real-time processing:
- Mean anomaly is advanced per frame based on mean motion.
- Kepler's equation is solved iteratively to find the eccentric anomaly.
- Vis-viva equations calculate dynamic orbital velocity.

## Performance Considerations

- **SSR Exemption**: The `<Scene>` component is imported dynamically with `ssr: false` to ensure WebGL only initializes on the client and avoids hydration mismatches.
- **Garbage Collection (GC) Pressure**: Operations inside `useFrame` are optimized by reusing module-level instantiated objects (`THREE.Vector3`, `THREE.Color`, `THREE.Object3D`) to avoid continuous memory allocations and GC stuttering.
- **State Segregation**: HUD state updates are kept as shallow as possible to prevent cascading re-renders in the heavy 3D canvas.
