import type { Metadata } from "next"
import { Geist, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://astrodex.app'),
  title: {
    default: "AstroDex | Real-Time 3D Asteroid & Orbital Explorer",
    template: "%s | AstroDex"
  },
  description:
    "Explore 600+ asteroids and orbital debris in stunning real-time 3D. Track near-Earth conjunctions, inspect Keplerian orbital parameters, and file mining claims in a cinematic space mission control simulator.",
  keywords: ["Asteroid tracker", "3D Space", "Orbital mechanics", "Near-Earth objects", "WebGL space simulation", "Astrodex", "Space mission control"],
  authors: [{ name: "AstroDex Team" }],
  creator: "AstroDex",
  publisher: "AstroDex",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
