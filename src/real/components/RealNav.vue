<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { getLenis } from '../../composables/smooth.js'

const progress = ref(null)
const links = [
  { id: 'numbers', label: 'Numbers' },
  { id: 'feed', label: 'Timeline' },
  { id: 'artemis', label: 'Artemis II' },
  { id: 'next', label: 'Up next' },
]

onMounted(() => {
  gsap.to(progress.value, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } })
})

const go = (id) => getLenis()?.scrollTo(`#${id}`, { duration: 2 })
</script>

<template>
  <header class="nav">
    <a href="#top" class="logo" v-magnetic @click.prevent="go('top')">
      <span class="dot" />REAL<em>//</em>2026
    </a>
    <nav class="links">
      <a v-for="l in links" :key="l.id" :href="`#${l.id}`" class="mono" v-scramble @click.prevent="go(l.id)">{{ l.label }}</a>
    </nav>
    <a href="/signal/" class="pill fake" v-magnetic data-cursor="lol">fake version ↗</a>
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
  background: linear-gradient(to bottom, rgba(8, 8, 10, 0.85), rgba(8, 8, 10, 0));
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.logo { display: flex; align-items: center; gap: 10px; font-weight: 700; letter-spacing: -0.02em; }
.logo em { font-style: normal; color: var(--red); }
.dot { width: 10px; height: 10px; border-radius: 50%; background: var(--red); box-shadow: 0 0 0 0 var(--red); animation: ping 1.8s infinite; }
@keyframes ping { 70% { box-shadow: 0 0 0 10px rgba(255, 59, 31, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 59, 31, 0); } }
.links { display: flex; gap: 28px; }
.links a { color: var(--muted); transition: color 0.3s; }
.links a:hover { color: var(--fg); }
.fake { padding: 10px 18px; }
.progress { position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: var(--line); }
.progress span { display: block; height: 100%; background: var(--red); transform: scaleX(0); transform-origin: left; }

@media (max-width: 760px) {
  .links { display: none; }
}
</style>
