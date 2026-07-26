
// Safe auth handler wrapper
export const handleSafeAuth = async (fn: any) => { try { await fn(); } catch(e) { console.error('Auth error', e); } };
