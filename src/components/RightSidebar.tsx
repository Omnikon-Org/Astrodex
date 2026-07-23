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

  // ── Validation ──────────────────────────────────────────────────────────────
  // Each key maps to an error string (non-empty = invalid) or null (valid).
  const [errors, setErrors] = useState<Record<string, string | null>>({
    altitude: null,
    inclination: null,
    raan: null,
    eccentricity: null,
  })

  /**
   * Returns an error message for the given field/value pair, or null when valid.
   * Validation is intentionally loose on intermediate keystrokes (e.g. "1" before
   * the user finishes typing "180") — we only check that the value is a finite
   * number and within physical bounds.
   */
  function validate(field: string, raw: string): string | null {
    const n = parseFloat(raw)
    if (!Number.isFinite(n) || raw.trim() === "") {
      return "Must be a number"
    }
    switch (field) {
      case "altitude":
        return n < LEO_LIMITS.FLOOR || n > LEO_LIMITS.CEILING
          ? `Altitude must be ${LEO_LIMITS.FLOOR}–${LEO_LIMITS.CEILING} km`
          : null
      case "inclination":
        return n < 0 || n > 180
          ? "Inclination must be 0–180°"
          : null
      case "raan":
        return n < 0 || n >= 360
          ? "RAAN must be 0–360°"
          : null
      case "eccentricity":
        return n < 0 || n >= 0.9
          ? "Eccentricity must be 0–0.9"
          : null
      default:
        return null
    }
  }

  /** Returns true when every satellite configurator field is error-free. */
  const satInputsValid = Object.values(errors).every((e) => e === null)

  function handleFieldChange(field: string, value: string, setter: (v: string) => void) {
    setter(value)
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }))
  }

  function handleFieldBlur(field: string, value: string, setter: (v: string) => void) {
    // On blur, clamp to the valid range so the displayed value is always sane.
    const n = parseFloat(value)
    if (!Number.isFinite(n)) return
    let clamped = n
    if (field === "altitude")    clamped = Math.min(LEO_LIMITS.CEILING, Math.max(LEO_LIMITS.FLOOR, n))
    if (field === "inclination") clamped = Math.min(180, Math.max(0, n))
    if (field === "raan")        clamped = Math.min(359.99, Math.max(0, n))
    if (field === "eccentricity") clamped = Math.min(0.8999, Math.max(0, n))
    const formatted = field === "eccentricity" ? clamped.toFixed(4) : String(clamped)
    setter(formatted)
    setErrors((prev) => ({ ...prev, [field]: null }))
  }

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
        <Tooltip label="Show Constraints Panel" placement="left">
          <button
            className="sidebar-toggle sidebar-toggle-right"
            onClick={toggleRightSidebar}
            aria-label="Show Constraints Panel"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </Tooltip>
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
              <button className="btn-ghost" onClick={toggleRightSidebar} 
              aria-label="Hide Constraints Panel"
              style={{ padding: 4, border: "none" }}>
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
            {/* Planner Constraints */}
            <div className="panel-section">
              <h2 className="panel-section-title">Planner Constraints</h2>

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
              <h2 className="panel-section-title" style={{ color: "var(--accent-cyan)" }}>
                Manual Satellite (3D Orbit)
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {/* Altitude */}
                <div>
                  <label title="Vertical distance of the satellite above the Earth's surface" style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                    Altitude (km)
                  </label>
                  <input
                    className={`mc-input${errors.altitude ? " mc-input-error" : ""}`}
                    type="number"
                    inputMode="decimal"
                    value={altitude}
                    onChange={(e) => handleFieldChange("altitude", e.target.value, setAltitude)}
                    onBlur={(e) => handleFieldBlur("altitude", e.target.value, setAltitude)}
                    aria-invalid={!!errors.altitude}
                    aria-describedby={errors.altitude ? "err-altitude" : undefined}
                  />
                  {errors.altitude && (
                    <span id="err-altitude" className="input-error">{errors.altitude}</span>
                  )}
                </div>

                {/* Speed — read-only telemetry */}
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

                {/* Inclination */}
                <div>
                  <label title="The angle between the orbital plane and the Earth's equator" style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                    Inclination (°)
                  </label>
                  <input
                    className={`mc-input${errors.inclination ? " mc-input-error" : ""}`}
                    type="number"
                    inputMode="decimal"
                    value={inclination}
                    onChange={(e) => handleFieldChange("inclination", e.target.value, setInclination)}
                    onBlur={(e) => handleFieldBlur("inclination", e.target.value, setInclination)}
                    aria-invalid={!!errors.inclination}
                    aria-describedby={errors.inclination ? "err-inclination" : undefined}
                  />
                  {errors.inclination && (
                    <span id="err-inclination" className="input-error">{errors.inclination}</span>
                  )}
                </div>

                {/* RAAN */}
                <div>
                  <label title="Right Ascension of the Ascending Node (RAAN): The orientation of the orbit's ascending node in the equatorial plane" style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                    RAAN (°)
                  </label>
                  <input
                    className={`mc-input${errors.raan ? " mc-input-error" : ""}`}
                    type="number"
                    inputMode="decimal"
                    value={raan}
                    onChange={(e) => handleFieldChange("raan", e.target.value, setRaan)}
                    onBlur={(e) => handleFieldBlur("raan", e.target.value, setRaan)}
                    aria-invalid={!!errors.raan}
                    aria-describedby={errors.raan ? "err-raan" : undefined}
                  />
                  {errors.raan && (
                    <span id="err-raan" className="input-error">{errors.raan}</span>
                  )}
                </div>

                {/* Eccentricity */}
                <div style={{ gridColumn: "span 2" }}>
                  <label title="Measures how much the orbit deviates from a perfect circle (0 = circular, >0 = elliptical)" style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em", display: "block", marginBottom: 4 }}>
                    Eccentricity (0–0.9)
                  </label>
                  <input
                    className={`mc-input${errors.eccentricity ? " mc-input-error" : ""}`}
                    type="number"
                    inputMode="decimal"
                    step="0.001"
                    value={eccentricity}
                    onChange={(e) => handleFieldChange("eccentricity", e.target.value, setEccentricity)}
                    onBlur={(e) => handleFieldBlur("eccentricity", e.target.value, setEccentricity)}
                    aria-invalid={!!errors.eccentricity}
                    aria-describedby={errors.eccentricity ? "err-eccentricity" : undefined}
                  />
                  {errors.eccentricity && (
                    <span id="err-eccentricity" className="input-error">{errors.eccentricity}</span>
                  )}
                </div>

                <button
                  className="btn-primary"
                  onClick={handleApplySatellite}
                  disabled={!satInputsValid}
                  style={{
                    gridColumn: "span 2",
                    marginTop: 4,
                    opacity: satInputsValid ? 1 : 0.4,
                    cursor: satInputsValid ? "pointer" : "not-allowed",
                  }}
                  title={satInputsValid ? undefined : "Fix validation errors before applying"}
                >
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
              <h2
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
              </h2>

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
