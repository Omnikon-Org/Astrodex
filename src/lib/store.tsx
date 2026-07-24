"use client"

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react"
import type { AsteroidData } from "./types"

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
  /** Inject Δv into the ISS to raise its altitude (counter-acts drag). */
  boostBurn: (deltaKm: number) => void
  /** Increments every time a boost burn fires — AgentTerminal watches this. */
  boostCount: number
  /** Increments every time a Δv budget is computed — AgentTerminal watches this. */
  deltaVCount: number
  /** Triggers a log event for Δv budget calculations */
  triggerDeltaVLog: () => void
  
  /** List of active orbital conjunction (collision risk) alerts */
  conjunctions: ConjunctionAlert[]
  /** Adds a new conjunction alert to the feed, updating the global risk level if necessary */
  addConjunctionAlert: (alert: Omit<ConjunctionAlert, "id">) => void
  /** Clears all active conjunction alerts and resets global risk level to LOW */
  clearConjunctions: () => void
}

const AppContext = createContext<AppState | null>(null)

const LEO_FLOOR_KM = 180 // cannot decay below ~180 km (re-entry threshold)
const LEO_CEILING_KM = 500 // hard upper bound for user-set altitude

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedAsteroid, setSelectedAsteroid] = useState<AsteroidData | null>(null)
  const [claimedAsteroids, setClaimed] = useState<Set<number>>(new Set())
  const [resetCamera, setResetCamera] = useState(false)
  const [simulationRunning, setSimulationRunning] = useState(true)
  const [riskLevel, setRiskLevel] = useState<"HIGH" | "MEDIUM" | "LOW">("LOW")

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [terminalExpanded, setTerminalExpanded] = useState(false)
  const asteroidDataRef = useRef<AsteroidData[]>([])

  // Space Debris Filters & Satellite Parameters
  const [filterType, setFilterType] = useState<"ALL" | "ASTEROIDS" | "DEBRIS">("ALL")
  const [satAltitude, setSatAltitude] = useState(400) // km, LEO default
  const [satInclination, setSatInclination] = useState(51.63) // degrees — ISS historical value
  const [satRaan, setSatRaan] = useState(0) // degrees
  const [satEccentricity, setSatEccentricity] = useState(0.0006) // ≈ circular LEO
  const [boostCount, setBoostCount] = useState(0)
  const [deltaVCount, setDeltaVCount] = useState(0)
  const [conjunctions, setConjunctions] = useState<ConjunctionAlert[]>([])
  const nextAlertId = useRef(1)

  const selectAsteroid = useCallback((a: AsteroidData | null) => setSelectedAsteroid(a), [])

  const claimAsteroid = useCallback((id: number) => {
    setClaimed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const triggerReset = useCallback(() => {
    setResetCamera(true)
    setSelectedAsteroid(null)
  }, [])
  const clearReset = useCallback(() => setResetCamera(false), [])

  const toggleSimulation = useCallback(() => setSimulationRunning((p) => !p), [])
  const toggleLeftSidebar = useCallback(() => setLeftSidebarOpen((p) => !p), [])
  const toggleRightSidebar = useCallback(() => setRightSidebarOpen((p) => !p), [])
  const toggleTerminal = useCallback(() => setTerminalExpanded((p) => !p), [])

  const registerAsteroidData = useCallback((data: AsteroidData[]) => {
    asteroidDataRef.current = data
  }, [])

  const searchAsteroidById = useCallback((id: number) => {
    const found = asteroidDataRef.current.find((a) => a.id === id)
    if (found) {
      setSelectedAsteroid(found)
    }
  }, [])

  const triggerDeltaVLog = useCallback(() => {
    setDeltaVCount((c) => c + 1)
  }, [])

  const updateSatelliteParams = useCallback((alt: number, inc: number, raan: number) => {
    setSatAltitude(Math.min(LEO_CEILING_KM, Math.max(LEO_FLOOR_KM, alt)))
    setSatInclination(((inc % 360) + 360) % 360)
    setSatRaan(((raan % 360) + 360) % 360)
  }, [])

  const updateSatelliteEccentricity = useCallback((e: number) => {
    setSatEccentricity(Math.max(0, Math.min(0.9, e)))
  }, [])

  const decayAltitude = useCallback((amount: number) => {
    if (amount <= 0) return
    setSatAltitude((prev) => Math.max(LEO_FLOOR_KM, prev - amount))
  }, [])

  const boostBurn = useCallback((deltaKm: number) => {
    if (deltaKm <= 0) return
    setSatAltitude((prev) => Math.min(LEO_CEILING_KM, prev + deltaKm))
    setBoostCount((c) => c + 1)
  }, [])

  const addConjunctionAlert = useCallback((alert: Omit<ConjunctionAlert, "id">) => {
    setConjunctions((prev) => {
      // Check if this combination of satellite and secondary ID is already in the list
      const exists = prev.some(
        (c) => c.satelliteName === alert.satelliteName && c.secondaryId === alert.secondaryId
      )
      if (exists) return prev

      const newAlert = { ...alert, id: nextAlertId.current++ }
      const updated = [newAlert, ...prev].slice(0, 15) // Keep last 15 alerts

      // Update global risk level based on the highest risk in the feed
      const hasHigh = updated.some((c) => c.risk === "HIGH")
      const hasMedium = updated.some((c) => c.risk === "MEDIUM")
      if (hasHigh) setRiskLevel("HIGH")
      else if (hasMedium) setRiskLevel("MEDIUM")
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
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useAppState must be used within AppProvider")
  return ctx
}

export const LEO_LIMITS = { FLOOR: LEO_FLOOR_KM, CEILING: LEO_CEILING_KM }
