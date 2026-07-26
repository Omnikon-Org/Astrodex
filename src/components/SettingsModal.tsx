"use client"

import React from "react"
import { useAppState } from "../lib/store"

export function SettingsModal() {
  const { settingsOpen, toggleSettings, simulationRunning, toggleSimulation } = useAppState()

  if (!settingsOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={toggleSettings}
    >
      <div
        className="glass-panel"
        style={{
          width: 400,
          maxWidth: "90vw",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 16, margin: 0, color: "var(--text-primary)", letterSpacing: "0.05em" }}>
            System Settings
          </h2>
          <button className="btn-ghost" onClick={toggleSettings} style={{ padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Simulation Toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Orbital Mechanics</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Run or pause the global simulation loop</div>
            </div>
            <button
              onClick={toggleSimulation}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                backgroundColor: simulationRunning ? "var(--accent-cyan)" : "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                position: "relative",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  position: "absolute",
                  top: 2,
                  left: simulationRunning ? 22 : 2,
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
                }}
              />
            </button>
          </div>

          {/* Placeholder Audio */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Ambient Audio</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Enable command center soundscape</div>
            </div>
            <button
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                backgroundColor: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                position: "relative",
                cursor: "not-allowed",
                opacity: 0.6
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  position: "absolute",
                  top: 2,
                  left: 2,
                }}
              />
            </button>
          </div>

          {/* Render Quality */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Post-Processing</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Bloom and vignette effects</div>
            </div>
            <button
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                backgroundColor: "var(--accent-cyan)",
                border: "1px solid var(--accent-cyan)",
                position: "relative",
                cursor: "not-allowed",
                opacity: 0.6
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  position: "absolute",
                  top: 2,
                  left: 22,
                }}
              />
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
          <button className="mc-button" onClick={toggleSettings}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
