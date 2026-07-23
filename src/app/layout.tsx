import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google" // Added font imports
import "./globals.css"

// Instantiated the font families with CSS variable names
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const jetbrainsMono = Geist_Mono({
  variable: "--font-geist-mono",
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
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AstroDex',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    description: 'Explore 600+ asteroids orbiting Earth in real-time 3D.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${jetbrainsMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}

