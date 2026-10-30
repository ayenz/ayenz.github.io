<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { initSmoothScroll, ScrollTrigger } from '../composables/smooth.js'
import { globe } from './store.js'
import GlobeScene from './components/GlobeScene.vue'
import PressLoader from './components/PressLoader.vue'
import RealNav from './components/RealNav.vue'
import RealHero from './components/RealHero.vue'
import HeadlineTicker from './components/HeadlineTicker.vue'
import NumbersSection from './components/NumbersSection.vue'
import FeedSection from './components/FeedSection.vue'
import ArtemisFeature from './components/ArtemisFeature.vue'
import UpNext from './components/UpNext.vue'
import CreditsFooter from './components/CreditsFooter.vue'
import CustomCursor from '../components/CustomCursor.vue'
import ToastStack from '../components/ToastStack.vue'

const ready = ref(false)
let lenis

onMounted(async () => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  lenis = initSmoothScroll()
  await nextTick()

  // Move the globe into a different spot for each section.
  document.querySelectorAll('[data-globe]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && (globe.mode = el.dataset.globe),
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
  <GlobeScene />
  <PressLoader @done="onLoaded" />
  <RealNav />
  <main class="content">
    <RealHero :ready="ready" />
    <HeadlineTicker />
    <NumbersSection />
    <FeedSection />
    <ArtemisFeature />
    <UpNext />
    <CreditsFooter />
  </main>
  <ToastStack />
  <CustomCursor />
  <div class="grain" aria-hidden="true" />
</template>

<style>
.content { position: relative; z-index: 1; }
</style>
