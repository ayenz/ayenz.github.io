<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { initSmoothScroll, ScrollTrigger } from '../composables/smooth.js'
import { scene } from '../composables/mood.js'
import WebGLScene from '../components/WebGLScene.vue'
import CustomCursor from '../components/CustomCursor.vue'
import ThePreloader from '../components/ThePreloader.vue'
import MarqueeTicker from '../components/MarqueeTicker.vue'
import HomeNav from './components/HomeNav.vue'
import HomeHero from './components/HomeHero.vue'
import PhotoTimeline from './components/PhotoTimeline.vue'
import PhotoLightbox from './components/PhotoLightbox.vue'
import HomeOutro from './components/HomeOutro.vue'
import HomeManifesto from './components/HomeManifesto.vue'

const ready = ref(false)
const open = ref(-1)
let lenis

const rows = [
  ['ten months', 'ten photos', 'zero filters (ok, a few)', 'camera roll: 98% full'],
  ['mostly true captions', 'blurry but iconic', 'it’s giving memories', 'storage almost full'],
]
const log = [
  'opening camera roll',
  'deleting 400 screenshots of memes',
  'finding the one good photo per month',
  'writing captions (lightly fictional)',
  'feeding the shaders',
  'ok we good',
]

onMounted(async () => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  lenis = initSmoothScroll()
  await nextTick()
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
  <ThePreloader brand="MY//2026" tagline="ten months, ten photos" :log="log" @done="onLoaded" />
  <HomeNav />
  <main class="content">
    <HomeHero :ready="ready" />
    <MarqueeTicker :rows="rows" />
    <PhotoTimeline @open="open = $event" />
    <HomeManifesto />
    <HomeOutro />
  </main>
  <PhotoLightbox v-model="open" />
  <CustomCursor />
  <div class="grain" aria-hidden="true" />
</template>

<style>
.content { position: relative; z-index: 1; }
</style>
