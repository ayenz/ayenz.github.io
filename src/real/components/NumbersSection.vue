<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { NUMBERS } from '../events.js'

const root = ref(null)
const els = ref([])

onMounted(() => {
  NUMBERS.forEach((n, i) => {
    const o = { v: 0 }
    const d = n.decimals || 0
    gsap.to(o, {
      v: n.value,
      duration: 2.6,
      ease: 'expo.out',
      scrollTrigger: { trigger: els.value[i], start: 'top 88%' },
      onUpdate: () => {
        els.value[i].textContent = o.v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
      },
    })
  })
  gsap.from(root.value.querySelectorAll('.cell'), {
    y: 80,
    opacity: 0,
    duration: 1.2,
    stagger: { each: 0.08, grid: 'auto', from: 'start' },
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value.querySelector('.grid'), start: 'top 80%' },
  })
})
</script>

<template>
  <section id="numbers" ref="root" class="section numbers" data-globe="numbers">
    <p class="eyebrow mono">by the numbers</p>
    <h2 class="h2">2026, in <span class="serif">eight</span> numbers.</h2>
    <div class="grid">
      <div v-for="(n, i) in NUMBERS" :key="n.label" class="cell" v-tilt="6" data-cursor="wow">
        <div class="val">
          <span class="fix">{{ n.prefix }}</span><span :ref="(el) => (els[i] = el)">0</span><span class="fix">{{ n.suffix }}</span>
        </div>
        <p>{{ n.label }}</p>
        <div class="glare" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.numbers { min-height: 100vh; }
.h2 { font-size: clamp(44px, 7vw, 112px); letter-spacing: -0.05em; line-height: 0.95; margin-bottom: 56px; max-width: 12ch; }
.h2 .serif { color: var(--red); }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.cell {
  position: relative;
  padding: 28px 22px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: rgba(14, 14, 17, 0.6);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  transition: border-color 0.4s;
}
.cell:hover { border-color: var(--red); }
.val {
  font-size: clamp(34px, 3.6vw, 60px);
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.fix { color: var(--red); }
.cell p { color: var(--muted); line-height: 1.4; font-size: 15px; margin-top: 24px; }
.glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255, 59, 31, 0.16), transparent 50%);
  opacity: 0;
  transition: opacity 0.4s;
}
.cell:hover .glare { opacity: 1; }

@media (max-width: 1100px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) {
  .grid { grid-template-columns: 1fr; }
  .cell { min-height: 0; }
}
</style>
