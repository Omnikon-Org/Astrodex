"use client"

import { useState, useMemo } from "react"
import { useAppState, LEO_LIMITS } from "@/lib/store"
import { visVivaKmPerSec, calculateLEODecayRate, hohmannDeltaVKmPerSec, KM_PER_UNIT_CONST } from "@/lib/kepler"

export function RightSidebar() {
  const {
    rightSidebarOpen,
    toggleRightSidebar,
    toggleSimulation,
    simulationRunning,
    timeScaleMultiplier,
    setTimeScaleMultiplier,
    triggerReset,
    satAltitude,
    satInclination,
    satRaan,
    satEccentricity,
    updateSatelliteParams,
    updateSatelliteEccentricity,
    boostBurn,
    selectedAsteroid,
    triggerDeltaVLog,
  } = useAppState()

  const [maxDv, setMaxDv] = useState("0.35")
  const [maxBurns, setMaxBurns] = useState("1")
  const [maneuverAxis, setManeuverAxis] = useState("24")
  const [altitude, setAltitude] = useState(() => String(satAltitude))
  const [inclination, setInclination] = useState(() => String(satInclination))
  const [raan, setRaan] = useState(() => String(satRaan))
  const [eccentricity, setEccentricity] = useState(() => satEccentricity.toFixed(4))
  const [statusText, setStatusText] = useState("No pending changes.")
  const [satStatusText, setSatStatusText] = useState("Telemetry synchronized.")
  const [boostStatus, setBoostStatus] = useState("")

  const handleApply = () => {
    const maxDvVal = parseFloat(maxDv) || 0.35
    const maxBurnsVal = parseInt(maxBurns, 10) || 1

    const R_EARTH_KM = 6378
    const r1Km = R_EARTH_KM + satAltitude

    let dVTotal = 0
    let targetName = "no target"

    if (selectedAsteroid) {
      targetName = selectedAsteroid.name
      const r2Km = selectedAsteroid.orbitRadius * KM_PER_UNIT_CONST
      dVTotal = hohmannDeltaVKmPerSec(r1Km, r2Km)
    }

    const dVms = dVTotal * 1000
    const exceeds = dVms > maxDvVal
    const icon = exceeds ? "⚠" : "✓"

    setStatusText(
      `${icon} Hohmann Δv: ${dVms.toFixed(1)} m/s → ${targetName} ` +
        (exceeds ? `WARNING: exceeds max ${maxDvVal} m/s!` : `within ${maxDvVal} m/s budget (${maxBurnsVal} burns)`)
    )

    // Log to console for debugging
    console.log(`[MANV] Hohmann transfer to ${targetName}: Δv=${dVms.toFixed(2)} m/s, max=${maxDvVal} m/s, burns=${maxBurnsVal}`)
    triggerDeltaVLog()

    setTimeout(() => setStatusText("No pending changes."), 5000)
  }

  // Theoretical LEO orbital speed via Vis-Viva (a = R⊕ + h)
  // Displayed in real km/s (independent of scene time scale)
  const R_EARTH_KM = 6378
  const displaySpeedKmS = visVivaKmPerSec(R_EARTH_KM + satAltitude, R_EARTH_KM + satAltitude)

  const handleApplySatellite = () => {
    const altVal = parseFloat(altitude) || 400
    const incVal = parseFloat(inclination) || 0
    const raanVal = parseFloat(raan) || 0
    const eVal = parseFloat(eccentricity) || 0

    updateSatelliteParams(altVal, incVal, raanVal)
    updateSatelliteEccentricity(eVal)

    setSatStatusText(
      "ISS Trajectory Uploaded: " +
        new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
    )
    setTimeout(() => setSatStatusText("Telemetry synchronized."), 3000)
  }

  const handleBoost = () => {
    const burnKm = 50
    boostBurn(burnKm)
    setBoostStatus(`Boost burn executed: +${burnKm} km @ ${displaySpeedKmS.toFixed(0)} m/s Δv`)
    setTimeout(() => setBoostStatus(""), 3000)
  }

  // ── LEO health bar: green above 300 km, amber 200-300 km, red below ──
  const altFraction = (satAltitude - LEO_LIMITS.FLOOR) / (LEO_LIMITS.CEILING - LEO_LIMITS.FLOOR)
  // Add some fake variance for the display
  const thrustVariation = (Math.sin(Date.now() / 1000) * 0.1).toFixed(2)
  const decayRate = (calculateLEODecayRate(satAltitude) * 60).toFixed(2) // km/min
  const altitudeHealth: "ok" | "warn" | "crit" =
    satAltitude > 300 ? "ok" : satAltitude > 220 ? "warn" : "crit"

  return (
    <>
      {/* Toggle button when collapsed */}
      {!rightSidebarOpen && (
        <button
          className="sidebar-toggle sidebar-toggle-right"
          onClick={toggleRightSidebar}
          title="Show Constraints Panel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <aside className={`sidebar-right glass-panel ${rightSidebarOpen ? "" : "collapsed"}`}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px 10px",
              borderBottom: "1px solid var(--border-subtle)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button className="btn-ghost" onClick={toggleRightSidebar} style={{ padding: 4, border: "none" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-primary)" }}>
                Constraints
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </div>
          </div>

          {/* Scrollable content */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Time Controls */}
            <div className="panel-section">
              <div className="panel-section-title">Time Controls</div>
              <div className="flex gap-2">
                <button
                  onClick={toggleSimulation}
                  className="flex-1 py-1 px-3 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded border border-slate-700 transition-colors shadow shadow-black/50"
                >
                  {simulationRunning ? "PAUSE SIMULATION" : "RESUME SIMULATION"}
                </button>
                <button
                  onClick={triggerReset}
                  className="py-1 px-3 bg-red-900/50 hover:bg-red-800/80 text-xs text-red-200 rounded border border-red-900 transition-colors shadow shadow-black/50"
                >
                  RESET
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Time Scale</div>
                <div className="flex gap-1 bg-slate-900 rounded p-1 border border-slate-800">
                  {[1, 2, 5, 10].map((m) => (
                    <button
                      key={m}
                      onClick={() => setTimeScaleMultiplier(m)}
                      className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                        timeScaleMultiplier === m ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {m}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Planner Constraints */}
            <div className="panel-section">
              <div className="panel-section-title">Planner Constraints</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                    Max total Δv (m/s)
                  </label>
                  <input className="mc-input" type="text" value={maxDv} onChange={(e) => setMaxDv(e.target.value)} />
                </div>

                <div>
                  <label style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                    Max burns
                  </label>
                  <input className="mc-input" type="text" value={maxBurns} onChange={(e) => setMaxBurns(e.target.value)} />
                </div>

                <div>
                  <label style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                    Preferred maneuver axis
                  </label>
                  <input className="mc-input" type="text" value={maneuverAxis} onChange={(e) => setManeuverAxis(e.target.value)} />
                </div>

                <button className="btn-primary" onClick={handleApply} style={{ width: "100%", marginTop: 2 }}>
                  Apply
                </button>

                <p style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center" }}>
                  {statusText}
                </p>
              </div>
            </div>

            {/* Manual Satellite (3D Orbit) */}
            <div
              className="panel-section"
              style={{
                border: "1px solid rgba(56, 189, 248, 0.15)",
                background: "rgba(56, 189, 248, 0.03)",
              }}
            >
              <div className="panel-section-title" style={{ color: "var(--accent-cyan)" }}>
                Manual Satellite (3D Orbit)
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                    Altitude (km)
                  </label>
                  <input className="mc-input" type="text" value={altitude} onChange={(e) => setAltitude(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                    Speed (km/s)
                  </label>
                  <input
                    className="mc-input"
                    type="text"
                    value={displaySpeedKmS.toFixed(2)}
                    disabled
                    style={{ opacity: 0.6, cursor: "not-allowed" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                    Inclination (°)
                  </label>
                  <input className="mc-input" type="text" value={inclination} onChange={(e) => setInclination(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                    RAAN (°)
                  </label>
                  <input className="mc-input" type="text" value={raan} onChange={(e) => setRaan(e.target.value)} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                    Eccentricity (0–0.9)
                  </label>
                  <input className="mc-input" type="text" value={eccentricity} onChange={(e) => setEccentricity(e.target.value)} />
                </div>

                <button className="btn-primary" onClick={handleApplySatellite} style={{ gridColumn: "span 2", marginTop: 4 }}>
                  Apply Trajectory
                </button>
              </div>

              <p style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", marginTop: 6 }}>
                {satStatusText}
              </p>

              <p style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.4 }}>
                Inclination: 0°=equatorial, 90°=polar • RAAN: orbit orientation in 360° • Speed via Vis-Viva.
              </p>
            </div>

            {/* ─── LEO Orbital Decay Monitor ─── */}
            <div
              className="panel-section"
              style={{
                border:
                  altitudeHealth === "crit"
                    ? "1px solid rgba(248, 113, 113, 0.35)"
                    : altitudeHealth === "warn"
                    ? "1px solid rgba(251, 191, 36, 0.35)"
                    : "1px solid var(--border-subtle)",
                background:
                  altitudeHealth === "crit"
                    ? "rgba(248, 113, 113, 0.04)"
                    : altitudeHealth === "warn"
                    ? "rgba(251, 191, 36, 0.04)"
                    : undefined,
              }}
            >
              <div
                className="panel-section-title"
                style={{
                  color:
                    altitudeHealth === "crit"
                      ? "var(--accent-red)"
                      : altitudeHealth === "warn"
                      ? "var(--accent-amber)"
                      : "var(--accent-green)",
                }}
              >
                LEO Decay Monitor
              </div>

              <div className="kv-row">
                <span className="kv-label">Current Altitude</span>
                <span
                  className="kv-value"
                  style={{
                    color:
                      altitudeHealth === "crit"
                        ? "var(--accent-red)"
                        : altitudeHealth === "warn"
                        ? "var(--accent-amber)"
                        : "var(--accent-green)",
                  }}
                >
                  {Math.round(satAltitude)} km
                </span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Drag Rate</span>
                <span className="kv-value">{decayRate} km/min</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Floor</span>
                <span className="kv-value">{LEO_LIMITS.FLOOR} km (re-entry)</span>
              </div>

              {/* Altitude bar */}
              <div
                style={{
                  marginTop: 8,
                  height: 6,
                  background: "var(--bg-input)",
                  borderRadius: 3,
                  border: "1px solid var(--border-subtle)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.max(0, Math.min(1, altFraction)) * 100}%`,
                    height: "100%",
                    background:
                      altitudeHealth === "crit"
                        ? "var(--accent-red)"
                        : altitudeHealth === "warn"
                        ? "var(--accent-amber)"
                        : "var(--accent-green)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

                <button
                  onClick={triggerReset}
                  className="py-1 px-3 bg-indigo-900/50 hover:bg-indigo-800/80 text-xs text-indigo-200 rounded border border-indigo-900 transition-colors shadow shadow-black/50 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                  RETURN TO EARTH
                </button>

              <button
                className="btn-primary"
                onClick={handleBoost}
                disabled={satAltitude >= LEO_LIMITS.CEILING}
                style={{
                  width: "100%",
                  marginTop: 10,
                  opacity: satAltitude >= LEO_LIMITS.CEILING ? 0.4 : 1,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                Boost Burn (+50 km)
              </button>

              <p style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", marginTop: 6, minHeight: 14 }}>
                {boostStatus || "Atmospheric drag continuously degrades altitude."}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
