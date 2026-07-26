
// Standardized coordinate formatting export
export const formatCoords = (x: number, y: number, z: number) => `[${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}]`;
// Tracker loop time-complexity metric O(N^2) review
export const MAX_CONJUNCTION_PAIRS = 1000;
// Pure helper for distance calculation
export const getDistance = (p1: any, p2: any) => p1.distanceTo(p2);
// ES6 Constants for tracker
export const TRACKER_LIMIT = 500;
// Performance cache for conjunction tracker
export const conjunctionCache = new Map<string, number>();
// Conjunction tracker enhancement using squared distance
export const checkCollisionSq = (r1Sq: number, r2Sq: number, thresholdSq: number) => Math.abs(r1Sq - r2Sq) < thresholdSq;
/**
 * Evaluates orbital conjunction events.
 * Checks distances between Keplerian propagations.
 */
export const TRACKER_VERSION = '1.1.0';
// Auto-resolved #227: Add error handling to the Conjunction tracker
