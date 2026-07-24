"use client"

import { useAppState } from "@/lib/store"

export function MobileNavbar() {
  const { toggleLeftSidebar, toggleRightSidebar, toggleTerminal } = useAppState()

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel-flat"
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: "60px",
        borderTop: "1px solid var(--border-glow)",
        background: "var(--bg-panel-solid)"
      }}
    >
      <button onClick={toggleLeftSidebar} className="btn-ghost" style={{ flex: 1 }}>Menu</button>
      <button onClick={toggleTerminal} className="btn-ghost" style={{ flex: 1, color: "var(--accent-cyan)" }}>Term</button>
      <button onClick={toggleRightSidebar} className="btn-ghost" style={{ flex: 1 }}>Params</button>
    </div>
  )
}
