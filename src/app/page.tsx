"use client"

import dynamic from "next/dynamic"
import { AppProvider } from "@/lib/store"
import { Header } from "@/components/Header"
import { LeftSidebar } from "@/components/LeftSidebar"
import { RightSidebar } from "@/components/RightSidebar"
import { AgentTerminal } from "@/components/AgentTerminal"
import { AsteroidCard } from "@/components/AsteroidCard"
import { Toasts } from "@/components/Toasts"
import { KeyboardNavigation } from "@/components/KeyboardNavigation"

const Scene = dynamic(() => import("@/components/Scene").then((m) => ({ default: m.Scene })), {
  ssr: false,
})

import { useEffect } from "react"
import { useAppState } from "@/lib/store"

export default function Home({ initialObjectId }: { initialObjectId?: string | null }) {
  const { setFocusedObjectId } = useAppState()

  useEffect(() => {
    if (initialObjectId) {
      setFocusedObjectId(initialObjectId)
    }
  }, [initialObjectId, setFocusedObjectId])

  return (
    <main
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#000005",
      }}
    >
      {/* Background 3D Space Scene */}
      <Scene />

      {/* HUD UI Layout Components */}
      <Header />
      <LeftSidebar />
      <RightSidebar />
      <AgentTerminal />
      <Toasts />
      
      {/* Floating Asteroid Inspector */}
      <AsteroidCard />
      
      {/* Global Keyboard Navigation */}
      <KeyboardNavigation />
    </main>
  )
}
