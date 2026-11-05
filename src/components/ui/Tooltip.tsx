import { ReactNode } from "react"

interface TooltipProps {
  content: string
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-cyan-900/90 px-2 py-1 text-xs text-cyan-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {content}
        <div className="absolute left-1/2 top-full -mt-px -translate-x-1/2 border-4 border-transparent border-t-cyan-900/90" />
      </div>
    </div>
  )
}
