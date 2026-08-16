import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Header } from "../components/Header"
import { useAppState } from "../lib/store"

vi.mock("../lib/store", () => ({
  useAppState: vi.fn(),
}))

vi.mock("../components/UserProfileModal", () => ({
  UserProfileModal: () => null,
}))

describe("Header camera announcements", () => {
  it("renders camera target changes in a polite live region", () => {
    ;(useAppState as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      simulationRunning: true,
      toggleSimulation: vi.fn(),
      riskLevel: "LOW",
      triggerReset: vi.fn(),
      selectedAsteroid: null,
      cameraAnnouncement: "Camera focused on AST-0042.",
    })

    render(<Header />)

    const status = screen.getByRole("status")
    expect(status).toHaveAttribute("aria-live", "polite")
    expect(status).toHaveTextContent("Camera focused on AST-0042.")
  })
})
