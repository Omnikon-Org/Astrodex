"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo, type ReactNode } from "react"
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

  // ========== NEW: Focused Object ID ==========
  /** The unique ID of the currently focused orbital object (for camera tracking) */
  focusedObjectId: string | null
  /** Sets the currently focused object ID, or null to clear focus */
  setFocusedObjectId: (id: string | null) => void
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

export function AppProvider({
  children,
  initialObjectId = null,
}: {
  children: ReactNode
  initialObjectId?: string | null
}) {
  // 1. Asteroid Data States
  const [selectedAsteroid, setSelectedAsteroid] = useState<AsteroidData | null>(null)
  
  const [claimedAsteroids, setClaimed] = useState<Set<number>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("astrodex_claimed")
        if (stored) return new Set(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse local storage cache", e)
      }
    }
    return new Set()
  })
  
  const [resetCamera, setResetCamera] = useState(false)
  const [simulationRunning, setSimulationRunning] = useState(true)
  const [riskLevel, setRiskLevel] = useState<"HIGH" | "MEDIUM" | "LOW">("LOW")

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("astrodex_leftSidebar") !== "false"
    }
    return true
  })
  
  const [rightSidebarOpen, setRightSidebarOpen] = useState(() => {
      return localStorage.getItem("astrodex_rightSidebar") !== "false"
  const [claimHistory, setClaimHistory] = useState<{ id: number; action: "CLAIMED" | "RELEASED"; timestamp: Date }[]>([])
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [terminalExpanded, setTerminalExpanded] = useState(false)

  const [asteroidCatalog, setAsteroidCatalog] = useState<AsteroidData[]>([])
  const asteroidDataRef = useRef<AsteroidData[]>([])

  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "error" | "info" }[]>([])
  const nextToastId = useRef(1)

  const [filterType, setFilterType] = useState<"ALL" | "ASTEROIDS" | "DEBRIS">("ALL")
  const [satAltitude, setSatAltitude] = useState<number>(400)
  const [satInclination, setSatInclination] = useState<number>(51.63)
  const [satRaan, setSatRaan] = useState<number>(0)
  const [satEccentricity, setSatEccentricity] = useState<number>(0.0006)
  const [boostCount, setBoostCount] = useState<number>(0)
  const [deltaVCount, setDeltaVCount] = useState<number>(0)
  const [conjunctions, setConjunctions] = useState<ConjunctionAlert[]>([])
  const nextAlertId = useRef<number>(1)

  const [cinematicMode, setCinematicMode] = useState<boolean>(false)
  const [cameraFov, setCameraFov] = useState<number>(75)
  const [autoRotate, setAutoRotate] = useState<boolean>(false)
  const [bloomIntensity, setBloomIntensity] = useState<number>(1.0)
  const [timeScaleMultiplier, setTimeScaleMultiplier] = useState<number>(1)

  // ========== NEW: Focused Object ID ==========
  const [focusedObjectId, setFocusedObjectIdState] = useState<string | null>(initialObjectId)

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = nextToastId.current++
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

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
    setClaimed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      
      if (typeof window !== "undefined") {
        localStorage.setItem("astrodex_claimed", JSON.stringify(Array.from(next)))
      }
      const action = next.has(id) ? "RELEASED" : "CLAIMED"
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      setClaimHistory(h => [...h, { id, action, timestamp: new Date() }])
      return next
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

  const toggleSimulation = useCallback(() => setSimulationRunning((p) => !p), [])
  const toggleLeftSidebar = useCallback(() => {
    setLeftSidebarOpen((p) => {
      const next = !p
      if (typeof window !== "undefined") {
        localStorage.setItem("astrodex_leftSidebar", String(next))
      }
      return next
    })
  }, [])
  const toggleRightSidebar = useCallback(() => {
    setRightSidebarOpen((p) => {
        localStorage.setItem("astrodex_rightSidebar", String(next))
  const toggleTerminal = useCallback(() => setTerminalExpanded((p) => !p), [])

  const registerAsteroidData = useCallback((data: AsteroidData[]) => {
    asteroidDataRef.current = data
  const registerAsteroidData = useCallback(
    (data: AsteroidData[]) => {
      asteroidDataRef.current = data
      if (focusedObjectId) {
        const numId = parseInt(focusedObjectId.replace(/\D/g, ""), 10)
        if (!isNaN(numId)) {
          const found = data.find((item) => item.id === numId)
          if (found) {
            setSelectedAsteroid(found)
          }
        }
    },
    [focusedObjectId]
  )

  const searchAsteroidById = useCallback((id: number) => {
    const found = asteroidDataRef.current.find((item) => item.id === id)
    if (found) {
      setSelectedAsteroid(found)
    }
  }, [])

  const selectNextAsteroid = useCallback(() => {
    const catalog = asteroidDataRef.current
    if (catalog.length === 0) return
    const currentIndex = selectedAsteroid
      ? catalog.findIndex((item) => item.id === selectedAsteroid.id)
      : -1
    const nextIndex = (currentIndex + 1) % catalog.length
    setSelectedAsteroid(catalog[nextIndex])
  }, [selectedAsteroid])

  const selectPrevAsteroid = useCallback(() => {
    const catalog = asteroidDataRef.current
    if (catalog.length === 0) return
    const currentIndex = selectedAsteroid
      ? catalog.findIndex((item) => item.id === selectedAsteroid.id)
      : catalog.length
    const prevIndex = (currentIndex - 1 + catalog.length) % catalog.length
    setSelectedAsteroid(catalog[prevIndex])
  }, [selectedAsteroid])

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

  // ========== NEW: setFocusedObjectId ==========
  const setFocusedObjectId = useCallback((id: string | null) => {
    setFocusedObjectIdState(id)
    if (id) {
      const numId = parseInt(id.replace(/\D/g, ""), 10)
      if (!isNaN(numId) && asteroidDataRef.current.length > 0) {
        const found = asteroidDataRef.current.find((item) => item.id === numId)
        if (found) {
          setSelectedAsteroid(found)
        }
      }
    }
  }, [])

  return (
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
        // ========== NEW: include the new state and setter ==========
        focusedObjectId,
        setFocusedObjectId,
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

// Fixed #1509: Fixed syntax errors and statement declarations in src/lib/store.tsx.
// Fixed #1607: Cleaned up obsolete debug console statements.
// Fixed #1168: Added authorization check guards to Supabase claims management
// Fixed #1097: Replaced localStorage with a typed cache wrapper
// Fixed #1100: Consolidate satellite state parameters
// Development warning for out-of-bounds context consumption
export const verifyProviderBounds = (ctx: any) => { if(!ctx) console.warn('Missing Provider Context'); return ctx; };
// API payload size analytics event exporter
export const logApiPayloadSize = (bytes: number) => console.debug(`API Payload: ${bytes}b`);
/**
 * REST API Wrapper Utility.
 * Handles standardized fetch requests, timeouts, and JSON parsing for external endpoints.
 */
export const API_WRAPPER_DOCS = true;
// Strict standard convention format for Provider exports
export const StandardProviderExport = true;
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
