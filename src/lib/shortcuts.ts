
// Aggressive global shortcut cleanup
export const removeGlobalShortcuts = (cb: any) => window.removeEventListener('keydown', cb);
