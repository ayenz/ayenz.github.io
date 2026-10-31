<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { initSmoothScroll, ScrollTrigger } from '../composables/smooth.js'
import { film } from './store.js'
import FilmScene from './components/FilmScene.vue'
import DarkroomLoader from './components/DarkroomLoader.vue'
import FilmCursor from './components/FilmCursor.vue'
import FilmNav from './components/FilmNav.vue'
import FilmHero from './components/FilmHero.vue'
import FilmStrip from './components/FilmStrip.vue'
import PhotoDesk from './components/PhotoDesk.vue'
import FilmLightbox from './components/FilmLightbox.vue'
import FilmManifesto from './components/FilmManifesto.vue'
import FilmOutro from './components/FilmOutro.vue'
import RouteMap from './components/RouteMap.vue'
import LabReceipt from './components/LabReceipt.vue'
import LetterTo2026 from './components/LetterTo2026.vue'

const ready = ref(false)
const open = ref(-1)
let lenis

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
      onToggle: (self) => self.isActive && (film.mood = el.dataset.mood),
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
  <FilmScene />
  <DarkroomLoader @done="onLoaded" />
  <FilmNav />
  <main class="content">
    <FilmHero :ready="ready" />
    <FilmStrip />
    <PhotoDesk @open="open = $event" />
    <FilmManifesto />
    <RouteMap />
    <LabReceipt />
    <LetterTo2026 />
    <FilmOutro />
  </main>
  <FilmLightbox v-model="open" />
  <FilmCursor />
  <div class="grain" aria-hidden="true" />
</template>

<style>
.content { position: relative; z-index: 1; }
@media (hover: hover) and (pointer: fine) {
  body, a, button { cursor: none; }
}
</style>
