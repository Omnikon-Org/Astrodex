import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { RightSidebar } from "../components/RightSidebar"
import { useAppState } from "../lib/store"

// Mock the store hook
vi.mock("../lib/store", () => ({
  useAppState: vi.fn(),
  LEO_LIMITS: { FLOOR: 180, CEILING: 500 }
}))

describe("RightSidebar Settings Modal", () => {
  const setTimeScaleMultiplier = vi.fn()

  const mockAppState = {
    rightSidebarOpen: true,
    toggleRightSidebar: vi.fn(),
    toggleSimulation: vi.fn(),
    simulationRunning: true,
    timeScaleMultiplier: 1,
    setTimeScaleMultiplier,
    triggerReset: vi.fn(),
    satAltitude: 400,
    satInclination: 51.6,
    satRaan: 0,
    satEccentricity: 0,
    updateSatelliteParams: vi.fn(),
    updateSatelliteEccentricity: vi.fn(),
    boostBurn: vi.fn(),
    selectedAsteroid: null,
    triggerDeltaVLog: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAppState as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockAppState)
  })

  it("renders correctly when open", () => {
    render(<RightSidebar />)
    expect(screen.getByText(/Telemetry/i)).toBeDefined()
  })

  it("calls boostBurn when boost button clicked", () => {
    render(<RightSidebar />)
    const boostBtn = screen.getByText(/Boost Burn/i)
    fireEvent.click(boostBtn)
    expect(mockAppState.boostBurn).toHaveBeenCalled()
  })

  it("announces simulation speed changes in a polite live region", () => {
    render(<RightSidebar />)

    fireEvent.click(screen.getByRole("button", { name: "10x" }))

    expect(setTimeScaleMultiplier).toHaveBeenCalledWith(10)
    expect(screen.getByRole("status")).toHaveTextContent("Simulation speed set to 10x")
  })
})
