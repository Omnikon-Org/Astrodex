"use client"

import { useState } from "react"
import { useAppState, LEO_LIMITS } from "@/lib/store"
import { visVivaKmPerSec, LEO_DECAY_KM_PER_SEC, hohmannDeltaVKmPerSec, KM_PER_UNIT_CONST } from "@/lib/kepler"
import { Tooltip } from "@/components/Tooltip"

export function RightSidebar() {
  const {
    rightSidebarOpen,
    toggleRightSidebar,
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
    const clampedAltitude = Math.min(LEO_LIMITS.CEILING, Math.max(LEO_LIMITS.FLOOR, altVal))
    const normalizedInclination = ((incVal % 360) + 360) % 360
    const normalizedRaan = ((raanVal % 360) + 360) % 360
    const clampedEccentricity = Math.max(0, Math.min(0.9, eVal))

    updateSatelliteParams(altVal, incVal, raanVal)
    updateSatelliteEccentricity(eVal)
    setAltitude(String(clampedAltitude))
    setInclination(String(normalizedInclination))
    setRaan(String(normalizedRaan))
    setEccentricity(clampedEccentricity.toFixed(4))

    setSatStatusText(
      "ISS Trajectory Uploaded: " +
        new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
    )
    setTimeout(() => setSatStatusText("Telemetry synchronized."), 3000)
  }

  const handleBoost = () => {
    const burnKm = 50
    boostBurn(burnKm)
    setBoostStatus(`Boost burn executed: +${burnKm} km @ ${displaySpeedKmS.toFixed(2)} km/s`)
    setTimeout(() => setBoostStatus(""), 3000)
  }

  // ── LEO health bar: green above 300 km, amber 200-300 km, red below ──
  const altFraction = (satAltitude - LEO_LIMITS.FLOOR) / (LEO_LIMITS.CEILING - LEO_LIMITS.FLOOR)
  const decayRate = (LEO_DECAY_KM_PER_SEC * 60).toFixed(2) // km/min
  const altitudeHealth: "ok" | "warn" | "crit" =
    satAltitude > 300 ? "ok" : satAltitude > 220 ? "warn" : "crit"

  return (
    <>
      {/* Toggle button when collapsed */}
      {!rightSidebarOpen && (
        <button
          className="fixed z-45 top-[calc(var(--header-height)+16px)] right-3 w-7 h-7 flex items-center justify-center bg-white/5 backdrop-blur-[12px] border border-white/10 rounded-md text-white/40 cursor-pointer transition-all duration-200 hover:text-white/90 hover:bg-white/5 hover:border-white/10"
          onClick={toggleRightSidebar}
          title="Show Constraints Panel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <aside className={`fixed z-40 top-[calc(var(--header-height)+8px)] right-2 bottom-[calc(var(--terminal-collapsed)+12px)] w-[var(--sidebar-width)] bg-[#0a101ce6] backdrop-blur-[20px] border border-sky-400/10 rounded-xl transition-all duration-300 ease-out ${rightSidebarOpen ? "" : "translate-x-[calc(var(--sidebar-width)+16px)] opacity-0 pointer-events-none"}`}>
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-3 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center justify-center p-1 bg-transparent border-none text-white/60 cursor-pointer transition-all duration-200 hover:text-white/90" onClick={toggleRightSidebar}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              <span className="text-xs font-bold tracking-[0.06em] text-white/90">
                Constraints
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3">
            {/* Planner Constraints */}
            <div className="bg-white/2 border border-white/5 rounded-md p-3">
              <div className="text-[10px] font-bold tracking-widest uppercase text-white/60 mb-2.5">Planner Constraints</div>

              <div className="flex flex-col gap-2.5">
                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.04em] block mb-1">
                    Max total Δv (m/s)
                  </label>
                  <input className="w-full bg-[#080c16e6] border border-white/5 rounded-md text-white/90 font-mono text-[13px] px-2.5 py-2 outline-none transition-all duration-200 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 placeholder-white/35" type="text" value={maxDv} onChange={(e) => setMaxDv(e.target.value)} />
                </div>

                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.04em] block mb-1">
                    Max burns
                  </label>
                  <input className="w-full bg-[#080c16e6] border border-white/5 rounded-md text-white/90 font-mono text-[13px] px-2.5 py-2 outline-none transition-all duration-200 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 placeholder-white/35" type="text" value={maxBurns} onChange={(e) => setMaxBurns(e.target.value)} />
                </div>

                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.04em] block mb-1">
                    Preferred maneuver axis
                  </label>
                  <input className="w-full bg-[#080c16e6] border border-white/5 rounded-md text-white/90 font-mono text-[13px] px-2.5 py-2 outline-none transition-all duration-200 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 placeholder-white/35" type="text" value={maneuverAxis} onChange={(e) => setManeuverAxis(e.target.value)} />
                </div>

                <button className="w-full mt-0.5 inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-sky-400/15 border border-sky-400/30 rounded-md text-sky-400 text-xs font-semibold tracking-[0.04em] cursor-pointer transition-all duration-200 hover:bg-sky-400/20 hover:border-sky-400/50 hover:shadow-[0_0_12px_rgba(56,189,248,0.15)]" onClick={handleApply}>
                  Apply
                </button>

                <p className="text-[10px] text-white/40 text-center">
                  {statusText}
                </p>
              </div>
            </div>

            {/* Manual Satellite (3D Orbit) */}
            <div className="bg-sky-400/5 border border-sky-400/15 rounded-md p-3">
              <div className="text-[10px] font-bold tracking-widest uppercase text-sky-400 mb-2.5">
                Manual Satellite (3D Orbit)
              </h2>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.04em] block mb-1">
                    Altitude (km)
                  </label>
                  <input className="w-full bg-[#080c16e6] border border-white/5 rounded-md text-white/90 font-mono text-[13px] px-2.5 py-2 outline-none transition-all duration-200 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 placeholder-white/35" type="text" value={altitude} onChange={(e) => setAltitude(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.04em] block mb-1">
                    Speed (km/s)
                  </label>
                  <input
                    className="w-full bg-[#080c16e6] border border-white/5 rounded-md text-white/90 font-mono text-[13px] px-2.5 py-2 outline-none transition-all duration-200 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 placeholder-white/35 opacity-60 cursor-not-allowed"
                    type="text"
                    value={displaySpeedKmS.toFixed(2)}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.04em] block mb-1">
                    Inclination (°)
                  </label>
                  <input className="w-full bg-[#080c16e6] border border-white/5 rounded-md text-white/90 font-mono text-[13px] px-2.5 py-2 outline-none transition-all duration-200 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 placeholder-white/35" type="text" value={inclination} onChange={(e) => setInclination(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 tracking-[0.04em] block mb-1">
                    RAAN (°)
                  </label>
                  <input className="w-full bg-[#080c16e6] border border-white/5 rounded-md text-white/90 font-mono text-[13px] px-2.5 py-2 outline-none transition-all duration-200 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 placeholder-white/35" type="text" value={raan} onChange={(e) => setRaan(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-white/40 tracking-[0.04em] block mb-1">
                    Eccentricity (0–0.9)
                  </label>
                  <input className="w-full bg-[#080c16e6] border border-white/5 rounded-md text-white/90 font-mono text-[13px] px-2.5 py-2 outline-none transition-all duration-200 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 placeholder-white/35" type="text" value={eccentricity} onChange={(e) => setEccentricity(e.target.value)} />
                </div>

                <button className="col-span-2 mt-1 inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-sky-400/15 border border-sky-400/30 rounded-md text-sky-400 text-xs font-semibold tracking-[0.04em] cursor-pointer transition-all duration-200 hover:bg-sky-400/20 hover:border-sky-400/50 hover:shadow-[0_0_12px_rgba(56,189,248,0.15)]" onClick={handleApplySatellite}>
                  Apply Trajectory
                </button>
              </div>

              <p className="text-[10px] text-white/40 text-center mt-1.5">
                {satStatusText}
              </p>

              <p className="text-[9px] text-white/40 mt-2 leading-relaxed">
                Inclination: 0°=equatorial, 90°=polar • RAAN: orbit orientation in 360° • Speed via Vis-Viva.
              </p>
            </div>

            {/* ─── LEO Orbital Decay Monitor ─── */}
            <div
              className={`rounded-md p-3 border ${
                altitudeHealth === "crit"
                  ? "border-red-400/35 bg-red-400/5"
                  : altitudeHealth === "warn"
                  ? "border-amber-400/35 bg-amber-400/5"
                  : "border-white/5 bg-white/2"
              }`}
            >
              <div
                className={`text-[10px] font-bold tracking-widest uppercase mb-2.5 ${
                  altitudeHealth === "crit"
                    ? "text-red-400"
                    : altitudeHealth === "warn"
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                LEO Decay Monitor
              </h2>

              <div className="flex justify-between items-center py-1 text-xs border-t border-white/5 first:border-t-0 mt-0 pt-0">
                <span className="text-white/40 text-[11px]">Current Altitude</span>
                <span
                  className={`font-mono text-xs font-medium ${
                    altitudeHealth === "crit"
                      ? "text-red-400"
                      : altitudeHealth === "warn"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {Math.round(satAltitude)} km
                </span>
              </div>
              <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                <span className="text-white/40 text-[11px]">Drag Rate</span>
                <span className="text-white/90 font-mono text-xs font-medium">{decayRate} km/min</span>
              </div>
              <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                <span className="text-white/40 text-[11px]">Floor</span>
                <span className="text-white/90 font-mono text-xs font-medium">{LEO_LIMITS.FLOOR} km (re-entry)</span>
              </div>

              {/* Altitude bar */}
              <div className="mt-2 h-1.5 bg-[#080c16e6] rounded-[3px] border border-white/5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ease-out ${
                    altitudeHealth === "crit"
                      ? "bg-red-400"
                      : altitudeHealth === "warn"
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  }`}
                  style={{ width: `${Math.max(0, Math.min(1, altFraction)) * 100}%` }}
                />
              </div>

              <button
                className="w-full mt-2.5 inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-sky-400/15 border border-sky-400/30 rounded-md text-sky-400 text-xs font-semibold tracking-[0.04em] cursor-pointer transition-all duration-200 hover:bg-sky-400/20 hover:border-sky-400/50 hover:shadow-[0_0_12px_rgba(56,189,248,0.15)] disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={handleBoost}
                disabled={satAltitude >= LEO_LIMITS.CEILING}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                Boost Burn (+50 km)
              </button>

              <p className="text-[10px] text-white/40 text-center mt-1.5 min-h-[14px]">
                {boostStatus || "Atmospheric drag continuously degrades altitude."}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
