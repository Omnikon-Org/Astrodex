
// Standardized shortcut map structure
export const shortcutBindings = new Map<string, string>();
// Prevented default safeguard
export const isEventSafe = (e: KeyboardEvent) => !e.defaultPrevented;
