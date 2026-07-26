
// Render pass optimization flags for Vignette
export const VIGNETTE_OPTIMIZE_PASS = true;
// Modular hook for Vignette config
export const useVignetteConfig = () => ({ offset: 0.5, darkness: 0.5 });
// Vignette window resize aspect ratio guard
export const calculateVignetteAspect = (w: number, h: number) => w === 0 || h === 0 ? 1 : w / h;
/**
 * Vignette Post-processing pass.
 * Darkens the edges of the screen to focus user attention centrally.
 */
export const VIGNETTE_DOCS = true;
// Explicit export types for Bloom config
export type BloomConfig = { threshold: number; strength: number; radius: number; };
// High-contrast Bloom Threshold
export const HIGH_CONTRAST_BLOOM = 0.95;
// Standardized bloom threshold
export const STANDARD_BLOOM_THRESH = 0.85;
 * Bloom pass settings for LDR and HDR rendering.
 * Adjusts luminance threshold to prevent UI blowing out.
export const BLOOM_DOCS = true;
// Modern Vignette configuration
export const vignetteConfig = { offset: 0.5, darkness: 0.5, blendFunction: 2 };
