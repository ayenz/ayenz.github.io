<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { getLenis } from '../../composables/smooth.js'
import YearSwitch from '../../components/YearSwitch.vue'

const progress = ref(null)
const exp = ref('00')

onMounted(() => {
  gsap.to(progress.value, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: true, onUpdate: (s) => (exp.value = String(Math.round(s.progress * 36)).padStart(2, '0')) },
  })
})
</script>

<template>
  <header class="nav">
    <a href="#top" class="logo" v-magnetic @click.prevent="getLenis()?.scrollTo(0, { duration: 2 })">
      <span class="lens" /><span>FILM<em>//</em>2025</span>
    </a>
    <span class="exp mono">exp. {{ exp }}/36 · iso 400</span>
    <YearSwitch :current="2025" />
    <div class="progress"><span ref="progress" /></div>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px var(--gutter);
  background: linear-gradient(to bottom, rgba(239, 230, 214, 0.9), rgba(239, 230, 214, 0));
}
.logo { display: flex; align-items: center; gap: 10px; font-weight: 800; letter-spacing: -0.02em; }
.logo em { font-style: normal; color: var(--acid); }
.lens { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--fg); box-shadow: inset 0 0 0 3px var(--bg), inset 0 0 0 8px var(--acid); }
.exp { color: var(--muted); font-size: 12px; }
.progress { position: absolute; left: var(--gutter); right: var(--gutter); bottom: 0; height: 6px; background: repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 12px); }
.progress span { display: block; height: 100%; background: repeating-linear-gradient(90deg, var(--acid) 0 6px, transparent 6px 12px); transform: scaleX(0); transform-origin: left; }

@media (max-width: 640px) { .exp { display: none; } }
</style>
