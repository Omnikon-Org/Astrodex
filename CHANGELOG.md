# Changelog

All notable changes to AstroDex will be documented here.

## [0.2.0] — 2026-06-02

### Added — Advanced Orbital Physics

- **Kepler's Equation Solver** (`src/lib/kepler.ts`)
  - Newton-Raphson iterative solver for `M = E − e·sin(E)`, robust initial guess for high-eccentricity regimes, convergence tolerance 1e-7.
  - Now drives every object (400 asteroids + 200 space debris) along a true elliptical orbit parameterized by `(a, e, M₀)`.
- **Vis-Viva Velocity**
  - `v = sqrt( μ·(2/r − 1/a) )` is recomputed per-frame from the current radius and semi-major axis.
  - HUD telemetry displays the dynamic km/s speed (objects accelerate at perigee, decelerate at apogee).
- **LEO Orbital Decay**
  - ISS altitude continuously drops at `0.05 km/s` of real time via atmospheric drag, clamped to a 180 km re-entry floor and 500 km ceiling.
  - Right Sidebar adds a **LEO Decay Monitor** with a green/amber/red health bar and a **Boost Burn (+50 km)** action.
  - Boost Burn is logged to the Agent Terminal as a `[MANV]` event and persisted via `boostCount` in the store.
- **Per-Object Eccentricity**
  - Asteroids: random `e ∈ [0, 0.28)`; Debris: random `e ∈ [0, 0.18)`. The orbit-line and 3D position reflect the resulting ellipse.
- **Elliptical Satellites**
  - Envisat, Hubble and the user-controlled ISS now also propagate via Kepler. Orbit-line geometries sweep eccentric anomaly to render real ellipses.
- **Eccentricity control** in the Right Sidebar's Manual Satellite panel (0–0.9).

### Fixed

- `store.tsx`: implemented the previously-orphaned `decayAltitude` function; added `boostBurn`, `boostCount`, `updateSatelliteEccentricity`, and `satEccentricity` to the context value and `AppState` interface.
- `SatelliteSystem.tsx`: removed dead imports of `addConjunctionAlert` and `selectedAsteroid`.
- `LeftSidebar.tsx`: removed unused `generateConjunctions()` helper; renamed `lastUpdated` → `sessionLoadTime` (variable name now matches its actual meaning).
- `AsteroidField.tsx`: hoisted `SAT_POSITIONS` to module scope (was rebuilt every frame), replaced per-frame `new THREE.Vector3()` with a module-level scratch, and limited per-instance color updates to at-risk transitions (~580 fewer writes per frame).
- `AsteroidCard.tsx`: Inspector header now displays the object's actual `name` (`AST-0042` or `DEB-1985-732A`) instead of a hardcoded `AST-` prefix.
- `layout.tsx`: removed unused `Geist_Mono` font import (JetBrains Mono is the only monospace face used in the app).
- `RightSidebar.tsx`: speed readout now correctly displays Vis-Viva km/s via the standard Earth μ; the "m/s" label was misleading.

### Changed

- `getOrbitPosition` in `SatelliteSystem.tsx` is preserved as a thin circular-orbit wrapper over the new `getEllipticalOrbitPosition` helper.
- Satellite system now reports positions in scene-units consistently; the orbit-line ring radius updates as the ISS decays, so the visible LEO track shrinks over time.

## [0.1.1] — 2026-06-02

### Performance

- **Selective asteroid tracking**: Stopped cloning and mapping positions for all 600 asteroids every frame. Only the selected asteroid's position is tracked (~600× fewer per-frame allocations).
- **Texture resolution reduced**: All procedural textures halved from 2048×1024 to 1024×512, cutting GPU memory usage by ~75%.
- **Constant uniform caching**: `sunDirection` is now set once via `useEffect` instead of copied every frame in `useFrame` on Earth, CloudLayer, and Atmosphere.
- **Merged Effects component**: Removed unnecessary double dynamic import (`Effects.tsx` → `EffectsInner.tsx` → render), saving a chunk load.

### Changed

- CameraController reads from `trackedPosition` module-level ref instead of a 600-entry Map
- CloudLayer uniform initializes as `null` instead of a throwaway canvas element
- AsteroidField no longer accepts `onUpdatePosition` prop (interface simplified)

## [0.1.0] — 2026-06-01

### Added

- **Cinematic Earth** with custom GLSL shader
  - Day/night texture blending based on sun direction
  - Reddish-orange twilight terminator
  - Ocean-only specular highlights
  - Procedurally generated textures (continents, city lights, clouds)
- **Cloud Layer** — Semi-transparent cloud sphere with independent rotation
- **Atmospheric Scattering** — Fresnel-based blue rim glow on daylight side
- **Asteroid Field** — 600 GPU-instanced asteroids with unique orbits
  - Varying orbital radii, speeds, scales, inclinations
  - Per-instance vertex colors (gray/brown rock tones)
  - Click-to-select via raycasting
- **Camera System**
  - Smooth lerp-to-asteroid on click
  - Real-time tracking of moving asteroid
  - "Back to Earth" reset button
- **Post-Processing**
  - Bloom (luminance threshold 0.6) for cinematic specular/city light glare
  - Vignette for scene framing
- **UI Overlay**
  - Glassmorphic data card showing asteroid ID, distance, velocity
  - Claim/Release toggle with visual state feedback
  - "Claimed" badge with emerald styling
- **State Management** — React Context for selection, claims, camera control
- **Deep Space Dark Theme** — High-contrast minimal UI with Geist font

### Technical

- Next.js 16 App Router with TypeScript
- React Three Fiber v9 + Three.js r184
- Tailwind CSS v4
- All textures procedurally generated (no external assets required)
- Dynamic import for 3D scene (SSR disabled)
