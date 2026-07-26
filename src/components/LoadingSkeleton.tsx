/**
 * Loading skeleton displayed while the 3D Scene component is dynamically importing.
 * Provides immediate visual feedback to users during initial page load.
 * Respects user motion preferences for accessibility compliance.
 */

export function LoadingSkeleton() {
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
          className="loading-spinner"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            // The transparent top border creates the orbital sweep while the
            // shared `spin` keyframe rotates the full ring.
            border: "2px solid var(--accent-cyan)",
            borderTopColor: "transparent",
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
