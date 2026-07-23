import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s | AstroDex",
    default: "AstroDex — Interactive 3D Asteroid Explorer",
  },
  description:
    "Explore 600+ asteroids orbiting Earth in real-time 3D. Track conjunctions, inspect orbital parameters, and claim discoveries in this cinematic space mission control.",
  openGraph: {
    title: "AstroDex — Interactive 3D Asteroid Explorer",
    description: "Explore 600+ asteroids orbiting Earth in real-time 3D. Track conjunctions, inspect orbital parameters, and claim discoveries in this cinematic space mission control.",
    url: "https://astrodex.example.com",
    siteName: "AstroDex",
    images: [
      {
        url: "https://astrodex.example.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AstroDex 3D Scene",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AstroDex — Interactive 3D Asteroid Explorer",
    description: "Explore 600+ asteroids orbiting Earth in real-time 3D.",
    images: ["https://astrodex.example.com/og-image.jpg"],
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
