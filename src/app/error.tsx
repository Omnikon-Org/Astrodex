"use client"

import { useEffect } from "react"
import { IconAlertTriangle } from "@tabler/icons-react"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("React Error Boundary caught an error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-[var(--text-primary)] font-mono p-4">
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 max-w-md text-center shadow-xl">
        <IconAlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">A critical system error occurred</h2>
        <p className="text-sm text-gray-400 mb-6">
          {error.message || "The astrodex interface encountered an unexpected fault."}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors text-sm font-semibold uppercase tracking-wider"
        >
          Reboot System
        </button>
      </div>
    </div>
  )
}
