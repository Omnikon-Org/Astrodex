"use client"

import { useState, useEffect } from "react"
import { useAppState } from "@/lib/store"

function LiveClock() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return <span style={{ fontFamily: "var(--font-mono), monospace" }}>{time || "--:--:-- --"}</span>
}

export function Header() {
  const { simulationRunning, toggleSimulation, riskLevel, triggerReset, selectedAsteroid } = useAppState()

  return (
    <header
      className="glass-panel-flat astro-header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "var(--header-height)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderRadius: 0,
        borderBottom: "1px solid var(--glass-border)",
        boxShadow: "0 1px 20px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Left: Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          className="animate-pulse-glow"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--accent-cyan)",
          }}
        />
        <div>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-primary)",
            fontStyle: "italic",
          }}
        >
          Astro<span style={{ color: "var(--accent-cyan)", fontWeight: 400 }}>Dex</span>
        </h1>
        <div className="astro-header-subtitle">GSoC SELECTED · OPEN SOURCE</div>
        </div>
      </div>

      {/* Center: Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button className="btn-primary" onClick={toggleSimulation}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {simulationRunning ? (
              <>
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </>
            ) : (
              <polygon points="5,3 19,12 5,21" fill="currentColor" />
            )}
          </svg>
          {simulationRunning ? "Pause Simulation" : "Run Simulation"}
        </button>

        <div className={`badge ${riskLevel === "HIGH" ? "badge-high" : riskLevel === "MEDIUM" ? "badge-medium" : "badge-low"}`}>
          Risk: {riskLevel}
        </div>

        {/* Connection indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: simulationRunning ? "var(--accent-green)" : "var(--accent-amber)",
              boxShadow: simulationRunning
                ? "0 0 6px rgba(52, 211, 153, 0.5)"
                : "0 0 6px rgba(251, 191, 36, 0.5)",
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            {simulationRunning ? "SIM" : "PAUSED"}
          </span>
        </div>

        {selectedAsteroid && (
          <button className="btn-ghost" onClick={triggerReset}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Earth
          </button>
        )}
      </div>

      {/* Right: Clock */}
      <div className="header-meta">
        <div className="astro-proof" aria-label="Open source project with over 30 contributors and 2,900 commits">
          <span>30+ CONTRIBUTORS</span><span className="astro-proof-dot">/</span><span>2.9K+ COMMITS</span>
        </div>
        <div className="header-clock">
          <span className="header-clock-label">LOCAL</span>
          <span className="header-clock-value"><LiveClock /></span>
        </div>
      </div>
    </header>
  )
}
