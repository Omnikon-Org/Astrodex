import { useEffect } from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Toasts } from "@/components/Toasts"
import { AppProvider, useAppState } from "@/lib/store"

function ToastSeeder() {
  const { addToast } = useAppState()

  useEffect(() => {
    addToast("Success toast message", "success")
    addToast("Error toast message", "error")
    addToast("Info toast message", "info")
  }, [addToast])

  return null
}

describe("Toasts", () => {
  it("uses high-contrast message text for every toast type", () => {
    render(
      <AppProvider>
        <ToastSeeder />
        <Toasts />
      </AppProvider>
    )

    expect(screen.getByText("Success toast message")).toHaveStyle({
      color: "var(--toast-text-high-contrast)",
    })
    expect(screen.getByText("Error toast message")).toHaveStyle({
      color: "var(--toast-text-high-contrast)",
    })
    expect(screen.getByText("Info toast message")).toHaveStyle({
      color: "var(--toast-text-high-contrast)",
    })
  })
})
