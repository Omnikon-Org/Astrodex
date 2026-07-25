
// Safe toast dispatcher
export const dispatchSafeToast = (event: any) => { try { window.dispatchEvent(event); } catch(e) { console.error(e); } };
