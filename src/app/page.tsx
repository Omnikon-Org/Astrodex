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
.catch(err => console.error(err))