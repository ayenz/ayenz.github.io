<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import maskUrl from '../assets/land-mask.png'
import region from '../assets/land-region.json'
import { stops, isDemo, totalKm, cities } from '../route.js'

const root = ref(null)
const board = ref(null)
const canvas = ref(null)
const dims = ref({ w: 1000, h: 600 })
const hover = ref(-1)
let mm, mask, onResize

// Equirectangular window around the stops, padded and matched to the board's aspect ratio.
const view = computed(() => {
  const lats = stops.map((s) => s.loc[0]), lngs = stops.map((s) => s.loc[1])
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2
  const k = Math.cos((midLat * Math.PI) / 180)
  let spanLat = Math.max(Math.max(...lats) - Math.min(...lats), 0.5) * 1.3 + 0.6
  let spanLng = Math.max(Math.max(...lngs) - Math.min(...lngs), 0.5) * 1.3 + 0.6
  const aspect = dims.value.w / dims.value.h
  if ((spanLng * k) / spanLat < aspect) spanLng = (spanLat * aspect) / k
  else spanLat = (spanLng * k) / aspect
  const cLat = midLat, cLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
  return { n: cLat + spanLat / 2, s: cLat - spanLat / 2, w: cLng - spanLng / 2, e: cLng + spanLng / 2 }
})

const project = ([lat, lng]) => {
  const v = view.value
  return { x: ((lng - v.w) / (v.e - v.w)) * dims.value.w, y: ((v.n - lat) / (v.n - v.s)) * dims.value.h }
}

// One pin per place (labelled with its months); the route revisits pins in month order.
const pins = computed(() => {
  const byPlace = new Map()
  stops.forEach((s) => {
    if (!byPlace.has(s.place)) byPlace.set(s.place, { place: s.place, locs: [], months: [], photo: s.photo, m: s.m })
    const pin = byPlace.get(s.place)
    pin.locs.push(s.loc)
    if (!pin.months.includes(s.n)) pin.months.push(s.n)
  })
  return [...byPlace.values()].map((pin, i) => {
    const lat = pin.locs.reduce((a, l) => a + l[0], 0) / pin.locs.length
    const lng = pin.locs.reduce((a, l) => a + l[1], 0) / pin.locs.length
    return { ...pin, i, ...project([lat, lng]) }
  })
})

const route = computed(() => {
  const idx = stops.map((s) => pins.value.findIndex((p) => p.place === s.place))
  return idx.filter((v, i) => i === 0 || v !== idx[i - 1])
})

// Strings sag between pins like real yarn; repeat trips between the same two pins fan out.
const segments = computed(() => {
  const trips = {}
  return route.value.slice(1).map((to, i) => {
    const from = route.value[i]
    const a = pins.value[from], b = pins.value[to]
    const key = [from, to].sort().join('-')
    const c = (trips[key] = (trips[key] || 0) + 1) - 1
    const sag = Math.max(24, Math.hypot(b.x - a.x, b.y - a.y) * 0.18) * (1 + c * 0.45) * (c % 2 ? -1 : 1)
    return { d: `M${a.x} ${a.y} Q${(a.x + b.x) / 2} ${(a.y + b.y) / 2 + sag} ${b.x} ${b.y}`, to }
  })
})

function draw() {
  const c = canvas.value
  const { w, h } = dims.value
  const dpr = Math.min(window.devicePixelRatio, 2)
  c.width = w * dpr
  c.height = h * dpr
  const ctx = c.getContext('2d')
  ctx.scale(dpr, dpr)
  const v = view.value
  const sx = ((v.w + 180) / 360) * mask.width, sy = ((90 - v.n) / 180) * mask.height
  const sw = ((v.e - v.w) / 360) * mask.width, sh = ((v.n - v.s) / 180) * mask.height

  // coastline halo, then land, tinted with source-in
  const layer = (blur, color) => {
    const off = document.createElement('canvas')
    off.width = w; off.height = h
    const o = off.getContext('2d')
    o.filter = blur ? `blur(${blur}px)` : 'none'
    o.imageSmoothingEnabled = true
    o.drawImage(mask, sx, sy, sw, sh, 0, 0, w, h)
    o.filter = 'none'
    o.globalCompositeOperation = 'source-in'
    o.fillStyle = color
    o.fillRect(0, 0, w, h)
    return off
  }
  ctx.clearRect(0, 0, w, h)
  const [rw, rs, re, rn] = region.bbox
  if (v.w >= rw && v.e <= re && v.s >= rs && v.n <= rn) {
    // crisp vector coastline (Natural Earth) when the view is inside the bundled region
    const path = new Path2D()
    region.rings.forEach((ring) => {
      ring.forEach(([lng, lat], i) => {
        const p = project([lat, lng])
        i ? path.lineTo(p.x, p.y) : path.moveTo(p.x, p.y)
      })
      path.closePath()
    })
    ctx.save()
    ctx.shadowColor = 'rgba(47, 111, 106, 0.45)'
    ctx.shadowBlur = 10
    ctx.fillStyle = '#dcc9a3'
    ctx.fill(path)
    ctx.restore()
    ctx.strokeStyle = 'rgba(47, 111, 106, 0.6)'
    ctx.lineWidth = 1.2
    ctx.stroke(path)
  } else {
    ctx.drawImage(layer(3, 'rgba(47, 111, 106, 0.35)'), 0, 0)
    ctx.drawImage(layer(0, '#dcc9a3'), 0, 0)
  }

  // graticule
  ctx.strokeStyle = 'rgba(29, 25, 21, 0.12)'
  ctx.setLineDash([4, 6])
  ctx.lineWidth = 1
  const step = (v.e - v.w) > 30 ? 10 : (v.e - v.w) > 12 ? 5 : (v.e - v.w) > 4 ? 1 : 0.5
  ctx.font = '11px "Courier Prime", monospace'
  ctx.fillStyle = 'rgba(29, 25, 21, 0.4)'
  for (let lng = Math.ceil(v.w / step) * step; lng < v.e; lng += step) {
    const x = project([0, lng]).x
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
    ctx.fillText(`${Math.abs(lng)}°${lng >= 0 ? 'E' : 'W'}`, x + 4, h - 8)
  }
  for (let lat = Math.ceil(v.s / step) * step; lat < v.n; lat += step) {
    const y = project([lat, 0]).y
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
    ctx.fillText(`${Math.abs(lat)}°${lat >= 0 ? 'N' : 'S'}`, 6, y - 4)
  }
}

function measure() {
  // layout size, not the bounding box — the board is rotated
  dims.value = { w: board.value.offsetWidth, h: board.value.offsetHeight }
  if (mask?.complete) draw()
}

onMounted(() => {
  mask = new Image()
  mask.onload = measure
  mask.src = maskUrl
  measure()
  let t
  onResize = () => { clearTimeout(t); t = setTimeout(measure, 150) }
  window.addEventListener('resize', onResize)

  mm = gsap.matchMedia()
  mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }, (ctx) => {
    const el = root.value
    const tl = gsap.timeline({
      scrollTrigger: ctx.conditions.desktop
        ? { trigger: el, start: 'top top', end: '+=160%', pin: true, scrub: 1 }
        : { trigger: board.value, start: 'top 75%', end: 'bottom 30%', scrub: 1 },
    })
    tl.from(el.querySelector('.board'), { rotate: -6, y: 60, opacity: 0, duration: 0.3 })
    const pinEls = el.querySelectorAll('.pin')
    const popped = new Set([route.value[0]])
    tl.from(pinEls[route.value[0]], { scale: 0, y: -40, duration: 0.08, ease: 'back.out(3)' })
    el.querySelectorAll('.yarn path').forEach((p, i) => {
      tl.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.12, ease: 'none' })
      const to = segments.value[i].to
      if (!popped.has(to)) {
        popped.add(to)
        tl.from(pinEls[to], { scale: 0, y: -40, duration: 0.08, ease: 'back.out(3)' })
      }
    })
    tl.from(el.querySelectorAll('.legend li'), { x: 30, opacity: 0, stagger: 0.03, duration: 0.1 }, 0.2)
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  mm?.revert()
})
</script>

<template>
  <section id="map" ref="root" class="map" data-mood="map">
    <header class="head">
      <p class="eyebrow mono">where the roll went</p>
      <h2>Pinned it, <span class="serif">strung</span> it.</h2>
    </header>

    <div class="layout">
      <div ref="board" class="board">
        <i class="tape t1" /><i class="tape t2" />
        <canvas ref="canvas" class="land" aria-hidden="true" />
        <svg class="yarn" :viewBox="`0 0 ${dims.w} ${dims.h}`" aria-hidden="true">
          <path v-for="(seg, i) in segments" :key="i" :d="seg.d" pathLength="1" />
        </svg>
        <button
          v-for="p in pins"
          :key="p.i"
          class="pin"
          :style="{ left: `${p.x}px`, top: `${p.y}px` }"
          :data-cursor="p.place"
          @pointerenter="hover = p.i"
          @pointerleave="hover = -1"
          @focus="hover = p.i"
          @blur="hover = -1"
        >
          <i class="head-dot" />
          <span class="tag mono">{{ p.months.join('·') }}</span>
          <span class="peek" :class="{ show: hover === p.i }">
            <img v-if="p.photo" :src="p.photo" alt="" />
            <span v-else class="peek-neg" />
            <b class="mono">{{ p.place }}</b>
          </span>
        </button>
        <span class="compass mono" aria-hidden="true">N<br />↑</span>
        <span v-if="isDemo" class="demo mono">demo route — real pins land when the photos do</span>
      </div>

      <aside class="legend">
        <ol class="mono">
          <li v-for="(s, i) in stops" :key="i"><b>{{ s.n }}</b> {{ s.m }} — {{ s.place }}</li>
        </ol>
        <p class="sum"><span class="serif">{{ Math.round(totalKm).toLocaleString('en-US') }}</span> km of yarn<br /><span class="mono">{{ cities.length }} places · {{ stops.length }} stops</span></p>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.map { height: 100vh; padding: 92px var(--gutter) 40px; display: flex; flex-direction: column; gap: 20px; }
.head h2 { font-weight: 800; font-size: clamp(40px, 5vw, 80px); line-height: 0.95; letter-spacing: -0.05em; }
.head .serif { color: var(--pink); font-weight: 400; }
.layout { flex: 1; display: grid; grid-template-columns: 1fr 260px; gap: 28px; min-height: 0; }
.board {
  position: relative;
  min-height: 420px;
  background:
    radial-gradient(circle at 20% 10%, rgba(255, 255, 255, 0.5), transparent 60%),
    #ece0c8;
  box-shadow: 0 30px 70px -30px rgba(60, 40, 20, 0.5), inset 0 0 80px rgba(120, 80, 40, 0.18);
  transform: rotate(-0.8deg);
}
.land { position: absolute; inset: 0; width: 100%; height: 100%; }
.yarn { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.yarn path { fill: none; stroke: #c8243a; stroke-width: 2.4; stroke-linecap: round; stroke-dasharray: 1; filter: drop-shadow(0 2px 1px rgba(0, 0, 0, 0.25)); }
.tape { position: absolute; width: 110px; height: 30px; background: rgba(240, 220, 160, 0.7); z-index: 3; }
.t1 { top: -12px; left: 8%; rotate: -6deg; }
.t2 { bottom: -12px; right: 10%; rotate: 4deg; }
.pin { position: absolute; width: 0; height: 0; z-index: 4; }
.head-dot {
  position: absolute;
  left: -9px;
  top: -9px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ff8a8a, #c8243a 55%, #7a0f1d);
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.3);
}
.tag { position: absolute; left: 12px; top: -22px; font-size: 11px; background: var(--paper); padding: 1px 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); }
.peek {
  position: absolute;
  left: 50%;
  bottom: 18px;
  width: 140px;
  translate: -50% 10px;
  padding: 7px 7px 26px;
  background: var(--paper);
  box-shadow: 0 16px 30px -10px rgba(60, 40, 20, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s, translate 0.4s var(--ease);
  rotate: -3deg;
  z-index: 10;
}
.peek.show { opacity: 1; translate: -50% 0; }
.peek img, .peek-neg { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; }
.peek-neg { background: linear-gradient(135deg, #3a2414, #6b2a1a); }
.peek b { position: absolute; left: 8px; right: 8px; bottom: 6px; font-size: 10px; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.compass { position: absolute; right: 18px; top: 16px; text-align: center; font-size: 14px; line-height: 1.1; color: rgba(29, 25, 21, 0.55); }
.demo { position: absolute; left: 14px; top: 14px; font-size: 11px; color: var(--pink); background: rgba(251, 247, 239, 0.8); padding: 3px 8px; }
.legend { display: flex; flex-direction: column; justify-content: space-between; gap: 24px; }
.legend ol { list-style: none; display: grid; gap: 8px; font-size: 13px; color: var(--muted); }
.legend b { color: var(--pink); font-weight: 400; margin-right: 6px; }
.sum { font-size: 15px; color: var(--muted); line-height: 1.4; }
.sum .serif { font-size: 64px; line-height: 1; color: var(--fg); }

@media (max-width: 899px) {
  .map { height: auto; }
  .layout { grid-template-columns: 1fr; }
  .board { min-height: 0; aspect-ratio: 4 / 5; }
  .legend ol { grid-template-columns: 1fr 1fr; }
}
</style>
