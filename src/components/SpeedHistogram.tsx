"use client"

import type { AsteroidData } from "@/lib/types"

export interface SpeedHistogramBin {
  label: string
  min: number
  max: number
  count: number
}

export const SPEED_HISTOGRAM_BUCKETS = [
  { label: "0-5", min: 0, max: 5 },
  { label: "5-10", min: 5, max: 10 },
  { label: "10-15", min: 10, max: 15 },
  { label: "15-20", min: 15, max: 20 },
  { label: "20-25", min: 20, max: 25 },
  { label: "25+ km/s", min: 25, max: Infinity },
] as const

export function parseVelocityKmPerSecond(velocity: string): number {
  const speed = Number.parseFloat(velocity)
  return Number.isFinite(speed) ? Math.max(0, speed) : 0
}

export function buildSpeedHistogram(objects: Pick<AsteroidData, "velocity">[]): SpeedHistogramBin[] {
  const bins = SPEED_HISTOGRAM_BUCKETS.map((bucket) => ({ ...bucket, count: 0 }))

  for (const object of objects) {
    const speed = parseVelocityKmPerSecond(object.velocity)
    const binIndex = Math.min(Math.floor(speed / 5), bins.length - 1)
    bins[binIndex].count += 1
  }

  return bins
}

export function SpeedHistogram({ objects }: { objects: Pick<AsteroidData, "velocity">[] }) {
  const bins = buildSpeedHistogram(objects)
  const maxCount = Math.max(...bins.map((bin) => bin.count), 1)

  return (
    <section
      className="bg-[rgba(255,255,255,0.02)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-[12px]"
      aria-labelledby="speed-histogram-heading"
    >
      <div
        id="speed-histogram-heading"
        className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--text-secondary)] mb-[10px]"
      >
        Speed Distribution
      </div>
      <div style={{ display: "grid", gap: 7 }}>
        {bins.map((bin) => {
          const width = `${Math.max((bin.count / maxCount) * 100, bin.count > 0 ? 6 : 0)}%`

          return (
            <div key={bin.label} style={{ display: "grid", gridTemplateColumns: "64px 1fr 28px", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono), monospace" }}>
                {bin.label}
              </span>
              <div style={{ height: 8, background: "var(--bg-input)", borderRadius: 999, overflow: "hidden" }}>
                <div
                  style={{
                    width,
                    height: "100%",
                    background: bin.label === "25+ km/s" ? "var(--accent-amber)" : "var(--accent-cyan)",
                    borderRadius: 999,
                  }}
                />
              </div>
              <span style={{ fontSize: 9, color: "var(--text-secondary)", fontFamily: "var(--font-mono), monospace", textAlign: "right" }}>
                {bin.count}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
