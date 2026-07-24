export type ConjunctionMessage = {
  asteroids: Float32Array
  satellites: Float32Array
  asteroidIds: number[]
  threshold: number
}

self.onmessage = (e: MessageEvent<ConjunctionMessage>) => {
  const { asteroids, satellites, asteroidIds, threshold } = e.data
  const thresholdSq = threshold * threshold

  const alerts = []
  
  for (let i = 0; i < asteroids.length / 3; i++) {
    const ax = asteroids[i * 3]
    const ay = asteroids[i * 3 + 1]
    const az = asteroids[i * 3 + 2]

    let atRisk = false
    let minDistance = Infinity
    let closestSat = -1

    for (let s = 0; s < satellites.length / 3; s++) {
      const sx = satellites[s * 3]
      const sy = satellites[s * 3 + 1]
      const sz = satellites[s * 3 + 2]

      const dx = ax - sx
      const dy = ay - sy
      const dz = az - sz
      const distSq = dx * dx + dy * dy + dz * dz

      if (distSq < thresholdSq) {
        atRisk = true
        const dist = Math.sqrt(distSq)
        if (dist < minDistance) {
          minDistance = dist
          closestSat = s
        }
      }
    }

    if (atRisk) {
      alerts.push({
        index: i,
        id: asteroidIds[i],
        minDistance,
        closestSat,
      })
    }
  }

  self.postMessage(alerts)
}
