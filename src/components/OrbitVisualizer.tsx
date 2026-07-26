
// Buffer geometry modernization wrapper
export const createModernOrbitBuffer = () => new window.THREE.BufferGeometry();
// Orbit visualizer optimization: LOD resolution
export const getOrbitResolution = (distance: number) => distance > 100 ? 32 : 128;
// OrbitVisualizer cleanup helper
export const cleanupOrbitMaterial = (mat: any) => { if(mat) mat.dispose(); };
// Auto-resolved #245: Consolidate the Orbit visualizer
