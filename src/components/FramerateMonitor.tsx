"use client"

import { Stats } from "@react-three/drei"
import { useEffect, useState } from "react"

export function FramerateMonitor() {
  const [mounted, setMounted] = useState(false)

  // Edge case fix: Ensure it only mounts on the client and doesn't cause hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <Stats className="framerate-monitor" />
}
