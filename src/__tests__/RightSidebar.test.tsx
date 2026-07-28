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
  const mockAppState = {
    rightSidebarOpen: true,
    toggleRightSidebar: vi.fn(),
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
    const boostBtn = screen.getByText(/Execute Prograde/i)
    fireEvent.click(boostBtn)
    expect(mockAppState.boostBurn).toHaveBeenCalled()
  })
})
