<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { getLenis } from '../composables/smooth.js'
import { scene } from '../composables/mood.js'
import { toast } from '../composables/toast.js'

const root = ref(null)
const left = ref({ d: '00', h: '00', m: '00', s: '00' })
const word = 'SEE YOU IN 2027'.split('')
let timer

function update() {
  const diff = Math.max(0, new Date('2027-01-01T00:00:00') - new Date())
  const pad = (n) => String(Math.floor(n)).padStart(2, '0')
  left.value = {
    d: pad(diff / 864e5),
    h: pad((diff / 36e5) % 24),
    m: pad((diff / 6e4) % 60),
    s: pad((diff / 1e3) % 60),
  }
}

onMounted(() => {
  update()
  timer = setInterval(update, 1000)
  gsap.from(root.value.querySelectorAll('.big span'), {
    yPercent: 100,
    opacity: 0,
    rotate: 12,
    stagger: 0.03,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value.querySelector('.big'), start: 'top 90%' },
  })
})
onBeforeUnmount(() => clearInterval(timer))

function wave(i) {
  const spans = root.value.querySelectorAll('.big span')
  spans.forEach((s, j) => {
    const d = Math.abs(i - j)
    if (d > 4) return
    gsap.fromTo(s, { y: 0 }, { y: -(5 - d) * 8, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out', delay: d * 0.04 })
  })
}

function replay() {
  scene.pulse++
  toast('Rewinding 2026... hold on to something.')
  getLenis()?.scrollTo(0, { duration: 3 })
}
</script>

<template>
  <section id="outro" ref="root" class="outro" data-mood="outro">
    <div class="count mono">
      <span>time left in 2026</span>
      <div class="clock">
        <div><b>{{ left.d }}</b><i>days</i></div>
        <div><b>{{ left.h }}</b><i>hrs</i></div>
        <div><b>{{ left.m }}</b><i>min</i></div>
        <div><b>{{ left.s }}</b><i>sec</i></div>
      </div>
    </div>

    <h2 class="big" aria-label="See you in 2027">
      <span v-for="(c, i) in word" :key="i" :class="{ sp: c === ' ' }" @pointerenter="wave(i)">{{ c === ' ' ? ' ' : c }}</span>
    </h2>

    <div class="actions">
      <button class="pill" v-magnetic @click="replay">↺ replay the year</button>
      <a class="pill" href="https://github.com/ayenz" target="_blank" rel="noopener" v-magnetic v-scramble>github</a>
    </div>

    <footer class="foot mono">
      <span>© 2026 SIGNAL//2026</span>
      <span>every event here is made up. probably.</span>
      <span>built with vue · three · gsap · lenis</span>
    </footer>
  </section>
</template>

<style scoped>
.outro {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 120px var(--gutter) 24px;
  position: relative;
}
.count { color: var(--muted); }
.clock { display: flex; gap: clamp(16px, 4vw, 48px); margin-top: 16px; }
.clock div { display: flex; flex-direction: column; gap: 4px; }
.clock b {
  font-family: var(--sans);
  font-size: clamp(36px, 6vw, 80px);
  color: var(--fg);
  font-weight: 500;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}
.big {
  display: flex;
  flex-wrap: wrap;
  font-size: clamp(56px, 12.5vw, 260px);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 0.9;
  margin: 8vh 0 40px;
}
.big span { display: inline-block; transition: color 0.3s; }
.big span:hover { color: var(--acid); }
.actions { display: flex; gap: 12px; flex-wrap: wrap; }
.foot {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 64px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 11px;
}
</style>
