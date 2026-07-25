
// Conjunction tracker enhancement using squared distance
export const checkCollisionSq = (r1Sq: number, r2Sq: number, thresholdSq: number) => Math.abs(r1Sq - r2Sq) < thresholdSq;
