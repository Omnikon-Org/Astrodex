# AstroDex Custom Shaders Guide

AstroDex leverages custom WebGL shaders (written in GLSL) to render a cinematic, realistic Earth. This guide explains how the shaders are structured and integrated within the React Three Fiber ecosystem.

## Why Custom Shaders?
While Three.js provides standard materials (like `MeshStandardMaterial`), creating a realistic atmosphere, dynamic cloud movement, and accurate day/night light scattering requires a level of control only achievable through custom shader programming.

## Shader Integration in Next.js
We define shaders as string literals (template strings) directly inside our `.tsx` files rather than using external `.glsl` files. 

**Why?** Next.js requires additional Webpack configuration to import raw `.glsl` files. By keeping them as inline strings, we maintain zero-config portability and avoid SSR complications, while still taking advantage of modern IDE GLSL syntax highlighting plugins.

```typescript
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
```

## Core Shader Components

### 1. Earth Base Shader
The Earth material uses a combination of procedural noise (for bumps and specular highlights) mixed with color gradients to represent landmasses, oceans, and ice caps. 
- **Vertex Shader**: Passes UV coordinates and calculates the normal vector relative to the camera.
- **Fragment Shader**: Mixes colors based on UVs and applies a simple diffuse lighting model.

### 2. Atmosphere / Glow Shader
To create the volumetric rim light of Earth's atmosphere, we use a custom Fresnel shader.
- **Fresnel Effect**: We calculate the dot product between the surface normal (`vNormal`) and the view vector (camera direction). Edges facing away from the camera get a higher intensity, creating a soft glowing rim.
- **Blending**: The atmosphere mesh is slightly larger than the Earth mesh and uses `AdditiveBlending` (`blending={THREE.AdditiveBlending}`) with `depthWrite={false}` to smoothly overlay the glow without depth-clipping the planet beneath it.

### 3. Cloud Layer
A secondary sphere sits just above the Earth's surface to render clouds.
- **Animation**: A `uTime` uniform is passed to the shader and updated every frame via `useFrame()`. The fragment shader uses this time value to slowly shift the UV coordinates, simulating atmospheric rotation independent of the Earth's rotation.
- **Alpha Mapping**: The clouds use an alpha channel to reveal the Earth below, controlled by procedural simplex noise.

## Performance Tips
- **Uniforms**: When passing uniforms to `shaderMaterial`, always wrap them in a `useMemo` or update their `.value` directly inside `useFrame()`. Do not recreate the uniform object on every render.
- **Precision**: We use `precision mediump float;` as the default in our shaders to balance visual fidelity with performance, especially on mobile GPUs.
