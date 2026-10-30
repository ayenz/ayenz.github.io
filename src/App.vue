<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { initSmoothScroll, ScrollTrigger } from './composables/smooth.js'
import { scene } from './composables/mood.js'
import WebGLScene from './components/WebGLScene.vue'
import CustomCursor from './components/CustomCursor.vue'
import ThePreloader from './components/ThePreloader.vue'
import TheNav from './components/TheNav.vue'
import HeroSection from './components/HeroSection.vue'
import MarqueeTicker from './components/MarqueeTicker.vue'
import TimelineSection from './components/TimelineSection.vue'
import ManifestoSection from './components/ManifestoSection.vue'
import ObjectsSection from './components/ObjectsSection.vue'
import OracleSection from './components/OracleSection.vue'
import StatsSection from './components/StatsSection.vue'
import OutroSection from './components/OutroSection.vue'
import ToastStack from './components/ToastStack.vue'

const ready = ref(false)
let lenis

onMounted(async () => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  lenis = initSmoothScroll()
  await nextTick()

  // Retune the WebGL scene whenever a section crosses the middle of the screen.
  document.querySelectorAll('[data-mood]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && (scene.mood = el.dataset.mood),
    })
  })

  document.fonts?.ready.then(() => ScrollTrigger.refresh())
})

function onLoaded() {
  ready.value = true
  lenis.start()
  ScrollTrigger.refresh()
}
</script>

<template>
  <WebGLScene />
  <ThePreloader @done="onLoaded" />
  <TheNav />
  <main class="content">
    <HeroSection :ready="ready" />
    <MarqueeTicker />
    <TimelineSection />
    <ManifestoSection />
    <ObjectsSection />
    <OracleSection />
    <StatsSection />
    <OutroSection />
  </main>
  <ToastStack />
  <CustomCursor />
  <div class="grain" aria-hidden="true" />
</template>

<style>
.content { position: relative; z-index: 1; }
</style>
