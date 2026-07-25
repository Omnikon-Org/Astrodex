
// Orbit visualizer optimization: LOD resolution
export const getOrbitResolution = (distance: number) => distance > 100 ? 32 : 128;
