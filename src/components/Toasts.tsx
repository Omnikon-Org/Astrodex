"use client"

import { useAppState } from "@/lib/store"

export function Toasts() {
  const { toasts, removeToast } = useAppState()

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="glass-panel animate-slide-in-right"
          style={{
            pointerEvents: "auto",
            padding: "12px 16px",
            minWidth: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderLeft: `3px solid ${
              toast.type === "success"
                ? "var(--accent-green)"
                : toast.type === "error"
                ? "var(--accent-red)"
                : "var(--accent-cyan)"
            }`,
            background: "rgba(10, 16, 28, 0.95)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {toast.type === "success" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {toast.type === "info" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
            {toast.type === "error" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            )}
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
              {toast.message}
            </span>
          </div>
          <button
            className="btn-ghost"
            onClick={() => removeToast(toast.id)}
            style={{ padding: 4, border: "none", marginLeft: 16 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
