<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['done'])
const root = ref(null)
const count = ref(0)
const month = ref('JAN')
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT']

onMounted(() => {
  const c = { v: 0 }
  gsap.timeline()
    .to(c, {
      v: 100,
      duration: 2.8,
      ease: 'power2.inOut',
      onUpdate() {
        count.value = Math.round(c.v)
        month.value = MONTHS[Math.min(MONTHS.length - 1, Math.floor((c.v / 100) * MONTHS.length))]
      },
    })
    .to('.pl-fill', { scaleY: 1, duration: 2.8, ease: 'power2.inOut' }, 0)
    .to('.pl-row > *', { yPercent: -120, duration: 0.7, ease: 'expo.in', stagger: 0.05 }, '+=0.15')
    .add(() => emit('done'))
    .to(root.value, { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'expo.inOut' })
    .set(root.value, { display: 'none' })
})
</script>

<template>
  <div ref="root" class="loader">
    <div class="pl-fill" />
    <div class="pl-inner">
      <div class="pl-row mono"><span>REAL//2026</span><span>printing the year</span></div>
      <div class="pl-row big">
        <span class="serif">{{ month }}</span>
        <span class="num">{{ String(count).padStart(3, '0') }}</span>
      </div>
      <div class="pl-row mono"><span>source: britannica</span><span>updated oct. 28, 2026</span></div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: var(--fg);
  color: var(--bg);
  clip-path: inset(0 0 0 0);
}
.pl-fill {
  position: absolute;
  inset: 0;
  background: var(--red);
  transform: scaleY(0);
  transform-origin: bottom;
}
.pl-inner {
  position: relative;
  height: 100%;
  padding: var(--gutter);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.pl-row { display: flex; justify-content: space-between; gap: 16px; overflow: hidden; }
.big { align-items: flex-end; font-size: clamp(80px, 22vw, 340px); line-height: 0.85; }
.big .serif { font-weight: 300; }
.num { font-weight: 700; letter-spacing: -0.06em; font-variant-numeric: tabular-nums; }
</style>
