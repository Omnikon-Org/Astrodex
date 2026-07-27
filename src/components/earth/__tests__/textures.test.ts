/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeAll } from "vitest"
import { createProceduralEarthTexture, createProceduralCloudTexture, createProceduralNightTexture, createProceduralSpecularTexture } from "../textures"

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillStyle: "",
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    ellipse: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    putImageData: vi.fn(),
    isPointInPath: vi.fn(() => true),
    createRadialGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    globalAlpha: 1,
  })) as any
})

describe("Canvas 2D Texture Pipeline", () => {
  it("validates that createProceduralEarthTexture returns a valid canvas", () => {
    const canvas = createProceduralEarthTexture()
    expect(canvas).toBeDefined()
    expect(canvas.width).toBeGreaterThan(0)
    expect(canvas.height).toBeGreaterThan(0)
  })

  it("validates that createProceduralCloudTexture returns a valid canvas", () => {
    const canvas = createProceduralCloudTexture()
    expect(canvas).toBeDefined()
    expect(canvas.width).toBeGreaterThan(0)
    expect(canvas.height).toBeGreaterThan(0)
  })

  it("validates that createProceduralNightTexture returns a valid canvas", () => {
    const canvas = createProceduralNightTexture()
    expect(canvas).toBeDefined()
    expect(canvas.width).toBeGreaterThan(0)
    expect(canvas.height).toBeGreaterThan(0)
  })

  it("validates that createProceduralSpecularTexture returns a valid canvas", () => {
    const canvas = createProceduralSpecularTexture()
    expect(canvas).toBeDefined()
    expect(canvas.width).toBeGreaterThan(0)
    expect(canvas.height).toBeGreaterThan(0)
  })
})
