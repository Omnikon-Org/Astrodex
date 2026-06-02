export function createProceduralEarthTexture(): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext("2d")!
  const w = canvas.width
  const h = canvas.height

  // Deep ocean base
  ctx.fillStyle = "#1a3d6b"
  ctx.fillRect(0, 0, w, h)

  // Add subtle ocean variation
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const rx = 50 + Math.random() * 200
    const ry = 20 + Math.random() * 80
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(20, 50, 90, ${0.1 + Math.random() * 0.2})`
    ctx.fill()
  }

  // Continent shapes
  const continents = [
    // North America
    { x: 0.2, y: 0.35, points: [[0,0],[0.06,-0.08],[0.12,-0.06],[0.16,0],[0.14,0.06],[0.1,0.1],[0.04,0.08],[0,0.04]] },
    // South America
    { x: 0.28, y: 0.55, points: [[0,0],[0.04,-0.06],[0.08,-0.04],[0.08,0.02],[0.06,0.08],[0.02,0.1],[0,0.06]] },
    // Europe
    { x: 0.47, y: 0.32, points: [[0,0],[0.04,-0.04],[0.08,-0.02],[0.08,0.02],[0.04,0.04],[0,0.03]] },
    // Africa
    { x: 0.48, y: 0.48, points: [[0,0],[0.04,-0.06],[0.08,-0.04],[0.1,0],[0.08,0.06],[0.04,0.1],[0,0.08]] },
    // Asia
    { x: 0.6, y: 0.3, points: [[0,0],[0.06,-0.06],[0.14,-0.08],[0.2,-0.04],[0.22,0.02],[0.18,0.08],[0.1,0.1],[0.04,0.06]] },
    // Australia
    { x: 0.8, y: 0.6, points: [[0,0],[0.05,-0.03],[0.08,0],[0.06,0.04],[0.02,0.05]] },
    // India
    { x: 0.63, y: 0.42, points: [[0,0],[0.03,-0.04],[0.05,-0.02],[0.05,0.02],[0.02,0.04]] },
  ]

  for (const cont of continents) {
    const cx = cont.x * w
    const cy = cont.y * h

    // Main landmass
    ctx.beginPath()
    const pts = cont.points
    ctx.moveTo(cx + pts[0][0] * w, cy + pts[0][1] * w)
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(cx + pts[i][0] * w, cy + pts[i][1] * w)
    }
    ctx.closePath()
    const green = 50 + Math.floor(Math.random() * 60)
    ctx.fillStyle = `rgb(25, ${green}, 25)`
    ctx.fill()

    // Add some terrain variation
    const bound = ctx.getImageData(
      Math.max(0, cx - 0.12 * w),
      Math.max(0, cy - 0.12 * w),
      Math.min(w, 0.24 * w),
      Math.min(h, 0.24 * w)
    )
    for (let i = 0; i < 80; i++) {
      const tx = cx + (Math.random() - 0.5) * 0.2 * w
      const ty = cy + (Math.random() - 0.5) * 0.2 * w
      if (ctx.isPointInPath(tx, ty)) {
        ctx.fillStyle = `rgba(40, ${80 + Math.floor(Math.random() * 60)}, 30, ${0.3 + Math.random() * 0.4})`
        ctx.beginPath()
        ctx.arc(tx, ty, 3 + Math.random() * 12, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  // Desert areas
  for (let i = 0; i < 15; i++) {
    const x = (0.4 + Math.random() * 0.2) * w
    const y = (0.42 + Math.random() * 0.12) * h
    ctx.beginPath()
    ctx.ellipse(x, y, 15 + Math.random() * 40, 8 + Math.random() * 20, 0, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(180, 160, 100, ${0.2 + Math.random() * 0.3})`
    ctx.fill()
  }

  // Ice caps
  ctx.fillStyle = "rgba(220, 230, 240, 0.5)"
  ctx.fillRect(0, 0, w, h * 0.05)
  ctx.fillRect(0, h * 0.93, w, h * 0.07)

  return canvas
}

export function createProceduralNightTexture(): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext("2d")!
  const w = canvas.width
  const h = canvas.height

  ctx.fillStyle = "#000510"
  ctx.fillRect(0, 0, w, h)

  // City clusters
  const cities = [
    // US East Coast
    { x: 0.22, y: 0.38, r: 60 },
    // US West Coast
    { x: 0.16, y: 0.36, r: 40 },
    // Europe
    { x: 0.48, y: 0.34, r: 50 },
    // UK
    { x: 0.46, y: 0.30, r: 25 },
    // Japan
    { x: 0.78, y: 0.36, r: 40 },
    // China coast
    { x: 0.72, y: 0.34, r: 50 },
    // India
    { x: 0.63, y: 0.4, r: 35 },
    // SE Asia
    { x: 0.74, y: 0.44, r: 30 },
    // Brazil coast
    { x: 0.3, y: 0.58, r: 40 },
    // Australia east
    { x: 0.84, y: 0.58, r: 30 },
    // Middle East
    { x: 0.55, y: 0.4, r: 25 },
    // South Africa
    { x: 0.52, y: 0.58, r: 20 },
  ]

  for (const city of cities) {
    const cx = city.x * w
    const cy = city.y * h
    const r = city.r

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * r
      const px = cx + Math.cos(angle) * dist
      const py = cy + Math.sin(angle) * dist
      const size = 1 + Math.random() * 3
      const bright = 0.3 + Math.random() * 0.7
      ctx.beginPath()
      ctx.arc(px, py, size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 200, 100, ${bright})`
      ctx.fill()
    }

    // City glow
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.5)
    grad.addColorStop(0, `rgba(255, 180, 80, 0.15)`)
    grad.addColorStop(0.5, `rgba(255, 150, 50, 0.05)`)
    grad.addColorStop(1, `rgba(255, 100, 30, 0)`)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2)
    ctx.fill()
  }

  // Scattered lights
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const size = 0.5 + Math.random() * 1.5
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 200, 80, ${0.1 + Math.random() * 0.3})`
    ctx.fill()
  }

  return canvas
}

export function createProceduralSpecularTexture(): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext("2d")!
  const w = canvas.width
  const h = canvas.height

  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, w, h)

  // Ocean areas - specular highlights
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const rx = 40 + Math.random() * 180
    const ry = 15 + Math.random() * 60
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2)
    const val = 40 + Math.floor(Math.random() * 80)
    ctx.fillStyle = `rgb(${val}, ${val}, ${val})`
    ctx.fill()
  }

  return canvas
}

export function createProceduralCloudTexture(): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext("2d")!
  const w = canvas.width
  const h = canvas.height

  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, w, h)

  // Cloud bands
  for (let band = 0; band < 8; band++) {
    const cy = (0.15 + band * 0.1) * h + (Math.random() - 0.5) * 0.05 * h
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * w
      const y = cy + (Math.random() - 0.5) * 0.06 * h
      const rx = 20 + Math.random() * 100
      const ry = 5 + Math.random() * 20
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, Math.random() * 0.5, 0, Math.PI * 2)
      const alpha = 0.1 + Math.random() * 0.35
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.fill()
    }
  }

  // Storm systems
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const r = 20 + Math.random() * 60
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, "rgba(255, 255, 255, 0.4)")
    grad.addColorStop(0.5, "rgba(255, 255, 255, 0.15)")
    grad.addColorStop(1, "rgba(255, 255, 255, 0)")
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  return canvas
}
