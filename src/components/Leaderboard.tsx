"use client"

import { useState } from "react"
import { useAppState } from "@/lib/store"

export function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false)
  const { claimedAsteroids } = useAppState()

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-ghost"
        style={{ padding: "8px 12px", border: "1px solid rgba(56, 189, 248, 0.4)", borderRadius: "var(--radius-md)" }}
      >
        Leaderboard
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(false)}
        className="btn-ghost"
        style={{ padding: "8px 12px", border: "1px solid rgba(56, 189, 248, 0.4)", borderRadius: "var(--radius-md)" }}
      >
        Leaderboard
      </button>

      <div
        className="glass-panel animate-fade-in"
        style={{
          position: "fixed",
          top: "80px",
          right: "24px",
          width: "320px",
          zIndex: 50,
          background: "rgba(10, 16, 28, 0.95)",
          border: "1px solid rgba(56, 189, 248, 0.3)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8)",
          padding: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>Top Miners</h2>
          <button onClick={() => setIsOpen(false)} className="btn-ghost" style={{ padding: "4px" }}>
            ✕
          </button>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="kv-row" style={{ padding: "8px", background: "rgba(56, 189, 248, 0.1)", borderRadius: "4px" }}>
            <span className="kv-label" style={{ color: "var(--accent-cyan)", fontWeight: "bold" }}>1. You</span>
            <span className="kv-value">{claimedAsteroids.size} Claims</span>
          </div>
          <div className="kv-row" style={{ padding: "8px" }}>
            <span className="kv-label">2. AstroMiner99</span>
            <span className="kv-value">42 Claims</span>
          </div>
          <div className="kv-row" style={{ padding: "8px" }}>
            <span className="kv-label">3. DeepSpaceCorp</span>
            <span className="kv-value">38 Claims</span>
          </div>
          <div className="kv-row" style={{ padding: "8px" }}>
            <span className="kv-label">4. Belter1</span>
            <span className="kv-value">15 Claims</span>
          </div>
        </div>
      </div>
    </>
  )
}
