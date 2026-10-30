<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['done'])
const root = ref(null)
const count = ref(0)
const lines = ref([])

const LOG = [
  'booting vibes.exe',
  'calibrating chaos levels',
  'downloading 2026 (this might take a year)',
  'feeding the shaders',
  'convincing the GPU this is fine',
  'ok we good',
]

onMounted(() => {
  const counter = { v: 0 }
  const tl = gsap.timeline()
  tl.to(counter, {
    v: 100,
    duration: 3.2,
    ease: 'power2.inOut',
    onUpdate() {
      count.value = Math.round(counter.v)
      const idx = Math.min(LOG.length, Math.floor((counter.v / 100) * LOG.length) + 1)
      if (lines.value.length < idx) lines.value = LOG.slice(0, idx)
    },
  })
    .to('.pre-bar span', { scaleX: 1, duration: 3.2, ease: 'power2.inOut' }, 0)
    .to('.pre-count', { yPercent: -110, duration: 0.7, ease: 'expo.in' }, '+=0.2')
    .to('.pre-log, .pre-bar, .pre-meta', { opacity: 0, duration: 0.4 }, '<')
    .add(() => emit('done'))
    .to('.pre-panel', {
      yPercent: (i) => (i % 2 ? 100 : -100),
      duration: 1.1,
      ease: 'expo.inOut',
      stagger: 0.06,
    })
    .set(root.value, { display: 'none' })
})
</script>

<template>
  <div ref="root" class="preloader">
    <div class="panels">
      <div v-for="i in 5" :key="i" class="pre-panel" />
    </div>
    <div class="pre-inner">
      <div class="pre-meta mono">
        <span>SIGNAL//2026</span>
        <span>an almanac of a year that refused to be normal</span>
      </div>
      <ul class="pre-log mono">
        <li v-for="(l, i) in lines" :key="l">
          <span class="ok">[{{ i === lines.length - 1 && count < 100 ? '..' : 'ok' }}]</span> {{ l }}
        </li>
      </ul>
      <div class="pre-bottom">
        <div class="pre-count-wrap">
          <div class="pre-count">{{ String(count).padStart(3, '0') }}</div>
        </div>
        <div class="pre-bar"><span /></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preloader { position: fixed; inset: 0; z-index: 500; }
.panels { position: absolute; inset: 0; display: flex; }
.pre-panel { flex: 1; height: 100%; background: var(--bg-2); border-right: 1px solid var(--line); }
.pre-inner {
  position: absolute;
  inset: 0;
  padding: var(--gutter);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.pre-meta { display: flex; justify-content: space-between; gap: 16px; color: var(--muted); flex-wrap: wrap; }
.pre-log { list-style: none; display: grid; gap: 6px; color: var(--fg); }
.pre-log .ok { color: var(--acid); }
.pre-count-wrap { overflow: hidden; }
.pre-count {
  font-size: clamp(96px, 28vw, 380px);
  line-height: 0.85;
  font-weight: 700;
  letter-spacing: -0.06em;
}
.pre-bar { height: 2px; background: var(--line); margin-top: 16px; }
.pre-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--acid), var(--pink));
  transform: scaleX(0);
  transform-origin: left;
}
</style>
