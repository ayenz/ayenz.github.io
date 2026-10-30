<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { total, topPlace, places, furthest, mix, photos } from '../wrapped.js'
import { scene } from '../../composables/mood.js'

const SLIDES = [
  { id: 'intro', bg: 'linear-gradient(160deg, #1b0b3a, #4f7bff 60%, #c6ff3d)' },
  { id: 'count', bg: 'linear-gradient(200deg, #ff4fd8, #1b0b3a 70%)' },
  topPlace && { id: 'city', bg: 'linear-gradient(170deg, #0b2a1a, #c6ff3d)' },
  furthest && { id: 'far', bg: 'linear-gradient(190deg, #05122b, #4f7bff 55%, #ff7a2f)' },
  { id: 'mix', bg: 'linear-gradient(160deg, #2b1405, #ff7a2f 60%, #ff4fd8)' },
  { id: 'places', bg: 'linear-gradient(200deg, #1a0626, #ff4fd8 55%, #4f7bff)' },
  { id: 'outro', bg: 'linear-gradient(170deg, #c6ff3d, #4f7bff 50%, #1b0b3a)' },
].filter(Boolean)
const DURATION = 5.5

const root = ref(null)
const stage = ref(null)
const index = ref(0)
const progress = ref(0)
const paused = ref(false)
let bar, inView = false, holdTimer, wasHeld = false

const slide = computed(() => SLIDES[index.value])

async function show(i) {
  index.value = (i + SLIDES.length) % SLIDES.length
  await nextTick()
  const els = stage.value.querySelectorAll('.anim')
  gsap.fromTo(els, { y: 40, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, stagger: 0.09, duration: 0.8, ease: 'expo.out' })
  const bars = stage.value.querySelectorAll('.grow')
  if (bars.length) gsap.fromTo(bars, { scaleX: 0 }, { scaleX: 1, stagger: 0.12, duration: 1.2, ease: 'expo.out', delay: 0.3 })
  stage.value.querySelectorAll('[data-count]').forEach((n) => {
    const o = { v: 0 }
    gsap.to(o, { v: Number(n.dataset.count), duration: 1.6, ease: 'expo.out', onUpdate: () => (n.textContent = Math.round(o.v).toLocaleString('en-US')) })
  })
  bar?.kill()
  progress.value = 0
  bar = gsap.to(progress, { value: 1, duration: DURATION, ease: 'none', onComplete: () => show(index.value + 1), paused: !inView || paused.value })
  scene.pulse++
}

function tap(e) {
  if (wasHeld) return (wasHeld = false) // releasing a hold resumes, it doesn't skip
  const r = e.currentTarget.getBoundingClientRect()
  show(index.value + (e.clientX - r.left < r.width * 0.3 ? -1 : 1))
}
function hold(on) {
  clearTimeout(holdTimer)
  if (on) holdTimer = setTimeout(() => { paused.value = true; wasHeld = true; bar?.pause() }, 180)
  else if (paused.value) { paused.value = false; inView && bar?.resume() }
}
const onKey = (e) => {
  if (!inView) return
  if (e.key === 'ArrowRight') show(index.value + 1)
  if (e.key === 'ArrowLeft') show(index.value - 1)
}

onMounted(() => {
  ScrollTrigger.create({
    trigger: root.value,
    start: 'top 60%',
    end: 'bottom 40%',
    onToggle: (self) => {
      inView = self.isActive
      if (inView && !paused.value) bar?.resume()
      else bar?.pause()
    },
  })
  gsap.from(root.value.querySelector('.phone'), {
    y: 120,
    rotate: -6,
    opacity: 0,
    duration: 1.4,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 70%' },
  })
  window.addEventListener('keydown', onKey)
  show(0)
})
onBeforeUnmount(() => {
  bar?.kill()
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <section id="wrapped" ref="root" class="wrapped" data-mood="ticker">
    <div class="side">
      <p class="eyebrow mono">2026, wrapped</p>
      <h2>The year, <span class="serif">in stories.</span></h2>
      <p class="lede mono">tap right → next · tap left ← back · hold to pause</p>
    </div>

    <div class="phone" :style="{ background: slide.bg }">
      <div class="bars">
        <span v-for="(s, i) in SLIDES" :key="s.id"><i :style="{ transform: `scaleX(${i < index ? 1 : i === index ? progress : 0})` }" /></span>
      </div>
      <div class="who mono"><b>MY//2026</b> · {{ index + 1 }}/{{ SLIDES.length }}<span v-if="paused"> · paused</span></div>

      <div
        ref="stage"
        class="stage"
        data-cursor="tap"
        @click="tap"
        @pointerdown="hold(true)"
        @pointerup="hold(false)"
        @pointerleave="hold(false)"
      >
        <template v-if="slide.id === 'intro'">
          <p class="k anim mono">ready?</p>
          <h3 class="anim">Your 2026,<br /><em>wrapped.</em></h3>
          <p class="anim small">Ten months. A bunch of photos. Some very real numbers.</p>
        </template>

        <template v-else-if="slide.id === 'count'">
          <p class="k anim mono">this year you posted</p>
          <h3 class="anim huge"><span :data-count="total">0</span></h3>
          <p class="anim">photos worth keeping.</p>
          <div class="collage anim">
            <img v-for="(p, i) in photos.slice(0, 6)" :key="i" :src="p" alt="" :style="{ rotate: `${(i % 2 ? 1 : -1) * (4 + i * 2)}deg` }" />
          </div>
        </template>

        <template v-else-if="slide.id === 'city'">
          <p class="k anim mono">your top city</p>
          <h3 class="anim">{{ topPlace.name }}</h3>
          <p class="anim"><b :data-count="topPlace.n">0</b> of {{ total }} photos were taken here.</p>
          <p class="anim small">Home turf. Main character energy.</p>
        </template>

        <template v-else-if="slide.id === 'far'">
          <p class="k anim mono">furthest photo</p>
          <h3 class="anim">{{ furthest.place }}</h3>
          <p class="anim">~<b :data-count="furthest.km">0</b> km from {{ furthest.from }}, back in {{ furthest.month }}.</p>
          <p class="anim small">Passport stamps &gt; screen time.</p>
        </template>

        <template v-else-if="slide.id === 'mix'">
          <p class="k anim mono">your year was made of</p>
          <div v-for="b in mix" :key="b.label" class="row anim">
            <span class="lbl">{{ b.label }}</span>
            <span class="track"><i class="grow" :style="{ width: `${b.pct}%` }" /></span>
            <b>{{ b.pct }}%</b>
          </div>
          <p class="anim small">Mostly {{ mix[0].label }}. Honestly? Correct.</p>
        </template>

        <template v-else-if="slide.id === 'places'">
          <p class="k anim mono">you showed up in</p>
          <h3 class="anim huge"><span :data-count="places.length">0</span></h3>
          <p class="anim">different places:</p>
          <ul class="list">
            <li v-for="p in places" :key="p" class="anim">{{ p }}</li>
          </ul>
        </template>

        <template v-else>
          <p class="k anim mono">and that’s a wrap</p>
          <h3 class="anim">See you in<br /><em>2027.</em></h3>
          <p class="anim small">Two more months to fill. No pressure.</p>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wrapped { min-height: 100vh; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 48px; padding: 120px var(--gutter); }
.side h2 { font-size: clamp(44px, 6vw, 96px); line-height: 0.92; letter-spacing: -0.05em; }
.side .serif { color: var(--pink); }
.lede { margin-top: 24px; color: var(--muted); }
.phone {
  position: relative;
  width: min(380px, 88vw);
  aspect-ratio: 9 / 16;
  max-height: 78vh;
  border-radius: 34px;
  overflow: hidden;
  color: #fff;
  box-shadow: 0 0 0 10px #111, 0 0 0 11px #2a2a2e, 0 50px 100px -30px rgba(0, 0, 0, 0.8), 0 0 120px -20px rgba(198, 255, 61, 0.35);
  transition: background 0.8s;
  user-select: none;
}
.bars { position: absolute; top: 14px; left: 14px; right: 14px; display: flex; gap: 4px; z-index: 2; }
.bars span { flex: 1; height: 3px; border-radius: 3px; background: rgba(255, 255, 255, 0.3); overflow: hidden; }
.bars i { display: block; height: 100%; background: #fff; transform-origin: left; }
.who { position: absolute; top: 28px; left: 16px; z-index: 2; font-size: 11px; opacity: 0.85; }
.stage { position: absolute; inset: 0; padding: 70px 26px 30px; display: flex; flex-direction: column; justify-content: center; gap: 14px; }
.k { font-size: 12px; opacity: 0.8; }
h3 { font-size: clamp(34px, 3.4vw, 48px); line-height: 0.95; letter-spacing: -0.04em; font-weight: 700; overflow-wrap: anywhere; }
h3 em { font-family: var(--serif); font-weight: 400; }
.huge { font-size: clamp(96px, 10vw, 140px); line-height: 0.85; }
p { font-size: 20px; line-height: 1.3; }
.small { font-size: 15px; opacity: 0.85; }
.collage { display: flex; margin-top: 12px; }
.collage img { width: 64px; height: 80px; object-fit: cover; margin-right: -14px; border: 3px solid #fff; border-radius: 6px; box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35); }
.row { display: grid; grid-template-columns: 1fr 1.3fr auto; align-items: center; gap: 10px; font-size: 15px; }
.track { height: 10px; border-radius: 10px; background: rgba(255, 255, 255, 0.25); overflow: hidden; }
.track i { display: block; height: 100%; background: #fff; border-radius: 10px; transform-origin: left; }
.list { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; }
.list li { padding: 6px 12px; border-radius: 999px; background: rgba(0, 0, 0, 0.25); font-size: 14px; }

@media (max-width: 860px) {
  .wrapped { grid-template-columns: 1fr; justify-items: center; text-align: center; }
  .phone { max-height: 72vh; }
}
</style>
