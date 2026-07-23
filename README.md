# AstroDex 🌌

**Interactive 3D Asteroid & Orbital Explorer**

AstroDex is a real-time, cinematic 3D space mission control simulator that lets you explore 600+ asteroids and orbital debris in Earth's orbit. Track near-Earth conjunctions, inspect Keplerian orbital parameters, deploy manual satellites, and file mining claims right from your browser.

## Features
![AstroDex Badge](https://img.shields.io/badge/AstroDex-Space%20Situational%20Awareness-0f172a?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzOGJkZjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxwYXRoIGQ9Ik0xMiAyYTEwIDEwIDAgMCAxIDAgMjAiLz48cGF0aCBkPSJNMTIgMmExMCAxMCAwIDAgMCAwIDIwIi8+PC9zdmc+)

# 🌌 AstroDex — Space Objects & Debris Explorer

**An interactive, open-source 3D space situational awareness (SSA) dashboard and command center.**
Visualize asteroids, track orbital debris, and monitor conjunction threats with active satellites — all in real-time.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-astrodex--nine.vercel.app-38bdf8?style=flat-square)](https://astrodex-nine.vercel.app)
[![Issues](https://img.shields.io/github/issues/Omnikon-Org/Astrodex?style=flat-square&color=34d399&label=Issues)](https://github.com/Omnikon-Org/Astrodex/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/Omnikon-Org/Astrodex?style=flat-square&color=a78bfa&label=PRs)](https://github.com/Omnikon-Org/Astrodex/pulls)
[![License](https://img.shields.io/github/license/Omnikon-Org/Astrodex?style=flat-square&color=f59e0b)](https://github.com/Omnikon-Org/Astrodex/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/Omnikon-Org/Astrodex?style=flat-square&color=fbbf24)](https://github.com/Omnikon-Org/Astrodex/stargazers)
[![Forks](https://img.shields.io/github/forks/Omnikon-Org/Astrodex?style=flat-square&color=818cf8)](https://github.com/Omnikon-Org/Astrodex/network/members)

- 🌍 **Cinematic Earth View**: Custom GLSL shaders for Earth, atmosphere, and cloud layers.
- 🚀 **600+ Instanced Asteroids/Debris**: Procedurally generated asteroids on Keplerian elliptical orbits.
- 🎯 **Click-to-Inspect & Camera Tracking**: Seamlessly select asteroids in 3D space, tracking them dynamically with smooth camera lerping.
- ⚠️ **Real-time Conjunction Detection**: Live alerts when objects pass within a dangerous proximity to Earth.
- 🛰️ **LEO Orbital Decay**: Monitor satellite altitudes and receive warnings as orbits decay towards the critical limit.
- 💎 **Claim System**: File simulated mining claims on valuable asteroids.
- ♿ **Accessible UI**: Keyboard navigation, screen-reader support, "reduce motion" toggles, and semantic HTML layouts for the HUD.
- 🔍 **SEO Optimized**: Canonical URLs, Open Graph tags, JSON-LD structured data, and dynamic sitemaps.

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **3D Rendering**:
  - [Three.js (r184)](https://threejs.org/)
  - [React Three Fiber v9](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
  - [@react-three/drei v10](https://github.com/pmndrs/drei)
  - [@react-three/postprocessing v3](https://github.com/pmndrs/react-postprocessing) (Bloom, Vignette)
- **State Management**: React Context (`src/lib/store.tsx`)
- **Physics/Math**: Custom Orbital Mechanics Engine (`src/lib/kepler.ts`)

## Getting Started
Open in a Chromium-based browser (Chrome, Edge, Brave) for the best WebGL experience. A dedicated GPU is recommended for smooth 60 fps rendering of 600+ orbital objects.

---

## 📸 Screenshots

### Mission Control Dashboard
The full HUD overlay with 3D Earth, asteroid field, satellite orbits, and real-time conjunction alerts.

![AstroDex Main Dashboard](docs/screenshots/main-dashboard.png)

### Asteroid Filter & Conjunction Alerter
Filter the orbital catalog by object type. The Conjunction Alerter panel displays live close-approach events with miss distance and risk classification.

![AstroDex Asteroid Filter](docs/screenshots/asteroid-filter.png)

### Agent Terminal (Expanded)
The expandable Agent Terminal logs real-time sensor sweeps, conjunction screenings, maneuver burns, and orbital tracking data.

![AstroDex Agent Terminal](docs/screenshots/agent-terminal.png)

> [!TIP]
---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Server/client rendering, routing, and build tooling |
| **UI Library** | [React 19](https://react.dev/) | Component-based UI architecture |
| **3D Engine** | [Three.js](https://threejs.org/) | WebGL rendering, geometries, and materials |
| **React ↔ 3D** | [React Three Fiber (R3F)](https://r3f.docs.pmnd.rs/) | Declarative Three.js in React |
| **3D Helpers** | [@react-three/drei](https://drei.docs.pmnd.rs/) | Stars, camera controls, and instanced mesh utilities |
| **Post-Processing** | [@react-three/postprocessing](https://github.com/pmndrs/postprocessing) | Bloom, vignette, and cinematic effects |
| **Shaders** | Custom GLSL | Earth day/night rendering, atmosphere scattering, cloud layers |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe development with strict mode |
| **Styling** | Vanilla CSS + CSS Variables | Glassmorphic design system with custom properties |
| **Fonts** | [Geist](https://vercel.com/font) + [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | UI typography + monospace terminal |
| **Linting** | [ESLint](https://eslint.org/) | Code quality and consistency |
| **Deployment** | [Vercel](https://vercel.com/) | Zero-config hosting for Next.js |

---

## 🏛️ Architecture At A Glance

AstroDex keeps the simulation state and the WebGL renderer separate:

```text
AppProvider (src/lib/store.tsx)
└── Home (src/app/page.tsx)
    ├── Scene (dynamic, client-only)
    │   └── R3F Canvas
    │       └── SceneContent
    │           ├── Earth, atmosphere, and clouds
    │           ├── SatelliteSystem
    │           ├── AsteroidField
    │           └── Effects
    └── HUD components
        ├── Header, sidebars, and AgentTerminal
        └── AsteroidCard
```

`AppProvider` is the single source of truth for simulation controls, filters,
selected objects, satellite parameters, and conjunction alerts. HUD components
read and update that state through `useAppState()`. `Scene` consumes the same
state and passes only the values needed by React Three Fiber components; the
3D components keep per-frame animation in `useFrame` and report events back to
the store through callbacks.

Supabase is **not integrated yet**. The current app therefore has no Supabase
request in the render or state flow. When persistence is introduced, the
Supabase client should be added at the store/service boundary: authenticated
reads and writes belong in that layer, while R3F components should continue to
receive plain state and callbacks. See the [future Supabase setup notes](./CONTRIBUTING.md#future-supabase-setup)
and the [full architecture reference](./ARCHITECTURE.md) for the planned
integration boundary and rendering pipeline.

---

## 🌌 Core Features

- **Multi-Object Catalog Tracking**
  - **400 Rocky Asteroids (Natural)**: rendered in grey-brown rock textures, each on its own random elliptical orbit (`e ∈ [0, 0.28)`).
  - **200 Space Debris Pieces (Man-made)**: spent rocket stages, dead satellites, and metallic fragments orbiting closer to Earth, rendered in high-visibility neon colors (orange, cyan, magenta).

- **True Keplerian Orbital Mechanics**
  - Every object (asteroids, debris, and the 3 satellites) is propagated by solving Kepler's Equation with a Newton-Raphson solver in [`src/lib/kepler.ts`](src/lib/kepler.ts).
  - Per-frame Vis-Viva velocity — objects accelerate at perigee and decelerate at apogee.
  - Orbit-line geometries are drawn as true ellipses sweeping eccentric anomaly, not circles.
  - 📖 Full equations and derivations: see [ARCHITECTURE.md](./ARCHITECTURE.md#orbital-mechanics).

- **LEO Orbital Decay & Boost Burn**
  - The ISS altitude continuously drops from simulated atmospheric drag.
  - The Right Sidebar's **LEO Decay Monitor** shows a green → amber → red health bar plus current altitude and drag rate.
  - Clicking **Boost Burn** injects Δv that restores the orbit; the maneuver is logged to the Agent Terminal.
  - As the ISS decays, the orbit ring visibly shrinks and conjunction risks with debris rise.
  - 📖 Exact decay rates and altitude thresholds: see [ARCHITECTURE.md](./ARCHITECTURE.md#leo-decay-model).

- **Interactive Satellite System**
  - Renders 3D orbital planes for active satellites: **ISS (ZARYA)**, **Envisat (Polar)**, and **Hubble Space Telescope**.
  - Satellites move along realistic inclined Keplerian trajectories.

- **Real-Time Conjunction Alerting**
  - Performs live 3D collision detection between satellites and the orbital catalog.
  - Triggers alerts inside the **Conjunction Alerter** panel and log notifications in the **Agent Terminal** when a space object approaches within critical distance.
  - Highlights at-risk objects in the 3D viewport by flashing their colors to a pulsing red indicator.

- **Dynamic Orbital Telemetry Controls**
  - The Right Sidebar's **Manual Satellite (3D Orbit)** panel is fully functional. Update parameters (Altitude, Inclination, RAAN, Eccentricity) and click **Apply Trajectory** to watch the ISS satellite and its elliptical orbit trail dynamically recalculate and warp in 3D in real-time.

- **Cinematic Earth Shader**
  - Custom GLSL material blending Earth day/night textures dynamically based on sun angle, highlighting glowing cities, ocean specular reflections, a twilight terminator ring, and atmospheric Rayleigh scattering effects.

- **Agent Terminal**
  - Expandable bottom terminal dock generating monospace logs of sensor sweeps, conjunction alerts, and maneuver sequences (including boost burns).

---

## ⚡ Quick Start

Get AstroDex running locally in under a minute:

```bash
git clone https://github.com/<your-username>/Astrodex.git
cd Astrodex
npm install
npm run dev


---

### ♿ Accessibility

```md
## ♿ Accessibility

AstroDex aims to provide an inclusive experience for all users.

Current accessibility efforts include:

- Keyboard-accessible navigation
- Screen-reader friendly interface improvements
- Semantic HTML usage
- Reduced-motion support for animation-sensitive users
- Improved focus visibility for interactive controls

Accessibility enhancements are actively being developed and community contributions are welcome. 

## 🛠️ Troubleshooting

### WebGL Not Supported

AstroDex relies on WebGL for 3D rendering.

Check browser compatibility:

- Google Chrome
- Microsoft Edge
- Brave Browser
- Firefox (latest version)

### Poor Performance

If frame rates are low:

- Enable hardware acceleration
- Close GPU-intensive applications
- Update graphics drivers
- Reduce browser tab usage

### Dependency Installation Errors

Try clearing dependencies and reinstalling:

```bash
rm -rf node_modules
rm package-lock.json
npm install


---

### 🚀 Roadmap

```md
## 🚀 Roadmap

Planned future enhancements include:

- Supabase integration for persistent data storage
- Expanded satellite catalog support
- Real-world orbital datasets
- Advanced collision prediction algorithms
- Historical orbit replay system
- Enhanced accessibility improvements
- Mobile-friendly mission control interface


## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/RishiByte/astrodex.git
cd astrodex
# 1. Fork the repository on GitHub, then clone your fork
git clone https://github.com/<your-username>/Astrodex.git
cd Astrodex

# 2. Add the upstream remote (to stay in sync)
git remote add upstream https://github.com/Omnikon-Org/Astrodex.git

# 3. Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server with hot-reload
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser. Changes are reflected instantly via hot-reload.

> [!NOTE]
> The 3D scene may take a few seconds to initialize on first load while WebGL compiles the GLSL shaders and generates procedural textures.

---

## 🏗️ Build & Deployment

### Production Build

```bash
# Compile TypeScript and build the optimized production bundle
npm run build

# Start the production server locally
npm run start
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
npm run lint          # ✅ No new lint errors
npx tsc --noEmit      # ✅ No type errors
npm run build         # ✅ Build completes successfully
```

> [!IMPORTANT]
> All three checks must pass with **zero new errors** before submitting a PR. Existing lint warnings in `src/components/earth/CloudLayer.tsx` and `src/components/earth/Earth.tsx` are known issues related to React compiler/ref lint rules and are not blockers.

---

## 📂 Project Structure

```text
Astrodex/
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── globals.css         # Mission Control theme tokens, glassmorphism, animations
│   │   ├── layout.tsx          # Font loading (Geist & JetBrains Mono), SEO metadata
│   │   └── page.tsx            # HUD overlay layout assembly
│   ├── components/
│   │   ├── earth/
│   │   │   ├── Earth.tsx       # Earth day/night custom GLSL shader
│   │   │   ├── CloudLayer.tsx  # Procedural cloud layer
│   │   │   ├── Atmosphere.tsx  # Atmosphere scattering shader glow
│   │   │   └── textures.ts     # Canvas 2D texture generators (zero external assets)
│   │   ├── AsteroidField.tsx   # Dual InstancedMesh (Asteroids & Space Debris) — Keplerian
│   │   ├── SatelliteSystem.tsx # ISS/Envisat/Hubble + LEO decay
│   │   ├── CameraController.tsx # Tracking camera controller
│   │   ├── Effects.tsx         # Post-processing composer (Bloom, Vignette)
│   │   ├── Scene.tsx           # Orchestrator canvas
│   │   ├── Header.tsx          # Simulation top navigation bar
│   │   ├── LeftSidebar.tsx     # Target tracking, load by ID, conjunction feed
│   │   ├── RightSidebar.tsx    # Orbital constraints + manual satellite + LEO decay monitor
│   │   ├── AgentTerminal.tsx   # Expandable log dock (auto-scrolls, color-coded)
│   │   └── AsteroidCard.tsx    # Inspector overlay panel
│   └── lib/
│       ├── kepler.ts           # Newton-Raphson solver, Vis-Viva, mean motion, decay
│       ├── store.tsx           # React state manager (filters, simulation, orbits, alerts)
│       └── types.ts            # TypeScript definitions
├── ARCHITECTURE.md             # Detailed rendering pipeline & component tree docs
├── CONTRIBUTING.md             # Contribution workflow, code style, and PR process
├── CODE_OF_CONDUCT.md          # Community guidelines
├── CHANGELOG.md                # Version history
├── LICENSE                     # MIT License
├── next.config.ts              # Next.js configuration
├── eslint.config.mjs           # ESLint configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

---

## 🤝 Contributing

AstroDex is a **GSSoC 2026** (GirlScript Summer of Code) project and welcomes first-time open-source contributors. For the full process and guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md). In short: comment on an issue to claim it, open a focused branch for your work, and submit a PR with a clear description and testing steps.

- New to open source? Check [GOOD_FIRST_ISSUES.md](./GOOD_FIRST_ISSUES.md) for beginner-friendly tasks.
- Comment on the issue expressing interest so maintainers can assign it.
- Create a focused branch with a descriptive name (e.g., `feat/…`, `fix/…`, `docs/…`).
- Keep PRs small and include steps to reproduce or test.
- Have a question or idea? Use [GitHub Discussions](https://github.com/Omnikon-Org/Astrodex/discussions) rather than opening an issue.
- Found a security issue? See [SECURITY.md](./SECURITY.md) for responsible disclosure — please don't file it as a public issue.

### Coding Style / Linting / Formatting

AstroDex uses TypeScript (strict mode), ESLint, and Tailwind. Follow the conventions in [CONTRIBUTING.md#code-style](./CONTRIBUTING.md#code-style) (use `@/` path alias, add `"use client"` for client components, avoid `any`, remove unused imports). Run these commands before opening a PR:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

---

## Architecture & Code conventions

- **3D Components**: All 3D components are strictly `"use client"` and rendered dynamically via `next/dynamic({ ssr: false })` to avoid SSR mismatches with WebGL.
- **Shader Code**: GLSL code for the planet and atmosphere is embedded directly in component files via template literals to maximize portability.
- **Performance**: The 600+ asteroids use `<InstancedMesh>` for a single draw call. Individual `THREE.Vector3` or `Color` objects are reused outside of the render loop to prevent garbage collection pressure.
- **Orbital Mechanics**: All Keplerian calculations live in `src/lib/kepler.ts`.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT License
Made with ❤️ by the [AstroDex contributors](https://github.com/Omnikon-Org/Astrodex/graphs/contributors)
