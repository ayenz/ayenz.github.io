<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { film } from '../store.js'

const emit = defineEmits(['done'])
const root = ref(null)
const frame = ref('00')
const step = ref('loading the roll')
const STEPS = ['loading the roll', 'developer: 7 min', 'stop bath', 'fixer: 5 min', 'rinse', 'hanging to dry']

onMounted(() => {
  const c = { v: 0 }
  gsap.timeline()
    .to(c, {
      v: 12,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate() {
        frame.value = String(Math.round(c.v)).padStart(2, '0')
        step.value = STEPS[Math.min(STEPS.length - 1, Math.floor((c.v / 12) * STEPS.length))]
      },
    })
    .to('.dr-strip-inner', { xPercent: -50, duration: 3, ease: 'power2.inOut' }, 0)
    .to('.dr-glow', { opacity: 0.25, duration: 0.15, yoyo: true, repeat: 7, ease: 'none' }, 0.4)
    .add(() => { film.flash++; emit('done') }, '+=0.2')
    .to(root.value, { opacity: 0, duration: 0.5 }, '<')
    .set(root.value, { display: 'none' })
})
</script>

<template>
  <div ref="root" class="dr">
    <div class="dr-glow" />
    <div class="dr-top mono"><span>FILM//2025</span><span>darkroom · do not open</span></div>
    <div class="dr-mid">
      <div class="dr-strip">
        <div class="dr-strip-inner">
          <span v-for="i in 24" :key="i" class="dr-frame"><b class="mono">{{ String(((i - 1) % 12) + 1).padStart(2, '0') }}A</b></span>
        </div>
      </div>
    </div>
    <div class="dr-bottom">
      <span class="dr-num">{{ frame }}<small>/12</small></span>
      <span class="mono">{{ step }}…</span>
    </div>
  </div>
</template>

<style scoped>
.dr {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: radial-gradient(circle at 50% 40%, #5a0d06, #1a0302 70%);
  color: #ff6a4d;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--gutter);
}
.dr-glow { position: absolute; inset: 0; background: #ff2a0a; opacity: 0; mix-blend-mode: screen; pointer-events: none; }
.dr-top, .dr-bottom { position: relative; display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
.dr-strip { position: relative; overflow: hidden; margin: 0 calc(var(--gutter) * -1); }
.dr-strip-inner { display: flex; width: max-content; background: #120201; padding: 22px 0; position: relative; }
.dr-strip-inner::before, .dr-strip-inner::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 10px;
  background: repeating-linear-gradient(90deg, transparent 0 10px, #ff6a4d33 10px 22px);
}
.dr-strip-inner::before { top: 6px; }
.dr-strip-inner::after { bottom: 6px; }
.dr-frame {
  width: clamp(120px, 18vw, 220px);
  aspect-ratio: 3 / 2;
  margin-right: 10px;
  background: linear-gradient(135deg, #3a0804, #7a1a0c);
  position: relative;
}
.dr-frame b { position: absolute; left: 8px; bottom: 6px; font-size: 11px; }
.dr-num { font-family: var(--serif); font-style: italic; font-size: clamp(96px, 20vw, 300px); line-height: 0.8; }
.dr-num small { font-size: 0.25em; }
</style>
