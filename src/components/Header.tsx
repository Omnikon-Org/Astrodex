"use client"

import { useState, useEffect } from "react"
import { useAppState } from "@/lib/store"
import { ProfileModal } from "./ProfileModal"

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
  const { 
    simulationRunning, 
    toggleSimulation, 
    selectedAsteroid, 
    triggerReset, 
    riskLevel,
    user,
    loginWithGithub,
    loginWithGoogle,
    logout
  } = useAppState()
  
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <>
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

      {/* Right: Clock & Auth */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-r border-white/10 pr-4">
          <span className="text-[10px] text-white/40 tracking-[0.04em]">
            Last updated:
          </span>
          <span className="text-[13px] text-white/60 font-medium">
            <LiveClock />
          </span>
        </div>
        
        {/* Auth Section */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setProfileOpen(true)}
                className="flex items-center gap-2 bg-transparent border-none cursor-pointer hover:bg-white/5 px-2 py-1 rounded-lg transition-colors"
                title="View Profile"
              >
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-6 h-6 rounded-full border border-white/10" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-white/60">
                    {user.email?.[0].toUpperCase() || "?"}
                  </div>
                )}
                <span className="text-xs text-white/80 font-medium hidden sm:block">
                  {user.user_metadata?.user_name || user.email?.split("@")[0]}
                </span>
              </button>
              <button 
                onClick={logout}
                className="text-[10px] uppercase tracking-wider text-white/40 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={loginWithGithub}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-white/70 text-[11px] font-medium cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:text-white/90"
              >
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                GitHub
              </button>
              <button
                onClick={loginWithGoogle}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-white/70 text-[11px] font-medium cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:text-white/90"
              >
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v8"></path>
                  <path d="M8 12h8"></path>
                </svg>
                Google
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  )
}
