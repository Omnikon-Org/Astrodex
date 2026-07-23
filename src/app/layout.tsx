import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s | AstroDex",
    default: "AstroDex — Interactive 3D Asteroid Explorer",
  },
  description:
    "Explore 600+ asteroids orbiting Earth in real-time 3D. Track conjunctions, inspect orbital parameters, and claim discoveries in this cinematic space mission control.",
  keywords: ["Asteroid tracker", "3D Space", "Orbital mechanics", "Near-Earth objects", "WebGL space simulation", "Astrodex", "Space mission control"],
  authors: [{ name: "AstroDex Team" }],
  creator: "AstroDex",
  publisher: "AstroDex",
  alternates: {
    canonical: 'https://astrodex.app',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AstroDex",
    description: "Explore 600+ asteroids orbiting Earth in real-time 3D.",
    url: "https://astrodex.example.com",
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
