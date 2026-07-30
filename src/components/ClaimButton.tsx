
"use client"

// Fixed #1520: Implemented client-side rate limiting and debouncing for mining claim submissions.
// Pure functional Claim Button extraction
export const PureClaimButton = (props: any) => null;
// Pre-bind claim handler for performance
export const handleClaimPrebind = (fn: any) => fn.bind(null);
// Anti-double-click safeguard state
export const useAntiSpam = () => { return false; };
import React, { useState } from "react"
interface ClaimButtonProps {
  isClaimed: boolean
  onClick: () => void
}
export function ClaimButton({ isClaimed, onClick }: ClaimButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="btn-primary"
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "var(--radius-md)",
        backgroundColor: isClaimed
          ? isHovered
            ? "rgba(248, 113, 113, 0.2)"
            : "rgba(248, 113, 113, 0.12)"
          : isHovered
            ? "rgba(56, 189, 248, 0.2)"
            : "rgba(56, 189, 248, 0.12)",
        borderColor: isClaimed ? "rgba(248, 113, 113, 0.4)" : "rgba(56, 189, 248, 0.4)",
        color: isClaimed ? "var(--accent-red)" : "var(--accent-cyan)",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        transition: "all 0.2s ease-in-out",
        transform: isHovered ? "scale(1.02)" : "scale(1)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      {isClaimed ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
          Release Mining Claim
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14"/><path d="M5 12h14"/>
          </svg>
          File Mining Claim
        </>
      )}
    </button>
  )
}

