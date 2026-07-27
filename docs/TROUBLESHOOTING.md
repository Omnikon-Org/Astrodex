# WebGL Troubleshooting Guide

## Context Loss
If WebGL context is lost, the canvas will go blank. This can happen if the GPU is overloaded or the browser tab is sent to the background. 
**Solution:** Astrodex uses `@react-three/fiber` which automatically handles context restoration in most cases. If you encounter persistent issues, check your GPU drivers.

## Performance Issues
1. **Low FPS:** The asteroid field rendering uses `InstancedMesh`. Ensure your GPU supports hardware instancing.
2. **Stuttering:** Avoid memory leaks by reusing `THREE.Vector3` objects inside `useFrame`.
