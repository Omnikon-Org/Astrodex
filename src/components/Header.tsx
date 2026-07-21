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
    <header className="fixed top-0 left-0 right-0 h-[var(--header-height)] z-50 flex items-center justify-between px-5 bg-[#0a101ce6] backdrop-blur-[20px] border-b border-white/10 shadow-[0_1px_20px_rgba(0,0,0,0.5)]">
      {/* Left: Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse-glow" />
        <h1 className="text-lg font-bold tracking-[0.14em] uppercase text-white/90 italic">
          Astro<span className="text-sky-400 font-normal">Dex</span>
        </h1>
      </div>

      {/* Center: Controls */}
      <div className="flex items-center gap-3.5">
        <button
          className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-sky-400/15 border border-sky-400/30 rounded-md text-sky-400 text-xs font-semibold tracking-[0.04em] cursor-pointer transition-all duration-200 hover:bg-sky-400/20 hover:border-sky-400/50 hover:shadow-[0_0_12px_rgba(56,189,248,0.15)]"
          onClick={toggleSimulation}
        >
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

        <div
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.08em] uppercase ${
            riskLevel === "HIGH"
              ? "bg-red-400/15 border border-red-400/30 text-red-400"
              : riskLevel === "MEDIUM"
              ? "bg-amber-400/15 border border-amber-400/30 text-amber-400"
              : "bg-emerald-400/15 border border-emerald-400/30 text-emerald-400"
          }`}
        >
          Risk: {riskLevel}
        </div>

        {/* Connection indicator */}
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              simulationRunning ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" : "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]"
            }`}
          />
          <span className="text-[10px] text-white/40 tracking-[0.04em]">
            {simulationRunning ? "LIVE" : "PAUSED"}
          </span>
        </div>

        {selectedAsteroid && (
          <button
            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-transparent border border-white/5 rounded-md text-white/60 text-[11px] font-medium cursor-pointer transition-all duration-200 hover:bg-white/5 hover:border-white/10 hover:text-white/90"
            onClick={triggerReset}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Earth
          </button>
        )}
      </div>

      {/* Right: Clock */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/40 tracking-[0.04em]">
          Last updated:
        </span>
        <span className="text-[13px] text-white/60 font-medium">
          <LiveClock />
        </span>
      </div>
    </header>
  )
}
