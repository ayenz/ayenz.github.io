<script setup>
import { nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import gsap from 'gsap'
import { prints } from '../months.js'
import { getLenis } from '../../composables/smooth.js'

const index = defineModel({ type: Number, default: -1 })
const root = ref(null)
const img = ref(null)

watch(index, async (i, prev) => {
  if (i >= 0 && prev < 0) {
    getLenis()?.stop()
    await nextTick()
    gsap.fromTo(root.value, { clipPath: 'inset(50% 50% 50% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' })
    gsap.from('.lb-anim', { y: 40, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'expo.out', delay: 0.4 })
  } else if (i >= 0) {
    await nextTick()
    gsap.fromTo(img.value, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
  }
})

function close() {
  gsap.to(root.value, {
    clipPath: 'inset(50% 50% 50% 50%)',
    duration: 0.7,
    ease: 'expo.inOut',
    onComplete: () => {
      index.value = -1
      getLenis()?.start()
    },
  })
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
    <figure class="lb-fig" @click.self="close">
      <img ref="img" :src="prints[index].src" :alt="`${prints[index].m} 2026 — ${prints[index].caption}`" />
    </figure>
    <div class="lb-info">
      <span class="lb-anim mono">{{ prints[index].n }} / {{ prints[index].m }} 2026<template v-if="prints[index].place"> · {{ prints[index].place }}</template><template v-if="prints[index].of > 1"> · {{ prints[index].pi + 1 }}/{{ prints[index].of }}</template></span>
      <h3 class="lb-anim">{{ prints[index].title }}</h3>
      <p v-if="prints[index].of > 1 && prints[index].caption !== prints[index].title" class="lb-anim cap">“{{ prints[index].caption }}”</p>
      <p class="lb-anim">{{ prints[index].body }}</p>
    </div>
    <div class="lb-ctrl">
      <button class="pill" v-magnetic aria-label="Previous photo" @click="step(-1)">←</button>
      <button class="pill" v-magnetic aria-label="Next photo" @click="step(1)">→</button>
      <button class="pill" v-magnetic data-cursor="close" @click="close">close ✕</button>
    </div>
  </div>
</template>

<style scoped>
.lb {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(8, 8, 10, 0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: grid;
  grid-template-columns: 1fr minmax(260px, 360px);
  grid-template-rows: 1fr auto;
  gap: 24px 40px;
  padding: 88px var(--gutter) 32px;
}
.lb-fig { display: grid; place-items: center; min-height: 0; grid-row: 1 / 3; }
.lb-fig img { max-width: 100%; max-height: calc(100vh - 140px); object-fit: contain; border-radius: 16px; }
.lb-info { align-self: end; }
.lb-info .mono { color: var(--acid); }
.lb-info h3 { font-size: clamp(32px, 3.4vw, 52px); letter-spacing: -0.04em; line-height: 1; margin: 12px 0 14px; }
.lb-info p { color: #b9b8b0; line-height: 1.55; }
.lb-info .cap { font-family: var(--serif); font-style: italic; color: var(--acid); font-size: 22px; margin-bottom: 8px; }
.lb-ctrl { display: flex; gap: 8px; flex-wrap: wrap; }

@media (max-width: 899px) {
  .lb { grid-template-columns: 1fr; grid-template-rows: 1fr auto auto; padding-top: 80px; }
  .lb-fig { grid-row: auto; }
  .lb-fig img { max-height: 58vh; }
}
</style>
