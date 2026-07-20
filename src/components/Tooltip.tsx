import React, { ReactNode } from "react"

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: "top" | "bottom" | "left" | "right"
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={`absolute z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 
        whitespace-nowrap px-2 py-1 bg-black/90 text-[var(--text-primary)] text-xs rounded border border-[var(--border-subtle)] shadow-lg pointer-events-none 
        ${positionClasses[position]}`}
      >
        {content}
      </div>
    </div>
  )
}
