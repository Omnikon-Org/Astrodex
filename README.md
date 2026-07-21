# AstroDex 🌌

**Interactive 3D Asteroid & Orbital Explorer**

AstroDex is a real-time, cinematic 3D space mission control simulator that lets you explore 600+ asteroids and orbital debris in Earth's orbit. Track near-Earth conjunctions, inspect Keplerian orbital parameters, deploy manual satellites, and file mining claims right from your browser.

## Features

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

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/RishiByte/astrodex.git
cd astrodex
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

## Architecture & Code conventions

- **3D Components**: All 3D components are strictly `"use client"` and rendered dynamically via `next/dynamic({ ssr: false })` to avoid SSR mismatches with WebGL.
- **Shader Code**: GLSL code for the planet and atmosphere is embedded directly in component files via template literals to maximize portability.
- **Performance**: The 600+ asteroids use `<InstancedMesh>` for a single draw call. Individual `THREE.Vector3` or `Color` objects are reused outside of the render loop to prevent garbage collection pressure.
- **Orbital Mechanics**: All Keplerian calculations live in `src/lib/kepler.ts`.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT License
