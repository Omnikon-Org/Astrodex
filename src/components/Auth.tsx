
// Standardized generic auth props
export type StandardAuthProps = { redirectUrl: string; onComplete?: () => void };
// Safe auth handler wrapper
export const handleSafeAuth = async (fn: any) => { try { await fn(); } catch(e) { console.error('Auth error', e); } };
