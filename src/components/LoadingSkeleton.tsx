"use client"

/**
 * Loading skeleton displayed while the 3D Scene component is dynamically importing.
 * Provides immediate visual feedback to users during initial page load.
 * Respects user motion preferences for accessibility compliance.
 */

const SPINNER_ANIMATION_DURATION = "0.9s"

export function LoadingSkeleton() {
  // Respect user's motion preferences for accessibility
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-deep)",
        zIndex: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          className="animate-pulse-glow"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "2px solid var(--accent-cyan)",
            borderTopColor: "transparent",
            animation: prefersReducedMotion
              ? "none"
              : `spin ${SPINNER_ANIMATION_DURATION} linear infinite`,
          }}
        />
        <span
          style={{
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          Initializing Orbit Systems...
        </span>
      </div>
    </div>
  )
}
