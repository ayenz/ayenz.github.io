<script setup>
import { onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { EVENTS, SOURCE } from '../events.js'
import { getLenis } from '../../composables/smooth.js'

const props = defineProps({ ready: Boolean })
const root = ref(null)
let intro

onMounted(() => {
  intro = gsap.timeline({ paused: true })
    .from('.mh-rule', { scaleX: 0, duration: 1.4, ease: 'expo.inOut', stagger: 0.1 })
    .from('.mh-line > span', { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.1 }, 0.2)
    .from('.mh-fade', { opacity: 0, y: 24, duration: 1, stagger: 0.08 }, 0.7)

  gsap.to('.mh-title', {
    yPercent: -30,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
  })
  if (props.ready) intro.play()
})
watch(() => props.ready, (r) => r && intro?.play())
</script>

<template>
  <section id="top" ref="root" class="hero" data-globe="hero">
    <div class="mh-top mono mh-fade">
      <span>Vol. 2026</span>
      <span>Updated {{ SOURCE.updated }}</span>
      <span class="hide-sm">{{ EVENTS.length }} stories · 1 planet</span>
    </div>
    <div class="mh-rule" />

    <h1 class="mh-title">
      <span class="mh-line"><span>The year,</span></span>
      <span class="mh-line"><span class="serif">for real.</span></span>
    </h1>

    <div class="mh-bottom">
      <p class="mh-sub mh-fade">
        Moon trips, World Cups, wars, weddings and one very fast Indy 500. Here’s what <em>actually</em>
        happened in 2026 — every story pinned to a spinning globe.
      </p>
      <button class="pill mh-fade" v-magnetic data-cursor="go" @click="getLenis()?.scrollTo('#numbers', { duration: 2 })">
        start reading ↓
      </button>
    </div>
    <div class="mh-rule" />
    <p class="mh-src mono mh-fade">
      facts via <a :href="SOURCE.url" target="_blank" rel="noopener">{{ SOURCE.publisher }}</a>, “{{ SOURCE.title }}”
    </p>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  padding: 96px var(--gutter) 32px;
}
.mh-top { display: flex; justify-content: space-between; gap: 16px; color: var(--muted); padding-bottom: 14px; }
.mh-rule { height: 1px; background: var(--line); transform-origin: left; }
.mh-title {
  margin-top: auto;
  font-size: clamp(72px, 13vw, 230px);
  line-height: 0.88;
  letter-spacing: -0.055em;
  font-weight: 700;
  max-width: 7ch;
}
.mh-line { display: block; overflow: hidden; padding-bottom: 0.04em; }
.mh-line > span { display: inline-block; }
.mh-line .serif { color: var(--red); font-weight: 300; letter-spacing: -0.03em; }
.mh-bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin: 40px 0 24px; flex-wrap: wrap; }
.mh-sub { max-width: 42ch; font-size: clamp(17px, 1.5vw, 21px); line-height: 1.45; color: #cfc9bd; }
.mh-sub em { font-family: var(--serif); color: var(--fg); }
.mh-src { margin-top: 14px; color: var(--muted); }
.mh-src a { color: var(--fg); text-decoration: underline; text-underline-offset: 3px; }

@media (max-width: 899px) {
  .hero { padding-top: 88px; }
  .mh-title { margin-top: 52vh; }
  .hide-sm { display: none; }
}
</style>
