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

interface HeaderProps {
  hudVisible: boolean
  onToggleHud: () => void
}

export function Header({ hudVisible, onToggleHud }: HeaderProps) {
  const { simulationRunning, toggleSimulation, riskLevel, triggerReset, selectedAsteroid, cinematicMode, toggleCinematicMode } = useAppState()

  return (
    <header
      className="glass-panel-flat"
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
        padding: "0 var(--header-x-padding)",
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
      </div>

      {/* Center: Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button className="btn-primary" onClick={toggleSimulation}>
          <svg
            role="img"
            aria-label={simulationRunning ? "Pause icon" : "Play icon"}
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
            {simulationRunning ? "LIVE" : "PAUSED"}
          </span>
        </div>

        {selectedAsteroid && (
          <button className="btn-ghost" onClick={triggerReset}>
            <svg role="img" aria-label="Back icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Earth
          </button>
        )}

        <button className="btn-ghost" onClick={toggleCinematicMode} aria-pressed={cinematicMode}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h16M4 17h16M7 4v16M17 4v16" />
          </svg>
          {cinematicMode ? "Exit Cinema" : "Cinema"}
        </button>

        <button className="btn-ghost" onClick={onToggleHud} aria-pressed={!hudVisible}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {hudVisible ? (
              <>
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6" />
                <path d="M9.9 4.2A10.6 10.6 0 0 1 12 4c5 0 9 5 9 8a8.7 8.7 0 0 1-2.1 3.9" />
                <path d="M6.1 6.1C4.2 7.4 3 9.6 3 12c0 3 4 8 9 8 1.4 0 2.7-.4 3.9-1" />
              </>
            ) : (
              <>
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
          HUD
        </button>
      </div>

      {/* Right: Clock */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
          Last updated:
        </span>
        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
          <LiveClock />
        </span>
      </div>
    </header>
  )
}
