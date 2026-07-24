"use client"

import { ErrorBoundary, FallbackProps } from "react-error-boundary"

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black/90 p-6 text-red-500 backdrop-blur-md">
      <h2 className="mb-4 text-2xl font-bold uppercase tracking-wider text-red-400">
        System Failure
      </h2>
      <div className="max-w-xl overflow-auto rounded border border-red-500/30 bg-red-950/20 p-4 font-mono text-sm">
        <p className="mb-2 font-bold">Error in 3D Canvas:</p>
        <p className="text-red-300">{errorMessage}</p>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="mt-6 rounded border border-red-500/50 bg-red-950/50 px-6 py-2 uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500 hover:text-white"
      >
        Reboot System
      </button>
    </div>
  )
}

export function CanvasErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  )
}
