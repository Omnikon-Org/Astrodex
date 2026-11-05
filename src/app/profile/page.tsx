
// Fixed #1597: Implemented user profile page route /profile listing user claimed asteroids.
"use client"
import Link from "next/link"
import { useAppState } from "@/lib/store"
export default function ProfilePage() {
  const { claimedAsteroids, claimHistory } = useAppState()
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)",
        color: "var(--text-primary)",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.05em", color: "var(--accent-cyan)" }}>
            Commander Profile
          </h1>
          <Link href="/" className="btn-ghost" style={{ padding: "8px 16px", textDecoration: "none", color: "var(--text-secondary)" }}>
            ← Return to Mission Control
          </Link>
        </div>
        <div className="glass-panel" style={{ padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: "var(--text-primary)" }}>Stats Overview</h2>
          <div style={{ display: "flex", gap: 24 }}>
            <div className="panel-section" style={{ flex: 1, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "var(--accent-green)" }}>
                {claimedAsteroids.size}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 8 }}>
                Secured Claims
              </div>
            </div>
            <div className="panel-section" style={{ flex: 1, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "var(--accent-cyan)" }}>
                {claimHistory?.length || 0}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 8 }}>
                Total Actions
              </div>
            </div>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: "var(--text-primary)" }}>Recent Activity</h2>
          {(!claimHistory || claimHistory.length === 0) ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No activity yet. Return to the map to claim your first asteroid.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {claimHistory.slice(-10).reverse().map((entry, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "var(--radius-sm)" }}>
                  <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                    Asteroid <strong style={{ color: "var(--accent-cyan)" }}>#{entry.id}</strong>
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 12, color: entry.action === "CLAIMED" ? "var(--accent-green)" : "var(--accent-red)", fontWeight: 600 }}>
                      {entry.action}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {entry.timestamp.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
