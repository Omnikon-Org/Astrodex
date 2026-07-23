"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { AppProvider, useAppState } from "@/lib/store"
import { Header } from "@/components/Header"
import { LeftSidebar } from "@/components/LeftSidebar"
import { RightSidebar } from "@/components/RightSidebar"
import { AgentTerminal } from "@/components/AgentTerminal"
import { AsteroidCard } from "@/components/AsteroidCard"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"

const Scene = dynamic(() => import("@/components/Scene").then((m) => ({ default: m.Scene })), {
  // The WebGL canvas relies on browser APIs, so keep it client-only and show
  // the lightweight spinner while the scene bundle loads.
  ssr: false,
  loading: () => <LoadingSkeleton />,
})

function MobileHudNav() {
  const {
    leftSidebarOpen,
    rightSidebarOpen,
    terminalExpanded,
    toggleLeftSidebar,
    toggleRightSidebar,
    toggleTerminal,
  } = useAppState()
  const showOnly = (panel: "targets" | "viewport" | "params") => {
    if (panel === "targets") {
      if (!leftSidebarOpen) toggleLeftSidebar()
      if (rightSidebarOpen) toggleRightSidebar()
      if (terminalExpanded) toggleTerminal()
    } else if (panel === "viewport") {
      if (leftSidebarOpen) toggleLeftSidebar()
      if (rightSidebarOpen) toggleRightSidebar()
      if (!terminalExpanded) toggleTerminal()
    } else {
      if (leftSidebarOpen) toggleLeftSidebar()
      if (!rightSidebarOpen) toggleRightSidebar()
      if (terminalExpanded) toggleTerminal()
    }
  }

  return (
    <nav className="mobile-hud-nav" aria-label="Mobile HUD panels">
      <button className={leftSidebarOpen ? "active" : ""} onClick={() => showOnly("targets")}>
        <span>Targets</span>
      </button>
      <button className={terminalExpanded ? "active" : ""} onClick={() => showOnly("viewport")}>
        <span>Viewport</span>
      </button>
      <button className={rightSidebarOpen ? "active" : ""} onClick={() => showOnly("params")}>
        <span>Params</span>
      </button>
    </nav>
  )
}

function HomeShell() {
  const [hudVisible, setHudVisible] = useState(true)

  return (
    <main
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "var(--scene-bg)",
      }}
    >
      {/* Background 3D Space Scene */}
      <Scene />

      {/* HUD UI Layout Components */}
      <Header hudVisible={hudVisible} onToggleHud={() => setHudVisible((visible) => !visible)} />
      {hudVisible && (
        <>
          <LeftSidebar />
          <RightSidebar />
          <AgentTerminal />
          <MobileHudNav />
          <AsteroidCard />
        </>
      )}
    </main>
  )
}

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
