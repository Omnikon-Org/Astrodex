import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const jetbrainsMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  variable: "--font-jetbrains-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "AstroDex — Interactive 3D Asteroid Explorer",
  description:
    "Explore 600+ asteroids orbiting Earth in real-time 3D. Track conjunctions, inspect orbital parameters, and claim discoveries in this cinematic space mission control.",
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
