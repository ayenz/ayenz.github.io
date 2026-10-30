<script setup>
import { onMounted, ref, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({ ready: Boolean })
const root = ref(null)
const chars = '2026'.split('')

let intro
onMounted(() => {
  intro = gsap.timeline({ paused: true })
    .from('.hero-char', {
      yPercent: 120,
      rotate: (i) => (i % 2 ? 18 : -18),
      duration: 1.6,
      stagger: 0.08,
      ease: 'expo.out',
    })
    .from('.hero-line', { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'expo.out' }, 0.3)
    .from('.hero-corner', { opacity: 0, y: 20, duration: 1, stagger: 0.1 }, 0.6)
    .from('.hero-rule', { scaleX: 0, duration: 1.4, ease: 'expo.inOut' }, 0.2)

  gsap.to('.hero-title', {
    yPercent: 40,
    scale: 0.85,
    opacity: 0,
    filter: 'blur(12px)',
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
  })

  if (props.ready) intro.play()
})

watch(() => props.ready, (r) => r && intro?.play())

function jiggle(e) {
  gsap.fromTo(
    e.currentTarget,
    { skewX: 0, scaleY: 1 },
    { keyframes: [{ skewX: -12, scaleY: 1.12, duration: 0.15 }, { skewX: 0, scaleY: 1, duration: 0.9, ease: 'elastic.out(1, 0.3)' }] },
  )
}
</script>

<template>
  <section id="hero" ref="root" class="hero" data-mood="hero">
    <div class="hero-top">
      <div class="mask"><p class="hero-line mono">vol. 01 — the full year, kinda</p></div>
      <div class="mask"><p class="hero-line mono">jan → dec / ∞ tabs open</p></div>
    </div>

    <h1 class="hero-title" aria-label="2026">
      <span v-for="(c, i) in chars" :key="i" class="hero-mask">
        <span class="hero-char" :class="{ outline: i === 2 }" @pointerenter="jiggle">{{ c }}</span>
      </span>
    </h1>

    <div class="hero-rule" />

    <div class="hero-bottom">
      <div class="hero-sub">
        <div class="mask"><p class="hero-line">A totally made-up almanac of the year</p></div>
        <div class="mask"><p class="hero-line"><span class="serif">nobody</span> asked for, but <span class="serif">everyone</span> lived through.</p></div>
      </div>
      <div class="hero-corner scroll-cue mono" data-cursor="scroll">
        <span>scroll</span>
        <span class="track"><i /></span>
      </div>
    </div>

    <div class="hero-corner side-tag mono">lat −6.2088 / lng 106.8456 · probably</div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 110px var(--gutter) 40px;
  position: relative;
  overflow: clip;
}
.mask { overflow: hidden; }
.hero-top { display: flex; justify-content: space-between; gap: 16px; color: var(--muted); }
.hero-title {
  display: flex;
  justify-content: center;
  font-size: clamp(120px, 34vw, 560px);
  font-weight: 700;
  letter-spacing: -0.07em;
  line-height: 0.8;
  margin-top: auto;
  user-select: none;
}
.hero-mask { overflow: hidden; display: inline-block; padding: 0 0.01em; }
.hero-char {
  display: inline-block;
  transform-origin: bottom center;
  background: linear-gradient(180deg, var(--fg) 30%, rgba(236, 235, 228, 0.35));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero-char.outline {
  background: none;
  -webkit-text-stroke: 2px var(--acid);
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.02em;
}
.hero-rule { height: 1px; background: var(--line); transform-origin: left; margin: 24px 0; }
.hero-bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; }
.hero-sub { font-size: clamp(20px, 2.6vw, 36px); line-height: 1.15; letter-spacing: -0.02em; max-width: 20ch; }
.hero-sub .serif { color: var(--acid); }
.scroll-cue { display: flex; align-items: center; gap: 12px; color: var(--muted); }
.track { width: 1px; height: 56px; background: var(--line); position: relative; overflow: hidden; }
.track i {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 40%;
  background: var(--acid);
  animation: drip 1.8s var(--ease) infinite;
}
@keyframes drip { from { transform: translateY(-100%); } to { transform: translateY(260%); } }
.side-tag {
  position: absolute;
  right: var(--gutter);
  top: 50%;
  transform-origin: top right;
  transform: rotate(-90deg) translateY(-100%);
  white-space: nowrap;
  color: var(--muted);
  font-size: 10px;
}

@media (max-width: 640px) {
  .hero-top p:last-child { display: none; }
  .side-tag { display: none; }
  .hero-char.outline { -webkit-text-stroke-width: 1.5px; }
}
</style>
