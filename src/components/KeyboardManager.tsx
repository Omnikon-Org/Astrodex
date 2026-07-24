"use client"

import { useEffect } from "react"
import { useAppState } from "@/lib/store"

export function KeyboardManager() {
  const { toggleSimulation, toggleTerminal, toggleLeftSidebar, toggleRightSidebar } = useAppState()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      switch (e.code) {
        case "Space":
          e.preventDefault()
          toggleSimulation()
          break
        case "Backquote": // The ` key
          e.preventDefault()
          toggleTerminal()
          break
        case "BracketLeft":
          toggleLeftSidebar()
          break
        case "BracketRight":
          toggleRightSidebar()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSimulation, toggleTerminal, toggleLeftSidebar, toggleRightSidebar])

  return null
}
