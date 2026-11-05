<<<<<<< HEAD

<!-- Fixed #1122: Created troubleshooting guide for WebGL context loss -->
# Troubleshooting Astrodex
Welcome to the Astrodex troubleshooting guide! Below you'll find solutions for common issues encountered during development with Next.js, React Three Fiber, and WebGL.
## 1. WebGL & React Three Fiber Issues
### `window is not defined`
**Problem:** Next.js uses Server-Side Rendering (SSR) by default. Three.js and React Three Fiber require browser APIs (`window`, `document`) that do not exist on the server.
**Solution:** Ensure all 3D components are imported dynamically with SSR disabled.
```tsx
import dynamic from 'next/dynamic'
const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false
})
```
### Canvas Context Lost
**Problem:** The browser forcefully dropped the WebGL context to free up memory (common when hot-reloading frequently or keeping many tabs open).
**Solution:**
- Refresh the page to restore the context.
- To prevent memory leaks during development, avoid instantiating `new THREE.Vector3()` or `new THREE.Color()` inside the `useFrame` loop. Reuse module-level variables instead.
### Black Screen / Nothing Rendering
**Problem:** A shader failed to compile, or camera frustum doesn't encompass the scene objects.
- Open the browser developer console (F12) to check for GLSL shader compilation errors.
- Ensure the scene has adequate lighting (e.g., `<ambientLight />` or `<directionalLight />`).
## 2. Next.js & Turbopack Issues
### Fast Refresh not working for Three.js objects
**Problem:** When updating materials or geometry, the canvas doesn't reflect the changes until a hard refresh.
**Solution:** This is a known limitation of HMR with WebGL state. Add a unique `key` to your meshes or materials during development if you want them to unmount and remount on change, though a manual refresh is often safest.
### Turbopack Build Errors
**Problem:** You see errors mentioning `unsupported Next.js configuration`.
**Solution:** Turbopack is the default in Next.js 15+, but some older PostCSS/Webpack plugins may not be compatible. If you are stuck, you can try falling back to the Webpack bundler by modifying your dev script in `package.json` to omit the `--turbo` flag, though we aim to support Turbopack fully.
## 3. Data & Supabase Issues
### RLS Policy Errors (403 Forbidden)
**Problem:** Claiming an asteroid fails with a permissions error.
**Solution:** Ensure you are properly authenticated. If developing locally, ensure you have applied the Supabase migrations and that your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correctly set in `.env.local`.
---
*If you encounter an issue not listed here, please open a new issue using our Bug Report template!*
=======
# WebGL Troubleshooting Guide

## Context Loss
If WebGL context is lost, the canvas will go blank. This can happen if the GPU is overloaded or the browser tab is sent to the background. 
**Solution:** Astrodex uses `@react-three/fiber` which automatically handles context restoration in most cases. If you encounter persistent issues, check your GPU drivers.

## Performance Issues
1. **Low FPS:** The asteroid field rendering uses `InstancedMesh`. Ensure your GPU supports hardware instancing.
2. **Stuttering:** Avoid memory leaks by reusing `THREE.Vector3` objects inside `useFrame`.
>>>>>>> fix/issue-1678
