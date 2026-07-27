# AstroDex Architecture

## Overview

AstroDex is a single-page application combining a full-screen WebGL 3D scene with a React-based UI HUD overlay. The architecture follows Next.js 16 App Router conventions with client-side rendering for all 3D components.

---

## Rendering Pipeline

### Layer Stack

```
Z-Index Hierarchy (top to bottom):

z-50    Header, LeftSidebar, RightSidebar, AgentTerminal (HUD overlay)
z-42    AsteroidCard (Floating inspector panel aligned dynamically next to LeftSidebar)
z-0     Canvas container (fixed inset-0)
        └── R3F Canvas
             ├── Background color (#000008)
             ├── SceneContent
             │    ├── Lights (ambient + directional)
             │    ├── Stars
             │    ├── Earth group
             │    │    ├── Earth (ShaderMaterial)
             │    │    ├── CloudLayer (ShaderMaterial, transparent)
             │    │    └── Atmosphere (ShaderMaterial, BackSide)
             │    ├── SatelliteSystem (Orbit rings & satellite meshes)
             │    ├── AsteroidField (Dual InstancedMeshes: Asteroids & Space Debris)
             │    ├── CameraController
             │    └── Effects (EffectComposer)
```

### WebGL Optimizations

- **Dual InstancedMesh**: Renders 400 asteroids and 200 debris particles in exactly 2 draw calls.
- **Dodecahedron (Asteroids) vs Box (Debris)**: Different geometric topologies and color profiles differentiate natural space rocks from man-made space garbage.
- **Dynamic Scale Filtering**: Setting the scale of inactive object filters to `0` inside the `useFrame` vertex calculation dynamically culls them from GPU rasterization without rebuilding the instanced array.
- **Canvas-generated textures**: Generates Earth day, night, specular, and cloud maps procedurally once on mount.

---

## Component Tree

```
RootLayout (server)
└── Home (client)
    └── AppProvider (context)
        ├── Scene (dynamic, ssr: false)
        │    └── Canvas
        │         └── SceneContent
        │              ├── Earth → ShaderMaterial
        │              ├── CloudLayer → ShaderMaterial
        │              ├── Atmosphere → ShaderMaterial
        │              ├── SatelliteSystem → Trajectory lines & animated satellite dots
        │              ├── AsteroidField → 2x InstancedMesh (Asteroids / Debris)
        │              ├── CameraController → useFrame
        │              └── Effects → EffectComposer
        ├── Header (simulation state, risk, clock)
        ├── LeftSidebar (filter, search, details, conjunction feed)
        ├── RightSidebar (planner inputs, orbital parameters)
        ├── AgentTerminal (monospaced logs)
        └── AsteroidCard (inspector card, claim toggle)
```

---

## Data Flow

### Proximity & Conjunction Detection

```
SatelliteSystem (ISS, Envisat, Hubble) updates positions in useFrame
       │
       ▼
AsteroidField useFrame calculates distance between moving objects and satellite positions
       │
       ▼
If distance < 0.15 units (~500 km)
       │
       ├──► Mark object as `atRisk = true` (triggering flashing red instance color pulse)
       │
       └──► Throttle check (8-second window)
                 │
                 ▼
            Trigger AppState.addConjunctionAlert(...)
                 │
                 ├──► LeftSidebar Conjunction table updates
                 └──► AgentTerminal prints warning log
```

### Dynamic Orbital Telemetry Override

```
User adjusts Altitude, Inclination, RAAN, or Eccentricity in RightSidebar
       │
       ▼
User clicks "Apply Trajectory"
       │
       ▼
AppState.updateSatelliteParams(alt, inc, raan)
AppState.updateSatelliteEccentricity(e)
       │
       ├──► SatelliteSystem intercepts state changes
       │         │
       │         ▼
       │    Recalculates 96 elliptical points via getEllipticalOrbitPosition
       │    Redraws 3D orbit line loop dynamically (true ellipse)
       │
       └──► Re-computes dynamic orbit speed via Vis-Viva
                 │
                 ▼
            Updates RightSidebar numeric readouts
```

### LEO Orbital Decay & Boost Burn

```
SatelliteSystem useFrame (every render, sim running)
       │
       ▼
decayAltitude(LEO_DECAY_KM_PER_SEC × delta)
       │
       ▼
satAltitude in store decrements (clamped to 180 km floor)
       │
       ├──► issRadius (scene units) re-derives from new altitude
       │         │
       │         ▼
       │    ISS orbit-line geometry regenerates, visibly shrinks
       │    Collision distance to debris decreases → more conjunctions
       │
       └──► RightSidebar LEO Decay Monitor health bar
            drops from green → amber → red
       │
       ▼
User clicks "Boost Burn (+50 km)" in Right Sidebar
       │
       ▼
AppState.boostBurn(50)
       │
       ├──► satAltitude += 50 (clamped to 500 km ceiling)
       ├──► boostCount++ → AgentTerminal appends [MANV] log line
       └──► ISS orbit ring re-derives back to larger radius
```

### Keplerian Propagation (per-frame)

```
SatelliteSystem.useFrame
       │
       ├──► For each satellite (ISS, Envisat, Hubble):
       │       n = meanMotion(a)                         // √(μ/a³)
       │       M = n · t · SCENE_TIME_SCALE
       │       E = solveKepler(M, e)                     // Newton-Raphson
       │       pos = getEllipticalOrbitPosition(a, e, E, i, Ω)
       │
AsteroidField.useFrame
       │
       └──► For each of 600 objects:
               n = meanMotion(orbitRadius)
               M = n · t · SCENE_TIME_SCALE + meanAnomaly0
               E = solveKepler(M, eccentricity)
               x_pf = a(cos E − e)
               y_pf = a·√(1−e²)·sin E
               v = visViva(√(x²+y²+z²), a)              // km/s HUD read-out
```

---

## Orbital Physics Module

All Keplerian / Vis-Viva / decay math lives in `src/lib/kepler.ts` and is unit-tested against the standard gravitational parameter `μ_Earth = 3.986×10⁵ km³/s²`. The scene uses a presentation-tuned `μ_scene = 0.005` so LEO completes an orbit in tens of seconds while preserving relative physics between objects of differing orbital radii.

| Function                            | Purpose                                             |
| ----------------------------------- | --------------------------------------------------- |
| `solveKepler(M, e)`                 | Newton-Raphson solver for `M = E − e·sin(E)`        |
| `meanMotion(a)`                     | `√(μ_scene / a³)` in rad/s                          |
| `visViva(r, a)`                     | `√(μ·(2/r − 1/a))` in scene units/s                 |
| `visVivaKmPerSec(rKm, aKm)`         | Same formula, returns real km/s for HUD             |
| `kmToSceneUnits` / `sceneUnitsToKm` | 3543 km per unit (Earth radius 6378 km = 1.8 units) |
| `LEO_DECAY_KM_PER_SEC`              | 0.05 km/s of real time                              |

---

## Shader Architecture

### Earth Material

```glsl
// Inputs
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D specularTexture;
uniform vec3 sunDirection;

// Key calculations
float NdotL = dot(normal, sunDir);          // Lighting factor
float dayMix = clamp(NdotL * 1.2 + 0.1, 0, 1);  // Day/night blend
float twilight = 1.0 - abs(NdotL);           // Terminator glow
float oceanSpec = spec * specularMap * 0.8;  // Ocean highlights
```

---

## State Management

Simple React Context (`AppProvider`) orchestrating HUD overlays, simulation ticking, object catalog parameters, and real-time alerts:

```typescript
interface AppState {
  selectedAsteroid: AsteroidData | null
  claimedAsteroids: Set<number>
  selectAsteroid: (a: AsteroidData | null) => void
  claimAsteroid: (id: number) => void
  resetCamera: boolean
  triggerReset: () => void
  clearReset: () => void
  simulationRunning: boolean
  toggleSimulation: () => void
  riskLevel: "HIGH" | "MEDIUM" | "LOW"
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  terminalExpanded: boolean
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void
  toggleTerminal: () => void
  searchAsteroidById: (id: number) => void
  registerAsteroidData: (data: AsteroidData[]) => void

  // Dynamic Space Debris filters & Satellite Trajectories
  filterType: "ALL" | "ASTEROIDS" | "DEBRIS"
  setFilterType: (f: "ALL" | "ASTEROIDS" | "DEBRIS") => void
  satAltitude: number
  satInclination: number
  satRaan: number
  satEccentricity: number
  updateSatelliteParams: (alt: number, inc: number, raan: number) => void
  updateSatelliteEccentricity: (e: number) => void
  decayAltitude: (amount: number) => void
  boostBurn: (deltaKm: number) => void
  boostCount: number
  conjunctions: ConjunctionAlert[]
  addConjunctionAlert: (alert: Omit<ConjunctionAlert, "id">) => void
  clearConjunctions: () => void
}
```
