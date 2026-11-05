import { describe, expect, it } from "vitest"
import { buildSpeedHistogram } from "@/components/SpeedHistogram"

describe("buildSpeedHistogram", () => {
  it("places speeds above 25 km/s in the overflow bin", () => {
    const bins = buildSpeedHistogram([
      { velocity: "4.99 km/s" },
      { velocity: "25.00 km/s" },
      { velocity: "31.42 km/s" },
    ])

    expect(bins.map((bin) => [bin.label, bin.count])).toEqual([
      ["0-5", 1],
      ["5-10", 0],
      ["10-15", 0],
      ["15-20", 0],
      ["20-25", 0],
      ["25+ km/s", 2],
    ])
  })
})
