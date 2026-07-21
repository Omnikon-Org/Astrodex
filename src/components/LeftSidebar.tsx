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
          className="fixed z-45 top-[calc(var(--header-height)+16px)] left-3 w-7 h-7 flex items-center justify-center bg-white/5 backdrop-blur-[12px] border border-white/10 rounded-md text-white/40 cursor-pointer transition-all duration-200 hover:text-white/90 hover:bg-white/5 hover:border-white/10"
          onClick={toggleLeftSidebar}
          title="Show Target Panel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      <aside className={`fixed z-40 top-[calc(var(--header-height)+8px)] left-2 bottom-[calc(var(--terminal-collapsed)+12px)] w-[var(--sidebar-width)] bg-[#0a101ce6] backdrop-blur-[20px] border border-sky-400/10 rounded-xl transition-all duration-300 ease-out ${leftSidebarOpen ? "" : "-translate-x-[calc(var(--sidebar-width)+16px)] opacity-0 pointer-events-none"}`}>
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-3 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
              <span className="text-xs font-bold tracking-[0.06em] text-white/90">
                Target + Live Feed
              </span>
            </div>
            <button className="inline-flex items-center justify-center p-1 bg-transparent border-none text-white/60 cursor-pointer transition-all duration-200 hover:text-white/90" onClick={toggleLeftSidebar}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3">
            {/* Object Type Tab Filters */}
            <div>
              <label className="text-[10px] font-bold tracking-[0.08em] uppercase text-white/40 mb-1.5 block">
                Filter Catalog
              </label>
              <div className="flex bg-[#080c16e6] border border-white/5 rounded-md p-0.5">
                {(["ALL", "ASTEROIDS", "DEBRIS"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterType(tab)}
                    className={`flex-1 py-1.5 text-[9px] font-bold tracking-[0.04em] rounded cursor-pointer transition-all duration-200 ${
                      filterType === tab
                        ? "bg-sky-400/15 border border-sky-400/25 text-sky-400"
                        : "bg-transparent border border-transparent text-white/60"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div>
              <label className="text-[10px] font-bold tracking-[0.08em] uppercase text-white/40 mb-1.5 block">
                Select Catalog Item By ID
              </label>
              <div className="flex gap-1.5">
                <input
                  className="flex-1 bg-[#080c16e6] border border-white/5 rounded-md text-white/90 font-mono text-[13px] px-2.5 py-2 outline-none transition-all duration-200 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 placeholder-white/35"
                  type="text"
                  placeholder="ID 1–600"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-transparent border border-white/5 rounded-md text-white/60 text-[11px] font-medium cursor-pointer transition-all duration-200 hover:bg-white/5 hover:border-white/10 hover:text-white/90 whitespace-nowrap"
                  onClick={handleSearch}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  LOAD
                </button>
              </div>
            </div>

            {/* Live Target Details */}
            <div className="bg-white/2 border border-white/5 rounded-md p-3">
              <div className="text-[10px] font-bold tracking-widest uppercase text-white/60 mb-2.5">Live Target Details</div>
              {selectedAsteroid ? (
                <div>
                  <div className="flex justify-between items-center py-1 text-xs border-t border-white/5 first:border-t-0 mt-0 pt-0">
                    <span className="text-white/40 text-[11px]">Designator</span>
                    <span className="text-white/90 font-mono text-xs font-medium">{selectedAsteroid.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                    <span className="text-white/40 text-[11px]">Class Category</span>
                    <span className={`font-mono text-xs font-medium ${selectedAsteroid.type === "debris" ? "text-amber-400" : "text-emerald-400"}`}>
                      {selectedAsteroid.type === "debris" ? "Space Debris" : "Natural Asteroid"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                    <span className="text-white/40 text-[11px]">Orbit Radius</span>
                    <span className="text-white/90 font-mono text-xs font-medium">{selectedAsteroid.orbitRadius.toFixed(2)} R⊕</span>
                  </div>
                  <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                    <span className="text-white/40 text-[11px]">Velocity</span>
                    <span className="text-white/90 font-mono text-xs font-medium">{selectedAsteroid.velocity}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                    <span className="text-white/40 text-[11px]">Inclination</span>
                    <span className="text-white/90 font-mono text-xs font-medium">{(selectedAsteroid.inclination * (180 / Math.PI)).toFixed(2)}°</span>
                  </div>
                  <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
                    <span className="text-white/40 text-[11px]">Last Updated</span>
                    <span className="text-white/90 font-mono text-[10px] font-medium">{sessionLoadTime}</span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-white/40 italic">
                  No target selected. Search by ID or click an asteroid/debris particle.
                </p>
              )}
            </div>

            {/* Conjunction Feed */}
            <div className="bg-white/2 border border-white/5 rounded-md p-3 flex-1 min-h-0 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] font-bold tracking-widest uppercase text-white/60 m-0">Conjunction Alerter</div>
                <div
                  className="text-[9px] text-white/40 font-mono"
                  title={riskFilter !== "ALL" ? `${filteredConjunctions.length} of ${conjunctions.length} total` : undefined}
                >
                  {filteredConjunctions.length} Active alerts
                </div>
              </div>

              {/* Risk filter */}
              <div className="flex bg-[#080c16e6] border border-white/5 rounded-md p-0.5 mb-2">
                {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setRiskFilter(level)}
                    className={`flex-1 py-1 text-[9px] font-bold tracking-[0.04em] rounded cursor-pointer transition-all duration-200 ${
                      riskFilter === level
                        ? "bg-sky-400/15 border border-sky-400/25 text-sky-400"
                        : "bg-transparent border border-transparent text-white/60"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      <th className="text-left px-2 py-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase text-white/40 border-b border-white/5">Sat / Target</th>
                      <th className="text-left px-2 py-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase text-white/40 border-b border-white/5">Miss</th>
                      <th className="text-left px-2 py-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase text-white/40 border-b border-white/5">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConjunctions.map((c) => (
                      <tr key={c.id} className="hover:bg-white/2">
                        <td className="px-2 py-1.5 text-white/60 border-b border-white/5 font-mono text-[11px]">
                          <div className="font-semibold text-white/90">{c.satelliteName}</div>
                          <div className={`text-[9px] ${c.type === "debris" ? "text-amber-400" : "text-white/40"}`}>
                            vs {c.secondaryName}
                          </div>
                        </td>
                        <td className="px-2 py-1.5 text-white/60 border-b border-white/5 font-mono text-[11px]">{c.missKm} km</td>
                        <td className="px-2 py-1.5 text-white/60 border-b border-white/5 font-mono text-[11px]">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[0.08em] uppercase ${
                              c.risk === "HIGH"
                                ? "bg-red-400/15 border border-red-400/30 text-red-400"
                                : c.risk === "MEDIUM"
                                ? "bg-amber-400/15 border border-amber-400/30 text-amber-400"
                                : "bg-emerald-400/15 border border-emerald-400/30 text-emerald-400"
                            }`}
                          >
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
