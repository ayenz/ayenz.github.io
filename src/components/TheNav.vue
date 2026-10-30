<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { getLenis } from '../composables/smooth.js'

const open = ref(false)
const time = ref('')
const progress = ref(null)
let timer, tl

const links = [
  { id: 'hero', label: 'Intro', note: '00' },
  { id: 'timeline', label: 'The Year', note: '12 mo' },
  { id: 'manifesto', label: 'Manifesto', note: 'read it' },
  { id: 'objects', label: 'Objects', note: '06' },
  { id: 'oracle', label: 'Oracle', note: 'ask' },
  { id: 'outro', label: 'Goodbye', note: 'eventually' },
]

onMounted(() => {
  const update = () => {
    time.value = new Date().toLocaleTimeString('en-GB', { hour12: false })
  }
  update()
  timer = setInterval(update, 1000)

  gsap.to(progress.value, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: true },
  })

  tl = gsap.timeline({ paused: true })
    .to('.menu', { clipPath: 'circle(150% at calc(100% - 48px) 40px)', duration: 0.9, ease: 'expo.inOut' })
    .from('.menu-link .txt', { yPercent: 120, rotate: 6, duration: 0.8, stagger: 0.05, ease: 'expo.out' }, '-=0.4')
    .from('.menu-foot', { opacity: 0, y: 20, duration: 0.5 }, '-=0.6')
})

onBeforeUnmount(() => clearInterval(timer))

function toggle() {
  open.value = !open.value
  const lenis = getLenis()
  if (open.value) { tl.timeScale(1).play(); lenis?.stop() }
  else { tl.timeScale(1.6).reverse(); lenis?.start() }
}

function go(id) {
  if (open.value) toggle()
  getLenis()?.scrollTo(`#${id}`, { duration: 2, offset: 0 })
}
</script>

<template>
  <header class="nav">
    <a href="#hero" class="logo" @click.prevent="go('hero')" v-magnetic>
      <span class="logo-mark" />
      <span>SIGNAL<em>//</em>2026</span>
    </a>
    <div class="nav-mid mono">
      <span class="live"><i /> live</span>
      <span>{{ time }}</span>
    </div>
    <button class="burger" :class="{ open }" @click="toggle" v-magnetic="0.5" aria-label="Toggle menu">
      <span /><span />
    </button>
    <div class="progress"><span ref="progress" /></div>
  </header>

  <nav class="menu" :aria-hidden="!open">
    <ul>
      <li v-for="(l, i) in links" :key="l.id">
        <a :href="`#${l.id}`" class="menu-link" @click.prevent="go(l.id)" data-cursor="go">
          <span class="idx mono">0{{ i + 1 }}</span>
          <span class="mask"><span class="txt">{{ l.label }}</span></span>
          <span class="note serif">{{ l.note }}</span>
        </a>
      </li>
    </ul>
    <div class="menu-foot mono">
      <span>all events are made up. probably.</span>
      <span>built with vue, three.js, gsap &amp; too much coffee</span>
    </div>
  </nav>
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
  padding: 20px var(--gutter);
  mix-blend-mode: difference;
}
.logo { display: flex; align-items: center; gap: 10px; font-weight: 700; letter-spacing: -0.02em; }
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
.nav-mid { display: flex; gap: 24px; color: var(--fg); }
.live { display: flex; align-items: center; gap: 8px; }
.live i { width: 6px; height: 6px; border-radius: 50%; background: #ff3d3d; animation: blink 1.2s infinite; }
@keyframes blink { 50% { opacity: 0.2; } }
.burger {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid rgba(236, 235, 228, 0.4);
  display: grid;
  place-content: center;
  gap: 6px;
}
.burger span { display: block; width: 20px; height: 1.5px; background: var(--fg); transition: transform 0.5s var(--ease); }
.burger.open span:first-child { transform: translateY(3.75px) rotate(45deg); }
.burger.open span:last-child { transform: translateY(-3.75px) rotate(-45deg); }
.progress { position: absolute; left: 0; right: 0; bottom: 0; height: 1px; }
.progress span {
  display: block;
  height: 100%;
  background: var(--fg);
  transform: scaleX(0);
  transform-origin: left;
}

.menu {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: var(--acid);
  color: var(--bg);
  clip-path: circle(0% at calc(100% - 48px) 40px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 100px var(--gutter) 32px;
}
.menu ul { list-style: none; }
.menu-link {
  display: flex;
  align-items: baseline;
  gap: 20px;
  border-bottom: 1px solid rgba(10, 10, 12, 0.15);
  padding: 4px 0;
  transition: padding 0.5s var(--ease);
}
.menu-link:hover { padding-left: 24px; }
.mask { overflow: hidden; display: block; flex: 1; }
.txt {
  display: block;
  font-size: clamp(40px, 8.5vw, 120px);
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 1;
}
.note { font-size: clamp(18px, 2vw, 28px); opacity: 0; transform: translateX(-20px); transition: 0.5s var(--ease); }
.menu-link:hover .note { opacity: 1; transform: none; }
.menu-foot {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 32px;
}

@media (max-width: 640px) {
  .nav-mid span:last-child { display: none; }
  .note { display: none; }
}
</style>
