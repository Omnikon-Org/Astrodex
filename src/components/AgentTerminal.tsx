"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useAppState } from "@/lib/store"

type LogEntry = {
  time: string
  msg: string
}

const INITIAL_LOGS = [
  "[SYS] AstroDex orbital explorer initialized",
  "[ORBIT] Keplerian propagation active for the 600-object catalog",
  "[TRACK] ISS, Envisat, and Hubble trajectories loaded",
]

function getTimestamp() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

function createInitialLogs() {
  return [
    ...INITIAL_LOGS.map((msg) => ({ time: getTimestamp(), msg })),
  ]
}

export function AgentTerminal() {
  const { terminalExpanded, toggleTerminal, boostCount, deltaVCount, simulationRunning, selectedAsteroid, conjunctions } = useAppState()
  const [logs, setLogs] = useState<LogEntry[]>(createInitialLogs)
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastBoostSeen = useRef(boostCount)
  const lastDvSeen = useRef(deltaVCount)
  const lastSimulationState = useRef(simulationRunning)
  const lastSelectedId = useRef<number | null>(selectedAsteroid?.id ?? null)
  const lastConjunctionId = useRef<number | null>(conjunctions[0]?.id ?? null)

  const appendLog = useCallback((msg: string) => {
    setLogs((prev) => {
      const next = [...prev, { time: getTimestamp(), msg }]
      if (next.length > 50) next.splice(0, next.length - 50)
      return next
    })
  }, [])

  // Append a log line whenever a boost burn fires
  useEffect(() => {
    if (boostCount !== lastBoostSeen.current) {
      lastBoostSeen.current = boostCount
      appendLog("[MANV] +50 km ISS boost burn executed")
    }
  }, [boostCount, appendLog])

  // Append a log line whenever Δv budget is computed
  useEffect(() => {
    if (deltaVCount !== lastDvSeen.current) {
      lastDvSeen.current = deltaVCount
      appendLog("[MANV] Hohmann transfer budget calculated")
    }
  }, [deltaVCount, appendLog])

  useEffect(() => {
    if (lastSimulationState.current !== simulationRunning) {
      lastSimulationState.current = simulationRunning
      appendLog(simulationRunning ? "[SYS] Orbital propagation resumed" : "[SYS] Orbital propagation paused")
    }
  }, [simulationRunning, appendLog])

  useEffect(() => {
    const selectedId = selectedAsteroid?.id ?? null
    if (selectedId !== lastSelectedId.current) {
      lastSelectedId.current = selectedId
      appendLog(selectedAsteroid ? `[TRK] Target selected — ${selectedAsteroid.name}` : "[TRK] Target selection cleared")
    }
  }, [selectedAsteroid, appendLog])

  useEffect(() => {
    const newest = conjunctions[0]
    if (newest && newest.id !== lastConjunctionId.current) {
      lastConjunctionId.current = newest.id
      appendLog(`[APPR] ${newest.risk} close approach — ${newest.satelliteName} / ${newest.secondaryName}, ${newest.missKm} km miss`)
    }
  }, [conjunctions, appendLog])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current && terminalExpanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, terminalExpanded])

  return (
    <div
      className="glass-panel-flat"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: terminalExpanded ? "var(--terminal-expanded)" : "var(--terminal-collapsed)",
        zIndex: 40,
        borderBottom: "none",
        borderLeft: "none",
        borderRight: "none",
        borderRadius: 0,
        borderTop: "1px solid var(--glass-border)",
        transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Toggle bar */}
      <button
        onClick={toggleTerminal}
        aria-controls="agent-terminal-log"
        aria-expanded={terminalExpanded}
            aria-label={terminalExpanded ? "Collapse mission log" : "Expand mission log"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          height: "var(--terminal-collapsed)",
          flexShrink: 0,
          background: "none",
          border: "none",
          borderBottom: terminalExpanded ? "1px solid var(--border-subtle)" : "none",
          cursor: "pointer",
          color: "var(--text-secondary)",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Mission Log
          </span>
          {!terminalExpanded && logs.length > 0 && (
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono), monospace" }}>
              — {logs[logs.length - 1].msg.substring(0, 60)}...
            </span>
          )}
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "transform 0.3s ease",
            transform: terminalExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      {/* Terminal content */}
      {terminalExpanded && (
        <div
          id="agent-terminal-log"
          ref={scrollRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          aria-label="Mission event log"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 20px",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            lineHeight: 1.7,
          }}
        >
          {logs.map((log, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                opacity: i === logs.length - 1 ? 1 : 0.7,
              }}
            >
              <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{log.time}</span>
              <span
                style={{
                  color: log.msg.includes("HIGH")
                    ? "var(--accent-red)"
                    : log.msg.startsWith("[APPR]")
                    ? "var(--accent-amber)"
                    : log.msg.startsWith("[MANV]")
                    ? "var(--accent-green)"
                    : log.msg.startsWith("[TRK]")
                    ? "var(--accent-cyan)"
                    : "var(--text-secondary)",
                }}
              >
                {log.msg}
              </span>
            </div>
          ))}
          {/* Blinking cursor */}
          <span className="animate-terminal-blink" style={{ color: "var(--accent-cyan)" }}>
            ▋
          </span>
        </div>
      )}
    </div>
  )
}
