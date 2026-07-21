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
  title: "AstroDex — Interactive 3D Asteroid Explorer",
  description:
    "Explore 600+ asteroids orbiting Earth in real-time 3D. Track conjunctions, inspect orbital parameters, and claim discoveries in this cinematic space mission control.",
  openGraph: {
    title: "AstroDex — Interactive 3D Asteroid Explorer",
    description:
      "Explore 600+ asteroids orbiting Earth in real-time 3D. Track conjunctions, inspect orbital parameters, and claim discoveries in this cinematic space mission control.",
    url: "https://astrodex.app",
    siteName: "AstroDex",
    images: [
      {
        url: "https://astrodex.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AstroDex 3D Asteroid Explorer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AstroDex — Interactive 3D Asteroid Explorer",
    description: "Explore 600+ asteroids orbiting Earth in real-time 3D.",
    images: ["https://astrodex.app/og-image.jpg"],
  },
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
