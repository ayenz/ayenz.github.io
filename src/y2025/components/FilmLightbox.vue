<script setup>
import { nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import gsap from 'gsap'
import { prints } from '../months.js'
import { getLenis } from '../../composables/smooth.js'

const index = defineModel({ type: Number, default: -1 })
const root = ref(null)
const img = ref(null)

watch(index, async (i, prev) => {
  await nextTick()
  if (i >= 0 && prev < 0) {
    getLenis()?.stop()
    gsap.fromTo(root.value, { opacity: 0 }, { opacity: 1, duration: 0.4 })
    gsap.fromTo('.lb-print', { y: 120, rotate: -8, opacity: 0 }, { y: 0, rotate: -1.5, opacity: 1, duration: 1, ease: 'expo.out' })
    gsap.from('.lb-anim', { y: 30, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'expo.out', delay: 0.3 })
  }
  if (i >= 0) {
    gsap.fromTo(img.value, { filter: 'sepia(1) brightness(1.9) contrast(0.45) blur(4px)' }, { filter: 'sepia(0) brightness(1) contrast(1) blur(0px)', duration: 1.6, ease: 'power2.out' })
  }
})

function close() {
  gsap.to(root.value, { opacity: 0, duration: 0.4, onComplete: () => { index.value = -1; getLenis()?.start() } })
}
function step(dir) {
  index.value = (index.value + dir + prints.length) % prints.length
}
const onKey = (e) => {
  if (index.value < 0) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') step(1)
  if (e.key === 'ArrowLeft') step(-1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-if="index >= 0" ref="root" class="lb" role="dialog" aria-modal="true" @click.self="close">
    <figure class="lb-print" @click.self="close">
      <img ref="img" :src="prints[index].src" :alt="`${prints[index].m} 2025 — ${prints[index].caption}`" />
    </figure>
    <div class="lb-info">
      <span class="lb-anim mono">frame {{ prints[index].n }}{{ 'ABCDEFGH'[prints[index].pi] }} · {{ prints[index].m }} 2025<template v-if="prints[index].place"> · {{ prints[index].place }}</template><template v-if="prints[index].of > 1"> · {{ prints[index].pi + 1 }}/{{ prints[index].of }}</template></span>
      <h3 class="lb-anim">{{ prints[index].title }}</h3>
      <p v-if="prints[index].of > 1" class="lb-anim cap">“{{ prints[index].caption }}”</p>
      <p class="lb-anim">{{ prints[index].body }}</p>
      <div class="lb-ctrl lb-anim">
        <button class="pill" v-magnetic aria-label="Previous photo" @click="step(-1)">←</button>
        <button class="pill" v-magnetic aria-label="Next photo" @click="step(1)">→</button>
        <button class="pill" v-magnetic data-cursor="close" @click="close">close ✕</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lb {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(239, 230, 214, 0.92);
  backdrop-filter: blur(14px) sepia(0.3);
  -webkit-backdrop-filter: blur(14px) sepia(0.3);
  display: grid;
  grid-template-columns: 1fr minmax(260px, 360px);
  align-items: center;
  gap: 40px;
  padding: 88px var(--gutter) 32px;
}
.lb-print { justify-self: center; background: var(--paper); padding: 14px 14px 48px; box-shadow: 0 40px 80px -20px rgba(60, 40, 20, 0.5); max-height: calc(100vh - 130px); display: flex; }
.lb-print img { max-width: 100%; max-height: calc(100vh - 200px); object-fit: contain; }
.lb-info .mono { color: var(--acid); font-size: 13px; }
.lb-info h3 { font-family: var(--hand); font-size: clamp(42px, 4vw, 60px); line-height: 1; margin: 12px 0 14px; }
.lb-info p { color: #5a5048; line-height: 1.55; }
.lb-info .cap { font-family: var(--hand); font-size: 26px; color: var(--pink); line-height: 1.1; margin-bottom: 8px; }
.lb-ctrl { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 24px; }

@media (max-width: 899px) {
  .lb { grid-template-columns: 1fr; align-content: center; gap: 20px; padding-top: 76px; overflow-y: auto; }
  .lb-print img { max-height: 52vh; }
}
</style>
