// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { afterEach } from "vitest"
import { AsteroidCard } from "../AsteroidCard"

// Mock the global store
const mockUseAppState = vi.fn()
vi.mock("@/lib/store", () => ({
  useAppState: () => mockUseAppState(),
}))

describe("AsteroidCard", () => {
  afterEach(cleanup)

  it("does not render when no asteroid is selected", () => {
    mockUseAppState.mockReturnValue({
      selectedAsteroid: null,
    })
    const { container } = render(<AsteroidCard />)
    expect(container.firstChild).toBeNull()
  })

  it("renders the asteroid details when one is selected", () => {
    mockUseAppState.mockReturnValue({
      selectedAsteroid: { id: 1, name: "Ceres", isDebris: false, velocity: "10 km/s", size: 100, mass: 50, orbitRadius: 2, eccentricity: 0, inclination: 0, argPeriapsis: 0, meanAnomaly0: 0 },
      claimedAsteroids: new Set(),
      leftSidebarOpen: false,
    })
    render(<AsteroidCard />)
    expect(screen.getByText(/Ceres/)).toBeTruthy()
    expect(screen.getByText("Object Velocity")).toBeTruthy()
  })

  it("calls claimAsteroid when the claim button is clicked", () => {
    const mockClaimAsteroid = vi.fn()
    mockUseAppState.mockReturnValue({
      selectedAsteroid: { id: 1, name: "Ceres", isDebris: false, velocity: "10 km/s", size: 100, mass: 50, orbitRadius: 2, eccentricity: 0, inclination: 0, argPeriapsis: 0, meanAnomaly0: 0 },
      claimedAsteroids: new Set(),
      leftSidebarOpen: false,
      claimAsteroid: mockClaimAsteroid,
    })
    render(<AsteroidCard />)
    const button = screen.getByText("File Mining Claim")
    fireEvent.click(button)
    expect(mockClaimAsteroid).toHaveBeenCalledWith(1)
  })
})
