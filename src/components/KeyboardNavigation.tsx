"use client"

import { useEffect } from "react"
import { useAppState } from "@/lib/store"

export function KeyboardNavigation() {
  const { selectNextAsteroid, selectPrevAsteroid, triggerReset } = useAppState()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input field
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return
      }

      switch (e.key) {
        case "ArrowRight":
        case "d":
          e.preventDefault()
          selectNextAsteroid()
          break
        case "ArrowLeft":
        case "a":
          e.preventDefault()
          selectPrevAsteroid()
          break
        case "Escape":
          e.preventDefault()
          triggerReset()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectNextAsteroid, selectPrevAsteroid, triggerReset])

  return null
}
