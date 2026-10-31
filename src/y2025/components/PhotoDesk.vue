<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Matter from 'matter-js'
import { prints } from '../months.js'
import { film } from '../store.js'
import { scrollState } from '../../composables/smooth.js'

const { Engine, Bodies, Body, Composite, Constraint } = Matter

const emit = defineEmits(['open'])
const root = ref(null)
const stage = ref(null)
const cards = ref([])
const dealt = ref(0)
const focus = ref(-1)
const tidy = ref(false)
const aspect = ref({}) // natural width / height per print, so landscape shots stay landscape

let engine, walls = [], bodies = [], tick, st, drag = null, z = 10, cleanup = () => {}
const view = { s: 1 } // visual scale, shrinks prints so a tidy grid fits the desk
const rand = (a, b) => a + Math.random() * (b - a)

function size() {
  const r = stage.value.getBoundingClientRect()
  return { w: r.width, h: r.height }
}

function buildWalls() {
  if (walls.length) Composite.remove(engine.world, walls)
  const { w, h } = size()
  const t = 400
  walls = [
    Bodies.rectangle(w / 2, -t / 2, w + t * 2, t, { isStatic: true }),
    Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, { isStatic: true }),
    Bodies.rectangle(-t / 2, h / 2, t, h + t * 2, { isStatic: true }),
    Bodies.rectangle(w + t / 2, h / 2, t, h + t * 2, { isStatic: true }),
  ]
  Composite.add(engine.world, walls)
}

// Toss photo i in from a random edge so it slides, spins and settles somewhere new every time.
function deal(i) {
  const el = cards.value[i]
  const { w, h } = size()
  const cw = el.offsetWidth, ch = el.offsetHeight
  const edge = Math.floor(Math.random() * 4)
  const sx = edge === 1 ? w - cw / 2 - 2 : edge === 3 ? cw / 2 + 2 : rand(cw / 2, w - cw / 2)
  const sy = edge === 0 ? ch / 2 + 2 : edge === 2 ? h - ch / 2 - 2 : rand(ch / 2, h - ch / 2)
  const tx = rand(w * 0.2, w * 0.8), ty = rand(h * 0.2, h * 0.8)
  const body = Bodies.rectangle(sx, sy, cw, ch, {
    frictionAir: 0.045,
    restitution: 0.55,
    angle: rand(-0.35, 0.35),
    collisionFilter: { group: -1 }, // photos overlap like on a real desk; they only bounce off the edges
  })
  Body.setVelocity(body, { x: (tx - sx) * 0.075, y: (ty - sy) * 0.075 })
  Body.setAngularVelocity(body, rand(-0.035, 0.035))
  if (tidy.value) Body.setStatic(body, false)
  bodies[i] = body
  Composite.add(engine.world, body)
  el.style.zIndex = ++z
  gsap.fromTo(el, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' })
  el.classList.remove('developed')
  setTimeout(() => el.classList.add('developed'), 350)
  focus.value = i
  film.frame = i
}

function undeal(i) {
  const body = bodies[i]
  const el = cards.value[i]
  if (body) Composite.remove(engine.world, body)
  bodies[i] = null
  gsap.to(el, { opacity: 0, scale: 0.8, duration: 0.35, ease: 'power2.in' })
  focus.value = i - 1
}

function sync() {
  bodies.forEach((b, i) => {
    if (!b) return
    const el = cards.value[i]
    el.style.transform = `translate(${b.position.x - el.offsetWidth / 2}px, ${b.position.y - el.offsetHeight / 2}px) rotate(${b.angle}rad) scale(${view.s})`
  })
}

function tidyUp() {
  tidy.value = true
  const { w, h } = size()
  const live = bodies.map((b, i) => [b, i]).filter(([b]) => b)
  // pick a grid that roughly matches the desk's shape
  const cols = Math.max(2, Math.round(Math.sqrt((live.length * (w / h)) / 0.8)))
  const rows = Math.ceil(live.length / cols)
  const maxW = Math.max(...live.map(([, i]) => cards.value[i].offsetWidth))
  const maxH = Math.max(...live.map(([, i]) => cards.value[i].offsetHeight))
  gsap.to(view, { s: Math.min(1, ((w / cols) * 0.94) / maxW, ((h / Math.max(rows, 2)) * 0.94) / maxH), duration: 1.1, ease: 'expo.inOut' })
  live.forEach(([b, i], k) => {
    Body.setStatic(b, true)
    const col = k % cols, row = Math.floor(k / cols)
    const p = { x: b.position.x, y: b.position.y, a: b.angle }
    gsap.to(p, {
      x: (w / cols) * (col + 0.5),
      y: (h / Math.max(rows, 2)) * (row + 0.5),
      a: rand(-0.03, 0.03),
      duration: 1.1,
      delay: k * 0.04,
      ease: 'expo.inOut',
      onUpdate: () => { Body.setPosition(b, { x: p.x, y: p.y }); Body.setAngle(b, p.a) },
    })
    cards.value[i].style.zIndex = 10 + k
  })
}

function messUp() {
  tidy.value = false
  gsap.to(view, { s: 1, duration: 0.6, ease: 'expo.out' })
  bodies.forEach((b) => {
    if (!b) return
    Body.setStatic(b, false)
    Body.setVelocity(b, { x: rand(-28, 28), y: rand(-28, 28) })
    Body.setAngularVelocity(b, rand(-0.3, 0.3))
  })
  film.flash++
}

// Drag & toss with a spring; a short press without movement opens the lightbox.
function onDown(e, i) {
  const b = bodies[i]
  if (!b) return
  focus.value = i
  cards.value[i].style.zIndex = ++z
  const start = { x: e.clientX, y: e.clientY, t: performance.now() }
  if (e.pointerType === 'touch' || tidy.value) {
    const up = (ev) => {
      window.removeEventListener('pointerup', up)
      if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 8) emit('open', i)
    }
    window.addEventListener('pointerup', up)
    return
  }
  e.preventDefault()
  const r = stage.value.getBoundingClientRect()
  const pt = { x: e.clientX - r.left, y: e.clientY - r.top }
  const local = Matter.Vector.rotate(Matter.Vector.sub(pt, b.position), -b.angle)
  drag = Constraint.create({ pointA: pt, bodyB: b, pointB: local, stiffness: 0.12, damping: 0.08, length: 0 })
  Composite.add(engine.world, drag)
  cards.value[i].classList.add('held')
  const move = (ev) => { drag.pointA = { x: ev.clientX - r.left, y: ev.clientY - r.top } }
  const up = (ev) => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    Composite.remove(engine.world, drag)
    drag = null
    cards.value[i].classList.remove('held')
    if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 6 && performance.now() - start.t < 400) emit('open', i)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}

onMounted(() => {
  engine = Engine.create({ gravity: { x: 0, y: 0 } })
  buildWalls()

  tick = (_, dt) => {
    // a fast scroll gives the desk a little shake
    const v = Math.abs(scrollState.velocity)
    if (v > 8 && !tidy.value) {
      bodies.forEach((b) => b && Body.applyForce(b, b.position, { x: rand(-1, 1) * v * 0.00002 * b.mass, y: rand(-1, 1) * v * 0.00002 * b.mass }))
    }
    // fixed ~60 Hz substeps keep the simulation stable on slow or high-refresh frames
    const STEP = 1000 / 60
    for (let left = Math.min(dt, 50); left > 0.01; left -= STEP) Engine.update(engine, Math.min(left, STEP))
    sync()
  }
  gsap.ticker.add(tick)

  // Learn each photo's shape before dealing so the prints are sized right.
  let ready = false
  Promise.all(prints.map((p, i) => new Promise((done) => {
    const img = new Image()
    img.onload = () => { aspect.value[i] = img.naturalWidth / img.naturalHeight; done() }
    img.onerror = done
    img.src = p.src
  }))).then(() => { ready = true; st?.update() })

  st = ScrollTrigger.create({
    trigger: root.value,
    start: 'top top',
    end: () => `+=${window.innerHeight * Math.max(4.5, prints.length * 0.38)}`,
    pin: true,
    onUpdate: (self) => {
      if (!ready) return
      const want = Math.min(prints.length, Math.floor(self.progress * (prints.length + 1.2)))
      while (dealt.value < want) deal(dealt.value++)
      while (dealt.value > want) undeal(--dealt.value)
    },
  })

  const onResize = () => buildWalls()
  window.addEventListener('resize', onResize)
  cleanup = () => window.removeEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  gsap.ticker.remove(tick)
  st?.kill()
  cleanup()
  Engine.clear(engine)
})
</script>

<template>
  <section id="timeline" ref="root" class="desk" data-mood="timeline">
    <div ref="stage" class="stage">
      <div class="mat" aria-hidden="true" />

      <div class="intro" :class="{ gone: dealt > 0 }">
        <p class="eyebrow mono">the photo desk</p>
        <h2>{{ prints.length }} prints,<br /><span class="serif">tossed</span> on a desk.</h2>
        <p class="lede">Keep scrolling to deal the year, month by month. Drag them, throw them, make a mess — it’s your desk now.</p>
      </div>

      <article
        v-for="(item, i) in prints"
        :key="item.key"
        :ref="(el) => (cards[i] = el)"
        class="print has-photo"
        :class="{ landscape: (aspect[i] || 0.8) > 1.05 }"
        :style="{ '--ar': aspect[i] || 0.8 }"
        data-cursor="grab"
        @pointerdown="onDown($event, i)"
        @pointerenter="dealt > i && (focus = i)"
      >
        <div class="photo">
          <img :src="item.src" :alt="`${item.m} 2025 — ${item.caption}`" draggable="false" decoding="async" />
          <span class="date mono">’25 {{ item.m.toUpperCase() }}</span>
        </div>
        <span class="hand">{{ item.caption }}</span>
      </article>

      <aside class="note" :class="{ show: focus >= 0 }">
        <template v-if="focus >= 0">
          <span class="mono n">{{ prints[focus].n }} · {{ prints[focus].m }} 2025<template v-if="prints[focus].place"> · {{ prints[focus].place }}</template><template v-if="prints[focus].of > 1"> · {{ prints[focus].pi + 1 }}/{{ prints[focus].of }}</template></span>
          <h3>{{ prints[focus].title }}</h3>
          <p v-if="prints[focus].of > 1" class="cap">“{{ prints[focus].caption }}”</p>
          <p>{{ prints[focus].body }}</p>
        </template>
      </aside>

      <div class="hud mono">
        <span>dealt {{ String(dealt).padStart(2, '0') }}/{{ prints.length }}</span>
        <button v-if="dealt > 1" class="pill" v-magnetic @click="tidy ? messUp() : tidyUp()">{{ tidy ? 'mess it up' : 'tidy up' }}</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.desk { position: relative; height: 100vh; }
.stage { position: absolute; inset: 72px 0 0; overflow: hidden; }
.mat {
  position: absolute;
  inset: 12px var(--gutter);
  border-radius: 18px;
  border: 1px dashed rgba(29, 25, 21, 0.18);
  background-image: linear-gradient(rgba(47, 111, 106, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(47, 111, 106, 0.07) 1px, transparent 1px);
  background-size: 40px 40px;
}
.intro {
  position: absolute;
  left: var(--gutter);
  top: 50%;
  translate: 0 -50%;
  padding-left: 24px;
  max-width: 560px;
  transition: opacity 0.8s var(--ease), filter 0.8s var(--ease);
  pointer-events: none;
}
.intro.gone { opacity: 0.12; filter: blur(2px); }
.intro h2 { font-weight: 800; font-size: clamp(44px, 6.4vw, 100px); line-height: 0.92; letter-spacing: -0.055em; }
.intro .serif { color: var(--acid); font-weight: 400; }
.lede { margin-top: 22px; color: var(--muted); font-size: 18px; line-height: 1.5; max-width: 36ch; }

.print {
  position: absolute;
  top: 0;
  left: 0;
  width: clamp(150px, 15vw, 230px);
  padding: 10px 10px 34px;
  background: var(--paper);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.06), 0 16px 34px -10px rgba(60, 40, 20, 0.45);
  opacity: 0;
  user-select: none;
  touch-action: pan-y;
  will-change: transform;
  transition: box-shadow 0.3s;
}
.print.held { box-shadow: 0 6px 6px rgba(0, 0, 0, 0.08), 0 40px 60px -14px rgba(60, 40, 20, 0.55); }
.print.landscape { width: clamp(210px, 21vw, 320px); }
.photo { position: relative; aspect-ratio: var(--ar, 0.8); overflow: hidden; background: #2a1a10; pointer-events: none; }
.photo img { width: 100%; height: 100%; object-fit: cover; filter: sepia(1) brightness(1.9) contrast(0.45) blur(3px); transition: filter 2.6s var(--ease); }
.print.developed .photo img { filter: sepia(0.15) contrast(1.04) saturate(1.05); }
.date { position: absolute; right: 6px; bottom: 6px; font-size: 10px; color: #ffb36b; text-shadow: 0 0 6px rgba(255, 120, 40, 0.8); }
.hand { position: absolute; left: 12px; right: 12px; bottom: 6px; font-family: var(--hand); font-weight: 700; font-size: 20px; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #2a2522; pointer-events: none; }

.note {
  position: absolute;
  right: var(--gutter);
  bottom: 28px;
  z-index: 900;
  width: min(340px, calc(100% - 2 * var(--gutter)));
  padding: 18px 20px;
  background: #fff9c8;
  box-shadow: 0 18px 40px -16px rgba(60, 40, 20, 0.5);
  transform: rotate(1.5deg) translateY(20px);
  opacity: 0;
  transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
  pointer-events: none;
}
.note.show { opacity: 1; transform: rotate(1.5deg); }
.note .n { color: var(--acid); font-size: 12px; }
.note h3 { font-family: var(--hand); font-size: 34px; line-height: 1; margin: 8px 0; }
.note p { color: #5a5048; font-size: 14.5px; line-height: 1.45; }
.note .cap { font-family: var(--hand); font-size: 20px; color: var(--pink); margin-bottom: 4px; }
.hud { position: absolute; left: var(--gutter); bottom: 28px; z-index: 900; display: flex; align-items: center; gap: 14px; color: var(--muted); font-size: 12px; padding-left: 12px; }
.hud .pill { padding: 10px 16px; background: var(--paper); }

@media (max-width: 899px) {
  .print { width: 40vw; padding: 7px 7px 26px; }
  .print.landscape { width: 52vw; }
  .hand { font-size: 16px; bottom: 4px; }
  .intro { top: 24px; translate: none; padding-left: 0; }
  .intro .lede { font-size: 15px; }
  .note { bottom: 72px; padding: 14px 16px; }
  .note h3 { font-size: 28px; }
  .note p { font-size: 13px; }
  .hud { bottom: 24px; }
}
</style>
