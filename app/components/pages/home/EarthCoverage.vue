<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <radialGradient
        id="coverage-planet"
        gradientUnits="userSpaceOnUse"
        cx="420"
        cy="200"
        r="480"
      >
        <stop offset="0" stop-color="#1b3358" />
        <stop offset="0.45" stop-color="#0d1c36" />
        <stop offset="1" stop-color="#040812" />
      </radialGradient>
      <radialGradient id="coverage-vignette" cx="50%" cy="45%" r="75%">
        <stop offset="0.55" stop-color="#000" stop-opacity="0" />
        <stop offset="1" stop-color="#000" stop-opacity="0.7" />
      </radialGradient>
      <filter
        id="coverage-blur-sm"
        x="-10%"
        y="-10%"
        width="120%"
        height="120%"
      >
        <feGaussianBlur stdDeviation="1.5" />
      </filter>
      <filter
        id="coverage-blur-lg"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
      >
        <feGaussianBlur stdDeviation="8" />
      </filter>
    </defs>

    <g fill="none" stroke="#fff" stroke-linecap="round">
      <path :d="stars.dim" stroke-opacity="0.35" stroke-width="0.8" />
      <path :d="stars.bright" stroke-opacity="0.8" stroke-width="1.3" />
    </g>

    <circle
      v-bind="planet"
      fill="none"
      stroke="#38bdf8"
      stroke-opacity="0.5"
      stroke-width="10"
      filter="url(#coverage-blur-lg)"
    />
    <circle
      :cx="planet.cx"
      :cy="planet.cy"
      :r="planet.r + 16"
      fill="none"
      stroke="#a3e635"
      stroke-opacity="0.3"
      stroke-width="1.5"
      filter="url(#coverage-blur-sm)"
    />
    <circle v-bind="planet" fill="url(#coverage-planet)" />

    <g fill="#64748b" filter="url(#coverage-blur-lg)">
      <ellipse v-for="(cloud, index) in clouds" :key="index" v-bind="cloud" />
    </g>
    <g fill="#f59e0b" filter="url(#coverage-blur-lg)">
      <ellipse v-for="(glow, index) in glows" :key="index" v-bind="glow" />
    </g>

    <g fill="none" stroke-linecap="round">
      <path
        :d="lights.dim"
        stroke="#fcd34d"
        stroke-opacity="0.45"
        stroke-width="0.9"
      />
      <path
        :d="lights.mid"
        stroke="#fde68a"
        stroke-opacity="0.75"
        stroke-width="1.4"
      />
      <path
        :d="lights.bright"
        stroke="#fff7d6"
        stroke-opacity="0.95"
        stroke-width="2.1"
      />
    </g>

    <circle
      v-bind="planet"
      fill="none"
      stroke="#7dd3fc"
      stroke-opacity="0.6"
      stroke-width="1.2"
      filter="url(#coverage-blur-sm)"
    />
    <rect :width="width" :height="height" fill="url(#coverage-vignette)" />
  </svg>
</template>

<script setup lang="ts">
const width = 600
const height = 450
const planet = { cx: 420, cy: 1440, r: 1300 }

const createRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const random = createRandom(2024)
const spread = () => (random() + random() + random()) / 1.5 - 1
const round = (n: number) => Math.round(n * 10) / 10
const dot = (x: number, y: number) => `M${round(x)} ${round(y)}h0`

const horizonAt = (x: number) => {
  const dx = x - planet.cx
  return planet.cy - Math.sqrt(planet.r * planet.r - dx * dx)
}
const onPlanet = (x: number, y: number) =>
  x > 0 && x < width && y < height && y > horizonAt(x) + 8

const stars = { dim: '', bright: '' }
for (let i = 0; i < 90; i++) {
  const x = random() * width
  const y = random() * (horizonAt(x) - 10)
  stars[random() > 0.85 ? 'bright' : 'dim'] += dot(x, y)
}

const clouds = Array.from({ length: 10 }, () => {
  const x = random() * width
  const top = horizonAt(x) + 20
  const rx = 40 + random() * 70
  return {
    cx: round(x),
    cy: round(top + random() * (height - top)),
    rx: round(rx),
    ry: round(rx * (0.25 + random() * 0.15)),
    'fill-opacity': round(0.12 + random() * 0.16),
  }
})

const lights = { dim: '', mid: '', bright: '' }
const glows = Array.from({ length: 24 }, () => {
  const x = 10 + random() * 580
  const top = horizonAt(x) + 25
  const depth = random()
  const y = top + depth * (height - 10 - top)
  const sx = 12 + depth * 42
  const sy = sx * (0.3 + depth * 0.25)
  const count = Math.floor(20 + depth * 40 + random() * 15)

  for (let i = 0; i < count; i++) {
    const ox = spread()
    const oy = spread()
    const px = x + ox * sx * 1.8
    const py = y + oy * sy * 1.8
    if (!onPlanet(px, py)) continue
    const distance = Math.abs(ox) + Math.abs(oy)
    lights[distance < 0.35 ? 'bright' : distance < 0.9 ? 'mid' : 'dim'] += dot(
      px,
      py,
    )
  }

  return {
    cx: round(x),
    cy: round(y),
    rx: round(sx * 0.75),
    ry: round(sy * 0.75),
    'fill-opacity': round(0.15 + depth * 0.2),
  }
})

for (let i = 0; i < 320; i++) {
  const x = random() * width
  const top = horizonAt(x) + 10
  lights.dim += dot(x, top + random() * (height - top))
}
</script>
