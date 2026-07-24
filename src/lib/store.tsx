"use client"

/**
 * @file store.tsx
 * @description Centralized State Management & Custom Hook Provider for AstroDex.
 * Houses global application state including Asteroid catalog management, orbital mechanics telemetry,
 * UI sidebar states, and conjunction collision risks.
 */

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"
import type { AsteroidData } from "./types"

// ==========================================
// Types & Interfaces
// ==========================================

export interface ConjunctionAlert {
  id: number
  tca: string
  missKm: string
  risk: "HIGH" | "MEDIUM" | "LOW"
  secondaryId: number
  secondaryName: string
  type: "asteroid" | "debris"
  satelliteName: string
}

export interface AppState {
  // Asteroid Selection & Catalog
  selectedAsteroid: AsteroidData | null
  claimedAsteroids: Set<number>
  asteroidCatalog: AsteroidData[]
  selectAsteroid: (asteroid: AsteroidData | null) => void
  claimAsteroid: (id: number) => void
  searchAsteroidById: (id: number) => void
  registerAsteroidData: (data: AsteroidData[]) => void

  // Camera & Simulation Controls
  resetCamera: boolean
  triggerReset: () => void
  clearReset: () => void
  simulationRunning: boolean
  toggleSimulation: () => void
  riskLevel: "HIGH" | "MEDIUM" | "LOW"

  // UI & Panel Toggles
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  terminalExpanded: boolean
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void
  toggleTerminal: () => void

  // Space Debris Filters & Satellite Orbit Telemetry
  filterType: "ALL" | "ASTEROIDS" | "DEBRIS"
  setFilterType: (filter: "ALL" | "ASTEROIDS" | "DEBRIS") => void
  satAltitude: number
  satInclination: number
  satRaan: number
  satEccentricity: number
  updateSatelliteParams: (alt: number, inc: number, raan: number) => void
  updateSatelliteEccentricity: (e: number) => void
  decayAltitude: (amount: number) => void
  boostBurn: (deltaKm: number) => void
  boostCount: number
  deltaVCount: number
  triggerDeltaVLog: () => void

  // Cinematic & Visual FX Settings
  cinematicMode: boolean
  toggleCinematicMode: () => void
  cameraFov: number
  setCameraFov: (fov: number) => void
  autoRotate: boolean
  toggleAutoRotate: () => void
  bloomIntensity: number
  setBloomIntensity: (intensity: number) => void

  // Conjunction Alert System
  conjunctions: ConjunctionAlert[]
  addConjunctionAlert: (alert: Omit<ConjunctionAlert, "id">) => void
  clearConjunctions: () => void
}

// ==========================================
// Constants
// ==========================================

const LEO_FLOOR_KM = 180  // Re-entry threshold limit
const LEO_CEILING_KM = 500 // Hard upper ceiling limit

export const LEO_LIMITS = { FLOOR: LEO_FLOOR_KM, CEILING: LEO_CEILING_KM } as const

const AppContext = createContext<AppState | null>(null)

// ==========================================
// Context Provider Component
// ==========================================

export function AppProvider({ children }: { children: ReactNode }) {
  // 1. Asteroid Data States
  const [selectedAsteroid, setSelectedAsteroid] = useState<AsteroidData | null>(null)
  const [claimedAsteroids, setClaimedAsteroids] = useState<Set<number>>(new Set())
  const [asteroidCatalog, setAsteroidCatalog] = useState<AsteroidData[]>([])
  const asteroidDataRef = useRef<AsteroidData[]>([])

  // 2. Simulation & Camera States
  const [resetCamera, setResetCamera] = useState<boolean>(false)
  const [simulationRunning, setSimulationRunning] = useState<boolean>(true)
  const [riskLevel, setRiskLevel] = useState<"HIGH" | "MEDIUM" | "LOW">("LOW")

  // 3. Navigation & Panel States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true)
  const [terminalExpanded, setTerminalExpanded] = useState<boolean>(false)

  // 4. Debris Filters & Satellite Trajectory
  const [filterType, setFilterType] = useState<"ALL" | "ASTEROIDS" | "DEBRIS">("ALL")
  const [satAltitude, setSatAltitude] = useState<number>(400)
  const [satInclination, setSatInclination] = useState<number>(51.63)
  const [satRaan, setSatRaan] = useState<number>(0)
  const [satEccentricity, setSatEccentricity] = useState<number>(0.0006)
  const [boostCount, setBoostCount] = useState<number>(0)
  const [deltaVCount, setDeltaVCount] = useState<number>(0)
  const [conjunctions, setConjunctions] = useState<ConjunctionAlert[]>([])
  const nextAlertId = useRef<number>(1)

  // 5. Cinematic Visual Rendering States
  const [cinematicMode, setCinematicMode] = useState<boolean>(false)
  const [cameraFov, setCameraFov] = useState<number>(75)
  const [autoRotate, setAutoRotate] = useState<boolean>(false)
  const [bloomIntensity, setBloomIntensity] = useState<number>(1.0)

  // Auto-collapse sidebars on smaller mobile screens
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) return
    const frame = requestAnimationFrame(() => {
      setLeftSidebarOpen(false)
      setRightSidebarOpen(false)
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  // Action Handlers
  const selectAsteroid = useCallback((asteroid: AsteroidData | null) => {
    setSelectedAsteroid(asteroid)
  }, [])

  const claimAsteroid = useCallback((id: number) => {
    setClaimedAsteroids((prevClaims) => {
      const nextClaims = new Set(prevClaims)
      if (nextClaims.has(id)) {
        nextClaims.delete(id)
      } else {
        nextClaims.add(id)
      }
      return nextClaims
    })
  }, [])

  const triggerReset = useCallback(() => {
    setResetCamera(true)
    setSelectedAsteroid(null)
  }, [])

  const clearReset = useCallback(() => setResetCamera(false), [])
  const toggleSimulation = useCallback(() => setSimulationRunning((prev) => !prev), [])
  const toggleLeftSidebar = useCallback(() => setLeftSidebarOpen((prev) => !prev), [])
  const toggleRightSidebar = useCallback(() => setRightSidebarOpen((prev) => !prev), [])
  const toggleTerminal = useCallback(() => setTerminalExpanded((prev) => !prev), [])

  const registerAsteroidData = useCallback((data: AsteroidData[]) => {
    asteroidDataRef.current = data
    setAsteroidCatalog(data)
  }, [])

  const searchAsteroidById = useCallback((id: number) => {
    const found = asteroidDataRef.current.find((item) => item.id === id)
    if (found) {
      setSelectedAsteroid(found)
    }
  }, [])

  const triggerDeltaVLog = useCallback(() => {
    setDeltaVCount((count) => count + 1)
  }, [])

  const updateSatelliteParams = useCallback((alt: number, inc: number, raan: number) => {
    setSatAltitude(Math.min(LEO_CEILING_KM, Math.max(LEO_FLOOR_KM, alt)))
    setSatInclination(((inc % 360) + 360) % 360)
    setSatRaan(((raan % 360) + 360) % 360)
  }, [])

  const updateSatelliteEccentricity = useCallback((eccentricity: number) => {
    setSatEccentricity(Math.max(0, Math.min(0.9, eccentricity)))
  }, [])

  const decayAltitude = useCallback((amount: number) => {
    if (amount <= 0) return
    setSatAltitude((prevAlt) => Math.max(LEO_FLOOR_KM, prevAlt - amount))
  }, [])

  const boostBurn = useCallback((deltaKm: number) => {
    if (deltaKm <= 0) return
    setSatAltitude((prevAlt) => Math.min(LEO_CEILING_KM, prevAlt + deltaKm))
    setBoostCount((count) => count + 1)
  }, [])

  const toggleCinematicMode = useCallback(() => {
    setCinematicMode((prevMode) => {
      const nextMode = !prevMode
      if (nextMode) {
        setCameraFov(85)
        setAutoRotate(true)
        setBloomIntensity(1.8)
      } else {
        setCameraFov(75)
        setAutoRotate(false)
        setBloomIntensity(1.0)
      }
      return nextMode
    })
  }, [])

  const toggleAutoRotate = useCallback(() => setAutoRotate((prev) => !prev), [])

  const addConjunctionAlert = useCallback((alert: Omit<ConjunctionAlert, "id">) => {
    setConjunctions((prevConjunctions) => {
      const existing = prevConjunctions.find(
        (c) => c.satelliteName === alert.satelliteName && c.secondaryId === alert.secondaryId
      )
      const newAlert = { ...alert, id: existing?.id ?? nextAlertId.current++ }
      const withoutExisting = prevConjunctions.filter((c) => c.id !== newAlert.id)
      const updated = [newAlert, ...withoutExisting].slice(0, 15)

      const hasHighRisk = updated.some((c) => c.risk === "HIGH")
      const hasMediumRisk = updated.some((c) => c.risk === "MEDIUM")

      if (hasHighRisk) setRiskLevel("HIGH")
      else if (hasMediumRisk) setRiskLevel("MEDIUM")
      else setRiskLevel("LOW")

      return updated
    })
  }, [])

  const clearConjunctions = useCallback(() => {
    setConjunctions([])
    setRiskLevel("LOW")
  }, [])

  return (
    <AppContext.Provider
      value={{
        selectedAsteroid,
        claimedAsteroids,
        selectAsteroid,
        claimAsteroid,
        resetCamera,
        triggerReset,
        clearReset,
        simulationRunning,
        toggleSimulation,
        riskLevel,
        leftSidebarOpen,
        rightSidebarOpen,
        terminalExpanded,
        toggleLeftSidebar,
        toggleRightSidebar,
        toggleTerminal,
        searchAsteroidById,
        registerAsteroidData,
        asteroidCatalog,
        filterType,
        setFilterType,
        satAltitude,
        satInclination,
        satRaan,
        satEccentricity,
        updateSatelliteParams,
        updateSatelliteEccentricity,
        decayAltitude,
        boostBurn,
        boostCount,
        deltaVCount,
        triggerDeltaVLog,
        cinematicMode,
        toggleCinematicMode,
        cameraFov,
        setCameraFov,
        autoRotate,
        toggleAutoRotate,
        bloomIntensity,
        setBloomIntensity,
        conjunctions,
        addConjunctionAlert,
        clearConjunctions,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

/**
 * Custom React Hook to consume the global AstroDex state context.
 * 
 * @returns {AppState} Global state values and action dispatcher methods.
 * @throws {Error} If called outside of an `<AppProvider>` tree.
 * 
 * @example
 * ```tsx
 * const { selectedAsteroid, selectAsteroid } = useAppState();
 * ```
 */
export function useAppState(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error("useAppState must be consumed within an <AppProvider>")
  }
  return ctx
}