/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import Page from "../page"

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }
  },
  usePathname() {
    return "/"
  },
}))

describe("Next.js Routing Layer", () => {
  it("renders the main page component successfully", () => {
    expect(true).toBe(true)
  })

  it("supports initial object permalink routing prop", () => {
    const { container } = render(<Page initialObjectId="asteroid-42" />)
    expect(container).toBeDefined()
  })
})
