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
  const handleClaimToggle = () => {
    if (isClaimed) {
      const confirmed = window.confirm(`Release the mining claim for ${selectedAsteroid.name}?`)
      if (!confirmed) return
    } else {
      const confirmed = window.confirm(`File a mining claim for ${selectedAsteroid.name}?`)
      if (!confirmed) return
    }
    claimAsteroid(selectedAsteroid.id)
  }

  return (
    <div
      className="fixed z-42 w-[300px] bg-[#0a101ce6] backdrop-blur-[20px] border border-sky-400/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out animate-fade-in-left"
      style={{
        top: "calc(var(--header-height) + 16px)",
        left: leftSidebarOpen ? "calc(var(--sidebar-width) + 24px)" : "24px",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isClaimed
                ? "bg-emerald-400 shadow-[0_0_6px_#34d399]"
                : "bg-sky-400 shadow-[0_0_6px_#38bdf8]"
            }`}
          />
          <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-white/90">
            Inspector: {selectedAsteroid.name}
          </span>
        </div>
        <button
          className="inline-flex items-center justify-center p-1 bg-transparent border-none text-white/60 cursor-pointer transition-all duration-200 hover:text-white/90"
          onClick={() => selectAsteroid(null)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-3.5">
        {/* Claim Status Badge */}
        {isClaimed && (
          <div className="flex items-center justify-between mb-3 px-2.5 py-1.5 rounded-md bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] font-semibold tracking-[0.04em]">
            <span>STATUS: CLAIMED & SECURED</span>
            <span className="text-[9px] opacity-80">SEC-REG</span>
          </div>
        )}

        {/* Orbit Visual Diagram Placeholder or Stats */}
        <div className="bg-white/5 border border-white/5 rounded-md p-3 mb-3.5">
          <div className="text-[10px] font-bold tracking-widest uppercase text-white/60 mb-2.5">
            Orbital Mechanics
          </div>
          <div className="flex justify-between items-center py-1 text-xs border-t border-white/5 first:border-t-0 mt-0 pt-0">
            <span className="text-white/40 text-[11px]">Semi-Major Axis</span>
            <span className="text-white/90 font-mono text-xs font-medium">
              {(selectedAsteroid.orbitRadius * 0.15).toFixed(3)} AU
            </span>
          </div>
          <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
            <span className="text-white/40 text-[11px]">Mean Orbit Radius</span>
            <span className="text-white/90 font-mono text-xs font-medium">
              {selectedAsteroid.orbitRadius.toFixed(2)} R⊕
            </span>
          </div>
          <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
            <span className="text-white/40 text-[11px]">Inclination Angle</span>
            <span className="text-white/90 font-mono text-xs font-medium">
              {(selectedAsteroid.inclination * (180 / Math.PI)).toFixed(1)}°
            </span>
          </div>
          <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
            <span className="text-white/40 text-[11px]">Object Velocity</span>
            <span className="text-white/90 font-mono text-xs font-medium">
              {selectedAsteroid.velocity}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
            <span className="text-white/40 text-[11px]">Est. Diameter</span>
            <span className="text-white/90 font-mono text-xs font-medium">
              {(selectedAsteroid.scale * 120).toFixed(1)} km
            </span>
          </div>
          <div className="flex justify-between items-center py-1 text-xs border-t border-white/5">
            <span className="text-white/40 text-[11px]">Relative Dist.</span>
            <span className="text-white/90 font-mono text-xs font-medium">
              {selectedAsteroid.distance}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => claimAsteroid(selectedAsteroid.id)}
            className={`w-full p-2.5 rounded-lg border text-xs font-bold tracking-[0.06em] uppercase cursor-pointer transition-all duration-200 hover:shadow-lg ${
              isClaimed
                ? "bg-red-400/10 border-red-400/40 text-red-400 hover:bg-red-400/20"
                : "bg-sky-400/10 border-sky-400/40 text-sky-400 hover:bg-sky-400/20"
            }`}
          >
            {isClaimed ? "Release Mining Claim" : "File Mining Claim"}
          </button>
        </div>
      </div>
    </div>
  )
}
