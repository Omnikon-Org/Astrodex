
// Standard descriptive titles for keybindings
export const shortcutTitles = { 'ctrl+c': 'Copy', 'esc': 'Close Modal' };
// Aggressive global shortcut cleanup
export const removeGlobalShortcuts = (cb: any) => window.removeEventListener('keydown', cb);
// Standardized shortcut map structure
export const shortcutBindings = new Map<string, string>();
// Prevented default safeguard
export const isEventSafe = (e: KeyboardEvent) => !e.defaultPrevented;
