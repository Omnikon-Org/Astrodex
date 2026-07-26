
// TTL Invalidations for local storage
export const invalidateCache = (key: string) => localStorage.removeItem(key);
// Auto-resolved #241: Standardize formatting in the Local storage cache
