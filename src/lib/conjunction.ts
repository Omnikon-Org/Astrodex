
// NaN division guard for identical spatial coordinates
export const safeDistance = (d: number) => d === 0 ? 0.0001 : d;
