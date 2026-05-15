<script setup lang="ts">
const W = 390
const H = 844
const primary = '#c0392b'
const gold = '#b5952a'
const ink = '#1a0d08'

function petalPath(cx: number, cy: number, r: number, rot: number): string {
  const rad = (rot * Math.PI) / 180
  const px = Math.cos(rad) * r * 1.1
  const py = Math.sin(rad) * r * 1.1
  const c1x = Math.cos(rad - 0.5) * r * 0.6
  const c1y = Math.sin(rad - 0.5) * r * 0.6
  const c2x = Math.cos(rad + 0.5) * r * 0.6
  const c2y = Math.sin(rad + 0.5) * r * 0.6
  return `M ${cx},${cy} C ${cx + c1x},${cy + c1y} ${cx + px * 0.8},${cy + py * 0.8} ${cx + px},${cy + py} C ${cx + px * 0.8},${cy + py * 0.8} ${cx + c2x},${cy + c2y} ${cx},${cy}`
}

function wavePath(y: number): string {
  const segs = Math.ceil(W / 28)
  let d = `M 0,${y}`
  for (let i = 0; i < segs; i++) {
    const x0 = i * 28
    d += ` Q ${x0 + 7},${y - 8} ${x0 + 14},${y} Q ${x0 + 21},${y + 8} ${x0 + 28},${y}`
  }
  return d
}

const flowers = [
  { cx: -10,       cy: 90,       r: 38, opacity: 0.09, color: primary, a: 15  },
  { cx: W + 8,     cy: 200,      r: 32, opacity: 0.10, color: primary, a: -20 },
  { cx: 20,        cy: H - 80,   r: 28, opacity: 0.08, color: primary, a: 40  },
  { cx: W - 15,    cy: H - 160,  r: 36, opacity: 0.09, color: primary, a: -10 },
  { cx: 60,        cy: 170,      r: 9,  opacity: 0.14, color: primary, a: 30  },
  { cx: W - 55,    cy: 130,      r: 7,  opacity: 0.13, color: primary, a: -45 },
  { cx: 110,       cy: H - 130,  r: 8,  opacity: 0.12, color: primary, a: 20  },
  { cx: W - 80,    cy: H - 90,   r: 10, opacity: 0.14, color: primary, a: 55  },
  { cx: W / 2 - 30, cy: 50,      r: 6,  opacity: 0.10, color: primary, a: 0   },
  { cx: W / 2 + 60, cy: H - 50,  r: 7,  opacity: 0.10, color: gold,    a: -30 },
  { cx: 30,        cy: H / 2,    r: 6,  opacity: 0.09, color: primary, a: 10  },
  { cx: W - 28,    cy: H / 2 + 60, r: 8, opacity: 0.10, color: gold,   a: -15 },
]

const w1 = wavePath(H * 0.72)
const w2 = wavePath(H * 0.74)
const w3 = wavePath(H * 0.12)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 390 844"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:-1;overflow:hidden"
  >
    <!-- Fleurs de sakura -->
    <g
      v-for="(f, i) in flowers"
      :key="i"
      :opacity="f.opacity"
      :transform="`rotate(${f.a}, ${f.cx}, ${f.cy})`"
    >
      <path
        v-for="ang in [0, 72, 144, 216, 288]"
        :key="ang"
        :d="petalPath(f.cx, f.cy, f.r, ang)"
        :fill="f.color"
      />
      <circle :cx="f.cx" :cy="f.cy" :r="f.r * 0.22" fill="#b5952a" opacity="0.7" />
    </g>

    <!-- Lignes de vagues -->
    <path :d="w1" :stroke="primary" stroke-width="1" fill="none" opacity="0.07" />
    <path :d="w2" :stroke="primary" stroke-width="1" fill="none" opacity="0.05" />
    <path :d="w3" :stroke="gold"    stroke-width="1" fill="none" opacity="0.07" />

    <!-- Traits pinceaux verticaux -->
    <line x1="18"    y1="40"        x2="12"    :y2="H * 0.45" :stroke="ink" stroke-width="5" stroke-linecap="round" opacity="0.035" />
    <line :x1="W-16" :y1="H * 0.3"  :x2="W-22" :y2="H * 0.8"  :stroke="ink" stroke-width="4" stroke-linecap="round" opacity="0.03"  />

    <!-- Nuages kumo -->
    <g :transform="`translate(${W * 0.15}, ${H * 0.35}) scale(0.8)`" opacity="0.05">
      <ellipse rx="22" ry="10"                     :fill="primary" />
      <ellipse cx="-12" cy="-5" rx="13" ry="9"    :fill="primary" />
      <ellipse cx="12"  cy="-5" rx="13" ry="9"    :fill="primary" />
      <ellipse          cy="-10" rx="10" ry="8"   :fill="primary" />
    </g>
    <g :transform="`translate(${W * 0.82}, ${H * 0.55})`" opacity="0.05">
      <ellipse rx="22" ry="10"                     :fill="primary" />
      <ellipse cx="-12" cy="-5" rx="13" ry="9"    :fill="primary" />
      <ellipse cx="12"  cy="-5" rx="13" ry="9"    :fill="primary" />
      <ellipse          cy="-10" rx="10" ry="8"   :fill="primary" />
    </g>

    <!-- Kanji discrets -->
    <text :x="W - 20" :y="H * 0.45" font-size="52" font-family="'Noto Serif JP', serif" :fill="ink"     opacity="0.03" style="user-select:none">花</text>
    <text x="8"       :y="H * 0.62" font-size="44" font-family="'Noto Serif JP', serif" :fill="primary" opacity="0.04" style="user-select:none">春</text>
    <text :x="W - 22" :y="H * 0.25" font-size="36" font-family="'Noto Serif JP', serif" :fill="gold"    opacity="0.05" style="user-select:none">食</text>

    <!-- Cercle enso -->
    <circle
      :cx="W / 2" :cy="H / 2" :r="H * 0.38"
      :stroke="primary" stroke-width="0.8" fill="none"
      opacity="0.025" stroke-dasharray="4 6"
    />
  </svg>
</template>
