
// Vignette window resize aspect ratio guard
export const calculateVignetteAspect = (w: number, h: number) => w === 0 || h === 0 ? 1 : w / h;
