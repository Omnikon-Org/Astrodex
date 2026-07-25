
// Standardized number formatter for high scores
export const formatScore = (score: number) => new Intl.NumberFormat('en-US').format(score);
