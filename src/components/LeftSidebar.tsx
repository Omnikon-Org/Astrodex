"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useAppState } from "@/lib/store"

export function LeftSidebar() {
  const {
    leftSidebarOpen,
    toggleLeftSidebar,
    selectedAsteroid,
    searchAsteroidById,
    filterType,
    setFilterType,
    conjunctions,
    addConjunctionAlert,
  } = useAppState()
  const [searchId, setSearchId] = useState("")
  const [riskFilter, setRiskFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL") 

  const filteredConjunctions = useMemo(() => {
  if (riskFilter === "ALL") return conjunctions
  return conjunctions.filter((c) => c.risk === riskFilter)
  }, [conjunctions, riskFilter])

  // Pre-seed some conjunctions at start if empty
  useEffect(() => {
    if (conjunctions.length === 0) {
      addConjunctionAlert({
        tca: "now",
        missKm: "43.2",
        risk: "LOW",
        secondaryId: 215,
        secondaryName: "AST-0215",
        type: "asteroid",
        satelliteName: "ISS (ZARYA)",
      })
      addConjunctionAlert({
        tca: "in 12m",
        missKm: "128.5",
        risk: "LOW",
        secondaryId: 452,
        secondaryName: "DEB-1994-082A",
        type: "debris",
        satelliteName: "Envisat",
      })
    }
  }, [conjunctions.length, addConjunctionAlert])

  const handleSearch = useCallback(() => {
    const id = parseInt(searchId, 10)
    if (!isNaN(id) && id >= 1 && id <= 600) {
      searchAsteroidById(id)
    }
  }, [searchId, searchAsteroidById])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSearch()
    },
    [handleSearch]
  )

  const sessionLoadTime = useMemo(() => {
    const now = new Date()
    return now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      ", " +
      now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
  }, [])

  return (
    <>
      {/* Toggle button when collapsed */}
      {!leftSidebarOpen && (
        <button
          className="sidebar-toggle sidebar-toggle-left"
          onClick={toggleLeftSidebar}
          title="Show Target Panel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      <aside className={`sidebar-left glass-panel ${leftSidebarOpen ? "" : "collapsed"}`}>
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-primary)" }}>
                Target + Live Feed
              </span>
            </div>
            <button className="btn-ghost" onClick={toggleLeftSidebar} style={{ padding: 4, border: "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
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
            {/* Object Type Tab Filters */}
            <div>
              <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6, display: "block" }}>
                Filter Catalog
              </label>
              <div style={{ display: "flex", background: "var(--bg-input)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: 2 }}>
                {(["ALL", "ASTEROIDS", "DEBRIS"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterType(tab)}
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      borderRadius: 4,
                      background: filterType === tab ? "rgba(56, 189, 248, 0.15)" : "transparent",
                      border: filterType === tab ? "1px solid rgba(56, 189, 248, 0.25)" : "1px solid transparent",
                      color: filterType === tab ? "var(--accent-cyan)" : "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div>
              <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6, display: "block" }}>
                Select Catalog Item By ID
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  className="mc-input"
                  type="text"
                  placeholder="ID 1–600"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ flex: 1 }}
                />
                <button className="btn-ghost" onClick={handleSearch} style={{ whiteSpace: "nowrap" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  LOAD
                </button>
              </div>
            </div>

            {/* Live Target Details */}
            <div className="panel-section">
              <div className="panel-section-title">Live Target Details</div>
              {selectedAsteroid ? (
                <div>
                  <div className="kv-row">
                    <span className="kv-label">Designator</span>
                    <span className="kv-value">{selectedAsteroid.name}</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Class Category</span>
                    <span className="kv-value" style={{ color: selectedAsteroid.type === "debris" ? "var(--accent-amber)" : "var(--accent-green)" }}>
                      {selectedAsteroid.type === "debris" ? "Space Debris" : "Natural Asteroid"}
                    </span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Orbit Radius</span>
                    <span className="kv-value">{selectedAsteroid.orbitRadius.toFixed(2)} R⊕</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Velocity</span>
                    <span className="kv-value">{selectedAsteroid.velocity}</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Inclination</span>
                    <span className="kv-value">{(selectedAsteroid.inclination * (180 / Math.PI)).toFixed(2)}°</span>
                  </div>
                  <div className="kv-row">
                    <span className="kv-label">Last Updated</span>
                    <span className="kv-value" style={{ fontSize: 10 }}>{sessionLoadTime}</span>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>
                  No target selected. Search by ID or click an asteroid/debris particle.
                </p>
              )}
            </div>

            {/* Conjunction Feed */}
            <div className="panel-section" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div className="panel-section-title" style={{ marginBottom: 0 }}>Conjunction Alerter</div>
                  <div
                    style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono), monospace" }}
                    title={riskFilter !== "ALL" ? `${filteredConjunctions.length} of ${conjunctions.length} total` : undefined}
                  >
                   {filteredConjunctions.length} Active alerts
                 </div>
            </div>

            {/* Risk filter — mirrors the Filter Catalog tab pattern */}
            <div style={{ display: "flex", background: "var(--bg-input)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: 2, marginBottom: 8 }}>
              {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setRiskFilter(level)}
                  style={{
                    flex: 1,
                    padding: "5px 0",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    borderRadius: 4,
                    background: riskFilter === level ? "rgba(56, 189, 248, 0.15)" : "transparent",
                    border: riskFilter === level ? "1px solid rgba(56, 189, 248, 0.25)" : "1px solid transparent",
                    color: riskFilter === level ? "var(--accent-cyan)" : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {level}
                </button>
              ))}
            </div>

              <div style={{ flex: 1, overflowY: "auto" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Sat / Target</th>
                      <th>Miss</th>
                      <th>Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConjunctions.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{c.satelliteName}</div>
                          <div style={{ fontSize: 9, color: c.type === "debris" ? "var(--accent-amber)" : "var(--text-muted)" }}>
                            vs {c.secondaryName}
                          </div>
                        </td>
                        <td>{c.missKm} km</td>
                        <td>
                          <span className={`badge ${c.risk === "HIGH" ? "badge-high" : c.risk === "MEDIUM" ? "badge-medium" : "badge-low"}`}>
                            {c.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
