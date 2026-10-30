<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { getLenis } from '../../composables/smooth.js'
import YearSwitch from '../../components/YearSwitch.vue'

const time = ref('')
const progress = ref(null)
let timer

onMounted(() => {
  const update = () => (time.value = new Date().toLocaleTimeString('en-GB', { hour12: false }))
  update()
  timer = setInterval(update, 1000)
  gsap.to(progress.value, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } })
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <header class="nav">
    <a href="#hero" class="logo" v-magnetic @click.prevent="getLenis()?.scrollTo(0, { duration: 2 })">
      <span class="logo-mark" />
      <span>MY<em>//</em>2026</span>
    </a>
    <div class="nav-mid mono">
      <span class="live"><i /> live</span>
      <span>{{ time }}</span>
    </div>
    <div class="right">
      <YearSwitch :current="2026" />
      <a href="/world/" class="pill" v-magnetic data-cursor="globe">the world’s 2026 ↗</a>
    </div>
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
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px var(--gutter);
}
.logo { display: flex; align-items: center; gap: 10px; font-weight: 700; letter-spacing: -0.02em; mix-blend-mode: difference; }
.logo em { font-style: normal; color: var(--acid); }
.logo-mark {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--fg);
  position: relative;
  animation: spin 4s linear infinite;
}
.logo-mark::after {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  width: 5px;
  height: 5px;
  margin-left: -2.5px;
  border-radius: 50%;
  background: var(--acid);
}
@keyframes spin { to { transform: rotate(360deg); } }
.nav-mid { display: flex; gap: 24px; }
.live { display: flex; align-items: center; gap: 8px; }
.live i { width: 6px; height: 6px; border-radius: 50%; background: #ff3d3d; animation: blink 1.2s infinite; }
@keyframes blink { 50% { opacity: 0.2; } }
.pill { padding: 10px 18px; background: rgba(10, 10, 12, 0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.right { display: flex; align-items: center; gap: 10px; }
.progress { position: absolute; left: 0; right: 0; bottom: 0; height: 1px; }
.progress span { display: block; height: 100%; background: var(--acid); transform: scaleX(0); transform-origin: left; }

@media (max-width: 640px) {
  .nav-mid { display: none; }
  .right .pill { display: none; }
}
</style>
