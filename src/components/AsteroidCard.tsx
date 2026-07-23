"use client"

import { useEffect, useRef } from "react"
import { useAppState } from "@/lib/store"
import { trackedPosition } from "./AsteroidField"

function LiveCoordinates() {
  const xRef = useRef<HTMLSpanElement>(null)
  const yRef = useRef<HTMLSpanElement>(null)
  const zRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frameId: number
    const update = () => {
      if (xRef.current && yRef.current && zRef.current) {
        xRef.current.innerText = trackedPosition.current.x.toFixed(2)
        yRef.current.innerText = trackedPosition.current.y.toFixed(2)
        zRef.current.innerText = trackedPosition.current.z.toFixed(2)
      }
      frameId = requestAnimationFrame(update)
    }
    frameId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <div className="kv-row">
      <span className="kv-label">Live Coordinates</span>
      <span className="kv-value" style={{ fontVariantNumeric: "tabular-nums" }}>
        X: <span ref={xRef}>0.00</span> Y: <span ref={yRef}>0.00</span> Z: <span ref={zRef}>0.00</span>
      </span>
    </div>
  )
}

export function AsteroidCard() {
  const {
    user,
    selectedAsteroid,
    claimedAsteroids,
    claimAsteroid,
    leftSidebarOpen,
    selectAsteroid,
  } = useAppState()
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
  if (!selectedAsteroid) return
  closeButtonRef.current?.focus()
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") selectAsteroid(null)
  }
  document.addEventListener("keydown", onKeyDown)
  return () => document.removeEventListener("keydown", onKeyDown)
}, [selectedAsteroid, selectAsteroid])

  if (!selectedAsteroid) return null

  const isClaimed = claimedAsteroids.has(selectedAsteroid.id)
  const claimData = claimedAsteroids.get(selectedAsteroid.id)
  const canRelease = isClaimed && claimData?.user_id === user?.id

  return (
    <div
      className={`fixed top-[calc(var(--header-height)+16px)] w-[300px] z-42 bg-[#0a101ce6] backdrop-blur-[20px] border border-sky-400/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-fade-in-left transition-[left] duration-300 ease-out`}
      style={{ left: leftSidebarOpen ? "calc(var(--sidebar-width) + 24px)" : "24px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-sky-400/5 to-transparent">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${isClaimed ? "bg-emerald-400 shadow-[0_0_6px_var(--accent-green)]" : "bg-sky-400 shadow-[0_0_6px_var(--accent-cyan)]"}`}
          />
          <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-white/90">
            Inspector: {selectedAsteroid.name}
          </span>
        </div>
        <button
          className="bg-transparent border-none text-white/40 cursor-pointer hover:text-white/90 p-1"
          onClick={() => selectAsteroid(null)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Claim Status Badge */}
        {isClaimed && (
          <div className="mb-3 px-2.5 py-1.5 rounded-md bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] font-semibold tracking-[0.04em] flex items-center justify-between">
            <div className="flex items-center gap-2 group relative" title={claimData?.user_name ? `Claimed by ${claimData.user_name}` : "Claimed"}>
              <span className="uppercase">STATUS: {claimData?.user_name ? `CLAIMED BY ${claimData.user_name}` : "CLAIMED & SECURED"}</span>
              {claimData?.avatar_url && (
                <img src={claimData.avatar_url} alt="" className="w-4 h-4 rounded-full border border-emerald-400/50" />
              )}
            </div>
            <span className="text-[9px] opacity-80">SEC-REG</span>
          </div>
        )}

        {/* Orbit Visual Diagram Placeholder or Stats */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3.5">
          <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-white/60 mb-2.5">Orbital Mechanics</div>
          
          <div className="flex justify-between items-center py-1 text-xs">
            <span className="text-[11px] text-white/40">Semi-Major Axis</span>
            <span className="font-mono text-[12px] text-white/90 font-medium">{(selectedAsteroid.orbitRadius * 0.15).toFixed(3)} AU</span>
          </div>
          <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
            <span className="text-[11px] text-white/40">Mean Orbit Radius</span>
            <span className="font-mono text-[12px] text-white/90 font-medium">{selectedAsteroid.orbitRadius.toFixed(2)} R⊕</span>
          </div>
          <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
            <span className="text-[11px] text-white/40">Inclination Angle</span>
            <span className="font-mono text-[12px] text-white/90 font-medium">
              {(selectedAsteroid.inclination * (180 / Math.PI)).toFixed(1)}°
            </span>
          </div>
          <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
            <span className="text-[11px] text-white/40">Object Velocity</span>
            <span className="font-mono text-[12px] text-white/90 font-medium">{selectedAsteroid.velocity}</span>
          </div>
          <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
            <span className="text-[11px] text-white/40">Est. Diameter</span>
            <span className="font-mono text-[12px] text-white/90 font-medium">{(selectedAsteroid.scale * 120).toFixed(1)} km</span>
          </div>
          <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
            <span className="text-[11px] text-white/40">Relative Dist.</span>
            <span className="font-mono text-[12px] text-white/90 font-medium">{selectedAsteroid.distance}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => claimAsteroid(selectedAsteroid.id)}
            disabled={isClaimed && !canRelease}
            className={`
              w-full p-2.5 rounded-lg text-xs font-bold tracking-[0.06em] uppercase transition-all duration-200
              ${isClaimed 
                ? (canRelease 
                    ? "bg-red-400/15 border border-red-400/40 text-red-400 hover:bg-red-400/25 cursor-pointer" 
                    : "bg-emerald-400/15 border border-emerald-400/40 text-emerald-400 cursor-not-allowed opacity-50")
                : "bg-sky-400/15 border border-sky-400/40 text-sky-400 hover:bg-sky-400/25 hover:shadow-[0_0_12px_rgba(56,189,248,0.15)] cursor-pointer"
              }
            `}
          >
            {isClaimed ? (canRelease ? "Release Mining Claim" : "Claimed by " + (claimData?.user_name || "Another User")) : "File Mining Claim"}
          </button>
        </div>
      </div>
    </div>
  )
}
