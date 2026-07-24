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
  const { simulationRunning, toggleSimulation, riskLevel, triggerReset, selectedAsteroid, searchAsteroid } = useAppState()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      searchAsteroid(searchQuery.trim())
      setSearchQuery("")
    }
  }

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

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="text"
            className="mc-input"
            style={{ width: "180px", padding: "4px 8px" }}
            placeholder="Search Asteroid ID/Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn-ghost" style={{ padding: "4px 8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

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
          <button className="btn-primary flex items-center gap-1" onClick={triggerReset}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Return to Earth
          </button>
        )}
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
