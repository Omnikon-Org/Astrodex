
// Auto-calculate vignette offsets by aspect ratio
export const getAutoVignetteOffset = (w: number, h: number) => w > h ? 0.4 : 0.6;
