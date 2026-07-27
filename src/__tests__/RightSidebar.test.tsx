import { render, screen, fireEvent } from "@testing-library/react"
import { RightSidebar } from "../components/RightSidebar"
import { useAppState } from "../lib/store"

// Mock the store hook
jest.mock("../lib/store", () => ({
  useAppState: jest.fn(),
  LEO_LIMITS: { FLOOR: 180, CEILING: 500 }
}))

describe("RightSidebar Settings Modal", () => {
  const mockAppState = {
    rightSidebarOpen: true,
    toggleRightSidebar: jest.fn(),
    satAltitude: 400,
    satInclination: 51.6,
    satRaan: 0,
    satEccentricity: 0,
    updateSatelliteParams: jest.fn(),
    updateSatelliteEccentricity: jest.fn(),
    boostBurn: jest.fn(),
    selectedAsteroid: null,
    triggerDeltaVLog: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAppState as jest.Mock).mockReturnValue(mockAppState)
  })

  it("renders correctly when open", () => {
    render(<RightSidebar />)
    expect(screen.getByText("Constraints")).toBeInTheDocument()
    expect(screen.getByText("Planner Constraints")).toBeInTheDocument()
    expect(screen.getByText("Manual Satellite (3D Orbit)")).toBeInTheDocument()
  })

  it("calls toggleRightSidebar when close button is clicked", () => {
    render(<RightSidebar />)
    // The ghost button has no text but it's the first button in the sidebar (or we can query by role if needed)
    const buttons = screen.getAllByRole("button")
    // Find the ghost button that closes the sidebar
    fireEvent.click(buttons[0])
    expect(mockAppState.toggleRightSidebar).toHaveBeenCalledTimes(1)
  })

  it("renders toggle button when closed", () => {
    ;(useAppState as jest.Mock).mockReturnValue({ ...mockAppState, rightSidebarOpen: false })
    render(<RightSidebar />)
    const toggleButton = screen.getByTitle("Show Constraints Panel")
    expect(toggleButton).toBeInTheDocument()
    fireEvent.click(toggleButton)
    expect(mockAppState.toggleRightSidebar).toHaveBeenCalledTimes(1)
  })

  it("applies new satellite trajectory when Apply Trajectory is clicked", () => {
    render(<RightSidebar />)
    const applyButton = screen.getByText("Apply Trajectory")
    fireEvent.click(applyButton)
    
    // Default values from state should be used
    expect(mockAppState.updateSatelliteParams).toHaveBeenCalledWith(400, 51.6, 0)
    expect(mockAppState.updateSatelliteEccentricity).toHaveBeenCalledWith(0)
  })

  it("calls boostBurn when Boost Burn is clicked", () => {
    render(<RightSidebar />)
    const boostButton = screen.getByText("Boost Burn (+50 km)")
    fireEvent.click(boostButton)
    
    expect(mockAppState.boostBurn).toHaveBeenCalledWith(50)
  })
})
