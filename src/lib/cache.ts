
// TTL Invalidations for local storage
export const invalidateCache = (key: string) => localStorage.removeItem(key);
