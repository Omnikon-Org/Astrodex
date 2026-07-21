"use client"

import { createContext, useContext, useState, useCallback, useRef, type ReactNode, useEffect } from "react"
import type { AsteroidData } from "./types"
import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

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
  user: User | null
  loginWithGithub: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  selectedAsteroid: AsteroidData | null
  claimedAsteroids: Set<number>
  selectAsteroid: (a: AsteroidData | null) => void
  claimAsteroid: (id: number) => void
  resetCamera: boolean
  triggerReset: () => void
  clearReset: () => void
  // Simulation
  simulationRunning: boolean
  toggleSimulation: () => void
  riskLevel: "HIGH" | "MEDIUM" | "LOW"
  // Panel toggles
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  terminalExpanded: boolean
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void
  toggleTerminal: () => void
  // Search by ID
  searchAsteroidById: (id: number) => void
  registerAsteroidData: (data: AsteroidData[]) => void

  // Space Debris Filters & Satellite Parameters
  filterType: "ALL" | "ASTEROIDS" | "DEBRIS"
  setFilterType: (f: "ALL" | "ASTEROIDS" | "DEBRIS") => void
  satAltitude: number
  satInclination: number
  satRaan: number
  satEccentricity: number
  updateSatelliteParams: (alt: number, inc: number, raan: number) => void
  updateSatelliteEccentricity: (e: number) => void
  /** Decrement the ISS altitude by `amount` km, clamped to the LEO floor. */
  decayAltitude: (amount: number) => void
  /** Inject Δv into the ISS to raise its altitude (counter-acts drag). */
  boostBurn: (deltaKm: number) => void
  /** Increments every time a boost burn fires — AgentTerminal watches this. */
  boostCount: number
  /** Increments every time a Δv budget is computed — AgentTerminal watches this. */
  deltaVCount: number
  triggerDeltaVLog: () => void
  conjunctions: ConjunctionAlert[]
  addConjunctionAlert: (alert: Omit<ConjunctionAlert, "id">) => void
  clearConjunctions: () => void
}

const AppContext = createContext<AppState | null>(null)

const LEO_FLOOR_KM = 180 // cannot decay below ~180 km (re-entry threshold)
const LEO_CEILING_KM = 500 // hard upper bound for user-set altitude

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Fetch initial claims
    supabase.from('claims').select('asteroid_id').then(({ data, error }) => {
      if (!error && data) {
        setClaimed(new Set(data.map(d => d.asteroid_id)))
      }
    })

    // Subscribe to realtime claims updates
    const claimsChannel = supabase.channel('claims_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, (payload) => {
        setClaimed((prev) => {
          const next = new Set(prev)
          if (payload.eventType === 'INSERT') {
            next.add(payload.new.asteroid_id)
          } else if (payload.eventType === 'DELETE') {
            next.delete(payload.old.asteroid_id)
          }
          return next
        })
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
      supabase.removeChannel(claimsChannel)
    }
  }, [])

  const loginWithGithub = useCallback(async () => {
    await supabase.auth.signInWithOAuth({ provider: 'github' })
  }, [])

  const loginWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const selectAsteroid = useCallback((a: AsteroidData | null) => setSelectedAsteroid(a), [])

  const claimAsteroid = useCallback(async (id: number) => {
    if (!user) return // Must be logged in

    const isClaiming = !claimedAsteroids.has(id)
    
    // Optimistic UI Update
    setClaimed((prev) => {
      const next = new Set(prev)
      if (isClaiming) next.add(id)
      else next.delete(id)
      return next
    })

    try {
      const { withTimeout } = await import('./supabase')
      
      if (isClaiming) {
        await withTimeout(
          supabase.from('claims').insert({ asteroid_id: id, user_id: user.id })
        )
      } else {
        await withTimeout(
          supabase.from('claims').delete().eq('asteroid_id', id).eq('user_id', user.id)
        )
      }
    } catch (error) {
      console.error("Failed to sync claim:", error)
      // Rollback Optimistic UI Update
      setClaimed((prev) => {
        const next = new Set(prev)
        if (isClaiming) next.delete(id)
        else next.add(id)
        return next
      })
    }
  }, [user, claimedAsteroids])

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
        user,
        loginWithGithub,
        loginWithGoogle,
        logout,
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
