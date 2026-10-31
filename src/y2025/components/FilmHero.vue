<script setup>
import { onMounted, ref, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({ ready: Boolean })
const root = ref(null)
let intro

onMounted(() => {
  intro = gsap.timeline({ paused: true })
    .from('.fh-sprocket', { scaleX: 0, duration: 1.4, ease: 'expo.inOut', stagger: 0.1 })
    .from('.fh-digit', { yPercent: 110, rotate: (i) => (i % 2 ? 8 : -8), duration: 1.4, ease: 'expo.out', stagger: 0.08 }, 0.2)
    .from('.fh-fade', { opacity: 0, y: 20, duration: 1, stagger: 0.08 }, 0.6)
    .from('.fh-stamp', { scale: 2.4, opacity: 0, rotate: -30, duration: 0.6, ease: 'back.out(2)' }, 1.1)

  gsap.to('.fh-year', {
    yPercent: 25,
    filter: 'blur(10px) sepia(1)',
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
  })
  if (props.ready) intro.play()
})
watch(() => props.ready, (r) => r && intro?.play())

function wobble(e) {
  gsap.fromTo(e.currentTarget, { rotate: 0 }, { keyframes: [{ rotate: -6, y: -14, duration: 0.15 }, { rotate: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.3)' }] })
}
</script>

<template>
  <section id="top" ref="root" class="hero" data-mood="hero">
    <div class="fh-sprocket" aria-hidden="true" />
    <div class="fh-meta mono fh-fade"><span>SAFETY FILM 400</span><span>▸ 01A</span><span class="hide-sm">roll no. 2025</span></div>

    <h1 class="fh-year" aria-label="2025">
      <span v-for="(d, i) in '2025'" :key="i" class="fh-mask">
        <span class="fh-digit" :class="{ alt: i === 3 }" @pointerenter="wobble">{{ d }}</span>
      </span>
    </h1>

    <div class="fh-bottom">
      <p class="fh-sub fh-fade">Twelve months on one roll.<br />Developed a little <span class="serif">late</span>, but worth the wait.</p>
      <span class="fh-stamp mono">developed<br />2026</span>
    </div>
    <div class="fh-meta mono fh-fade"><span>◂ scroll to advance the film</span><span>36 exp.</span></div>
    <div class="fh-sprocket" aria-hidden="true" />
  </section>
</template>

<style scoped>
.hero { min-height: 100svh; display: flex; flex-direction: column; padding: 84px var(--gutter) 20px; gap: 14px; }
.fh-sprocket {
  height: 14px;
  transform-origin: left;
  background: repeating-linear-gradient(90deg, var(--fg) 0 14px, transparent 14px 30px);
  border-radius: 3px;
  opacity: 0.85;
}
.fh-meta { display: flex; justify-content: space-between; gap: 16px; color: var(--muted); font-size: 12px; }
.fh-year {
  margin-top: auto;
  display: flex;
  justify-content: center;
  font-family: var(--serif);
  font-weight: 400;
  font-size: clamp(130px, 33vw, 540px);
  line-height: 0.82;
  letter-spacing: -0.04em;
  user-select: none;
}
.fh-mask { overflow: hidden; display: inline-block; padding: 0 0.02em; }
.fh-digit { display: inline-block; }
.fh-digit.alt { font-style: italic; color: var(--acid); }
.fh-bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin: 18px 0 8px; }
.fh-sub { font-size: clamp(20px, 2.4vw, 34px); line-height: 1.2; letter-spacing: -0.02em; font-weight: 500; }
.fh-sub .serif { color: var(--acid); }
.fh-stamp {
  display: inline-block;
  padding: 10px 14px;
  border: 2px solid var(--pink);
  color: var(--pink);
  border-radius: 6px;
  transform: rotate(-8deg);
  text-transform: uppercase;
  font-weight: 700;
  font-size: 13px;
  line-height: 1.2;
  text-align: center;
  mix-blend-mode: multiply;
}
@media (max-width: 640px) {
  .hide-sm { display: none; }
  .fh-year { margin-top: 30vh; }
}
</style>
