"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/Header"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess("Successfully signed in! Access granted.")
    }
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess("Registration successful! Check your email to verify.")
    }
    setLoading(false)
  }

  return (
    <main
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        background: "#000005",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      
      {/* Dynamic Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.1) 0%, transparent 60%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          marginTop: "var(--header-height)",
          zIndex: 10,
        }}
      >
        <div
          className="glass-panel animate-fade-in-up"
          style={{
            width: "100%",
            maxWidth: 420,
            padding: "32px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            background: "rgba(10, 16, 28, 0.85)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "inline-block", padding: 12, background: "rgba(56, 189, 248, 0.1)", borderRadius: "50%", marginBottom: 16 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-primary)" }}>
              Agent Authentication
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
              Enter your credentials to access the Astrodex control network.
            </p>
          </div>

          <form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label htmlFor="email-input" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8, display: "block" }}>
                Operator Email
              </label>
              <input
                id="email-input"
                className="mc-input"
                type="email"
                placeholder="agent@omnikon.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ fontSize: 14, padding: "12px 14px" }}
              />
            </div>
            
            <div>
              <label htmlFor="password-input" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8, display: "block" }}>
                Passcode
              </label>
              <input
                id="password-input"
                className="mc-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ fontSize: 14, padding: "12px 14px", letterSpacing: "0.2em" }}
              />
            </div>

            <div aria-live="polite" aria-atomic="true">
              {error && (
                <div style={{ padding: "10px 12px", background: "rgba(248, 113, 113, 0.1)", borderLeft: "3px solid var(--accent-red)", color: "var(--accent-red)", fontSize: 12, borderRadius: 4 }}>
                  {error}
                </div>
              )}
              
              {success && (
                <div style={{ padding: "10px 12px", background: "rgba(52, 211, 153, 0.1)", borderLeft: "3px solid var(--accent-green)", color: "var(--accent-green)", fontSize: 12, borderRadius: 4 }}>
                  {success}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSignIn}
                disabled={loading}
                style={{ width: "100%", padding: "12px", fontSize: 13, fontWeight: 700 }}
              >
                {loading ? "AUTHENTICATING..." : "INITIATE LOGIN"}
              </button>
              
              <button
                type="button"
                className="btn-ghost"
                onClick={handleSignUp}
                disabled={loading}
                style={{ width: "100%", padding: "12px", fontSize: 12, opacity: 0.8 }}
              >
                REQUEST CLEARANCE (SIGN UP)
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
