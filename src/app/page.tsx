"use client"

import dynamic from "next/dynamic"
import { AppProvider } from "@/lib/store"
import { Header } from "@/components/Header"
import { LeftSidebar } from "@/components/LeftSidebar"
import { RightSidebar } from "@/components/RightSidebar"
import { AgentTerminal } from "@/components/AgentTerminal"
import { AsteroidCard } from "@/components/AsteroidCard"

const Scene = dynamic(() => import("@/components/Scene").then((m) => ({ default: m.Scene })), {
  ssr: false,
})

export default function Home() {
  return (
    <AppProvider>
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
        
        {/* Floating Asteroid Inspector */}
        <AsteroidCard />
      </main>
    </AppProvider>
  )
}
