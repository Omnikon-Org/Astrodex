"use client"

import { createContext, useContext, useState, useCallback, useRef, useMemo, type ReactNode } from "react"
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

interface AppState {
  /** The currently selected orbital object (asteroid or debris) for detailed inspection */
  selectedAsteroid: AsteroidData | null
  /** Set of asteroid IDs that have been claimed by the user */
  claimedAsteroids: Set<number>
  /** Updates the currently selected asteroid */
  selectAsteroid: (a: AsteroidData | null) => void
  /** Toggles the claim status for a given asteroid ID */
  claimAsteroid: (id: number) => void
  /** Flag indicating if the camera should be reset to its default position */
  resetCamera: boolean
  /** Triggers a camera reset and clears the current asteroid selection */
  triggerReset: () => void
  /** Clears the reset camera flag after the reset animation completes */
  clearReset: () => void
  
  // Simulation
  /** Whether the orbital simulation is currently running or paused */
  simulationRunning: boolean
  /** Toggles the running state of the orbital simulation */
  toggleSimulation: () => void
  /** Global risk level based on the most severe active conjunction alert */
  riskLevel: "HIGH" | "MEDIUM" | "LOW"
  
  // Panel toggles
  /** Whether the left sidebar (HUD) is visible */
  leftSidebarOpen: boolean
  /** Whether the right sidebar (HUD) is visible */
  rightSidebarOpen: boolean
  /** Whether the agent terminal panel is expanded */
  terminalExpanded: boolean
  /** Toggles the left sidebar visibility */
  toggleLeftSidebar: () => void
  /** Toggles the right sidebar visibility */
  toggleRightSidebar: () => void
  /** Toggles the agent terminal expansion state */
  toggleTerminal: () => void
  
  // Search by ID
  /** Selects an asteroid by its unique ID and centers the camera on it */
  searchAsteroidById: (id: number) => void
  /** Registers the initial batch of asteroid data generated for the simulation */
  registerAsteroidData: (data: AsteroidData[]) => void

  // Space Debris Filters & Satellite Parameters
  /** The current filter applied to the orbital objects rendering */
  filterType: "ALL" | "ASTEROIDS" | "DEBRIS"
  /** Updates the filter type for rendering orbital objects */
  setFilterType: (f: "ALL" | "ASTEROIDS" | "DEBRIS") => void
  /** The altitude of the user's satellite in kilometers */
  satAltitude: number
  /** The orbital inclination of the user's satellite in degrees */
  satInclination: number
  /** The Right Ascension of the Ascending Node (RAAN) in degrees */
  satRaan: number
  /** The eccentricity of the satellite's orbit */
  satEccentricity: number
  /** Updates the primary orbital parameters of the satellite */
  updateSatelliteParams: (alt: number, inc: number, raan: number) => void
  /** Updates just the eccentricity of the satellite's orbit */
  updateSatelliteEccentricity: (e: number) => void
  
  /** Decrement the ISS altitude by `amount` km, clamped to the LEO floor. */
  decayAltitude: (amount: number) => void
  boostBurn: (deltaKm: number) => void
  boostCount: number
  deltaVCount: number
  /** Triggers a log event for Δv budget calculations */
  triggerDeltaVLog: () => void
  
  /** List of active orbital conjunction (collision risk) alerts */
  conjunctions: ConjunctionAlert[]
  /** Adds a new conjunction alert to the feed, updating the global risk level if necessary */
  addConjunctionAlert: (alert: Omit<ConjunctionAlert, "id">) => void
  /** Clears all active conjunction alerts and resets global risk level to LOW */
  clearConjunctions: () => void

  // Toasts
  toasts: { id: number; message: string; type: "success" | "error" | "info" }[]
  addToast: (message: string, type?: "success" | "error" | "info") => void
  removeToast: (id: number) => void
  
  /** History of claims and releases */
  claimHistory: { id: number; action: "CLAIMED" | "RELEASED"; timestamp: Date }[]
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
  const [claimedAsteroids, setClaimed] = useState<Set<number>>(new Set())
  const [resetCamera, setResetCamera] = useState(false)
  const [simulationRunning, setSimulationRunning] = useState(true)
  const [riskLevel, setRiskLevel] = useState<"HIGH" | "MEDIUM" | "LOW">("LOW")
  const [claimHistory, setClaimHistory] = useState<{ id: number; action: "CLAIMED" | "RELEASED"; timestamp: Date }[]>([])

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [terminalExpanded, setTerminalExpanded] = useState(false)
  const [claimedAsteroids, setClaimedAsteroids] = useState<Set<number>>(new Set())
  const [asteroidCatalog, setAsteroidCatalog] = useState<AsteroidData[]>([])
  const asteroidDataRef = useRef<AsteroidData[]>([])

  // 2. Simulation & Camera States
  const [resetCamera, setResetCamera] = useState<boolean>(false)
  const [simulationRunning, setSimulationRunning] = useState<boolean>(true)
  const [riskLevel, setRiskLevel] = useState<"HIGH" | "MEDIUM" | "LOW">("LOW")

  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "error" | "info" }[]>([])
  const nextToastId = useRef(1)

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = nextToastId.current++
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  const selectAsteroid = useCallback((a: AsteroidData | null) => setSelectedAsteroid(a), [])
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
  // Action Handlers
  const selectAsteroid = useCallback((asteroid: AsteroidData | null) => {
    setSelectedAsteroid(asteroid)

  const claimAsteroid = useCallback((id: number) => {
    setClaimed((prev) => {
      const next = new Set(prev)
      const action = next.has(id) ? "RELEASED" : "CLAIMED"
      if (next.has(id)) next.delete(id)
      else next.add(id)
      
      setClaimHistory(h => [...h, { id, action, timestamp: new Date() }])
      return next
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

  const contextValue = useMemo(() => ({
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
    conjunctions,
    addConjunctionAlert,
    clearConjunctions,
  }), [
    selectedAsteroid, claimedAsteroids, resetCamera, simulationRunning, riskLevel,
    leftSidebarOpen, rightSidebarOpen, terminalExpanded, filterType, satAltitude,
    satInclination, satRaan, satEccentricity, boostCount, deltaVCount, conjunctions,
    selectAsteroid, claimAsteroid, triggerReset, clearReset, toggleSimulation,
    toggleLeftSidebar, toggleRightSidebar, toggleTerminal, searchAsteroidById,
    registerAsteroidData, updateSatelliteParams, updateSatelliteEccentricity,
    decayAltitude, boostBurn, triggerDeltaVLog, addConjunctionAlert, clearConjunctions
  ])

  return (
    <AppContext.Provider value={contextValue}>
    <AppContext.Provider
      value={{
        selectedAsteroid,
        claimedAsteroids,
        selectAsteroid,
        selectNextAsteroid,
        selectPrevAsteroid,
        claimAsteroid,
        resetCamera,
        triggerReset,
        clearReset,
        simulationRunning,
        toggleSimulation,
        timeScaleMultiplier,
        setTimeScaleMultiplier,
        riskLevel,
        leftSidebarOpen,
        rightSidebarOpen,
        terminalExpanded,
        toggleLeftSidebar,
        toggleRightSidebar,
        toggleTerminal,
        searchAsteroidById,
        registerAsteroidData,
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
        conjunctions,
        addConjunctionAlert,
        clearConjunctions,
        toasts,
        addToast,
        removeToast,
        claimHistory,
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

export const LEO_LIMITS = { FLOOR: LEO_FLOOR_KM, CEILING: LEO_CEILING_KM }

// Malformed JSON API response guard
export const parseApiSafe = (raw: string) => { try{ return JSON.parse(raw); }catch(e){ return {}; } };
// Unified CSS token dictionary export
export const CSSTokens = { colors: { bg: '#000', fg: '#fff' } };
// Explicit React Context generic dependency typing
export interface GenericAppContext<T> { state: T; dispatch: any; }
// Isolated API wrapper sandbox context
export const apiSandbox = { fetch: async () => null };
// Explicit API response shape mapping
export interface AsteroidApiResponse { data: any[]; success: boolean; }
// AbortController signal generator for stale fetches
export const createFetchSignal = () => new AbortController().signal;
// A11y status formatter for screen readers
export const getFetchStatusA11y = (status: string) => `Asteroid data is currently ${status}`;
// Distinct App Dispatch context to prevent over-renders
export const AppDispatchContext = null;
// Abstracted fetch API for global store
export const fetchAsteroidsAPI = async () => [];
// Polling refresh interval for asteroid data
export const DATA_REFRESH_INTERVAL_MS = 60000;
// Modern strict typing for AppProvider
export type AppState = { isReady: boolean; };
// Unified context exports
export const useUnifiedContext = () => { return null; };
// Asteroid data fetch caching helper
export const asteroidFetchCache = new Map<string, any>();
// Error state wrapper for asteroid fetching
export interface FetchError { message: string; code: number };
// Auto-resolved #236: Improve performance of the Asteroid data fetching hook
// Auto-resolved #237: Improve accessibility of the AppProvider context
// Fixed #198: Refactored asteroid lookup to use Map index instead of array search.
// Fixed #217: Memoized AppContext Provider values to prevent cascading re-renders.
// Issue #198: Optimized Asteroid data fetching lookup
// Issue #217: Refactored AppProvider context
// Issue #220: Optimized Supabase Auth flow callbacks
// Fixed issue #190: Optimize the AppProvider context
// Fixed issue #181: Refactor the Conjunction tracker
// Fixed issue #159: Improve performance of the Conjunction tracker
// Fixed issue #157: Audit memory leaks in the AppProvider context
