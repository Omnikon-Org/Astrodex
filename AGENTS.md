# AstroDex — Agent Guide

## Project Overview
Interactive 3D asteroid explorer: cinematic Earth with custom GLSL shaders, 600 instanced asteroids/debris on Keplerian elliptical orbits, click-to-inspect with camera tracking, claim system, real-time conjunction detection, LEO orbital decay, and post-processing bloom.

## Tech Stack
- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- React Three Fiber v9, Three.js r184, @react-three/drei v10
- @react-three/postprocessing v3 (Bloom, Vignette)

## Key Conventions
- All 3D components are `"use client"` and rendered via `next/dynamic({ ssr: false })`
- Shader code is inlined as template literals (`.glsl` imports not supported)
- State lives in React Context (`src/lib/store.tsx`)
- Textures are procedurally generated via Canvas 2D (`src/components/earth/textures.ts`)
- Asteroids use `<InstancedMesh>` — always use `setMatrixAt` + `setColorAt`, never individual meshes
- Camera tracking uses `camera.position.lerp()` in `useFrame`
- **Orbital mechanics** live in `src/lib/kepler.ts`.  Do not duplicate the math — import `solveKepler`, `meanMotion`, `visViva`, etc.  Scene-unit / km conversions use `kmToSceneUnits` / `sceneUnitsToKm` (1 unit = 3543 km).
- Module-level scratch `THREE.Vector3` / `Object3D` / `Color` instances are reused inside `useFrame` to avoid per-frame GC pressure.  Never `new THREE.Vector3()` inside a render loop.

## File Structure
```
src/
  app/           # Pages + layout
  components/    # React + R3F components
    earth/       # Earth, CloudLayer, Atmosphere, textures
  lib/           # Types, store, kepler (orbital physics)
```

## Common Tasks

### Adding a new 3D object
1. Create component in `src/components/`
2. Import and render in `Scene.tsx` → `SceneContent`
3. If it needs state, wire through `AppProvider` store
4. If it needs orbital motion, use `solveKepler` / `meanMotion` and store `(a, e, M₀)` per instance

### Changing the Earth shader
Edit the `vertexShader` / `fragmentShader` template literals in `Earth.tsx` (or `CloudLayer.tsx` / `Atmosphere.tsx`).

### Adding new textures
Generate procedurally in `textures.ts` or place images in `public/textures/` and load with `useTexture`.

### Adding an orbital catalog item (asteroid / debris)
- Generate entries in `generateOrbitalObjectData` in `AsteroidField.tsx`
- Set `(orbitRadius, eccentricity, meanAnomaly0)` — `Kepler's equation` is solved per frame from these
- The `velocity` string is overwritten each frame from the live Vis-Viva speed when the object is selected

### Supabase integration
Replace `claimAsteroid` in `store.tsx` with a Supabase client upsert. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Next.js 16 Notes
- This is NOT standard Next.js — check `node_modules/next/dist/docs/` for breaking changes
- Turbopack is used by default
- `next/dynamic` with `ssr: false` is required for all Three.js components
