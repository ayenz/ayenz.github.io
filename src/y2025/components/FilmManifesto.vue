<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'

// Summed up from the twelve months on the roll.
const text =
  '2025 was the year of *showing up* — for old friends, for my support pillars, for a first date off a dating app. Plans changed (bye, ^new office^), but the people stayed. Looking back, most of my favourite frames are just ~good food~ with good people. Honestly? That’s the whole point. *Keep the roll running.*'

// *phrase* = highlighter, ^phrase^ = red-pen circle, ~phrase~ = scribbled underline
const words = text.match(/\*[^*]+\*|\^[^^]+\^|~[^~]+~|\S+/g).map((raw) => {
  if (raw.startsWith('*')) return { w: raw.slice(1, -1), kind: 'mark' }
  if (raw.startsWith('^')) return { w: raw.slice(1, -1), kind: 'circle' }
  if (raw.startsWith('~')) return { w: raw.slice(1, -1), kind: 'under' }
  return { w: raw, kind: '' }
})

const root = ref(null)
let mm

onMounted(() => {
  mm = gsap.matchMedia()
  mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }, (ctx) => {
    const el = root.value
    const tl = gsap.timeline({
      scrollTrigger: ctx.conditions.desktop
        ? { trigger: el, start: 'top top', end: '+=140%', pin: true, scrub: 1 }
        : { trigger: el.querySelector('.copy'), start: 'top 80%', end: 'bottom 40%', scrub: 1 },
    })
    tl.fromTo(el.querySelectorAll('.w'), { opacity: 0.1, y: 10, filter: 'blur(5px) sepia(1)' }, { opacity: 1, y: 0, filter: 'blur(0px) sepia(0)', stagger: 0.05, ease: 'none', duration: 0.4 }, 0)
    el.querySelectorAll('.w[data-kind]').forEach((w) => {
      const at = Number(w.dataset.i) * 0.05 + 0.05
      const k = w.dataset.kind
      if (k === 'mark') tl.fromTo(w, { backgroundSize: '0% 42%' }, { backgroundSize: '100% 42%', duration: 0.2 }, at)
      else {
        const path = w.querySelector('path')
        const len = path.getTotalLength()
        tl.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.25 }, at)
      }
    })
    tl.from(el.querySelector('.sign'), { opacity: 0, y: 20, rotate: -4, duration: 0.2 }, '>')
  })
})
onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section id="manifesto" ref="root" class="mani" data-mood="manifesto">
    <div class="sheet">
      <p class="eyebrow mono">notes from the darkroom</p>
      <p class="copy">
        <template v-for="(item, i) in words" :key="i">
          <span class="w" :class="item.kind" :data-kind="item.kind || null" :data-i="i">
            {{ item.w }}
            <svg v-if="item.kind === 'circle'" class="ink" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true">
              <path d="M30 14 C 120 0, 196 18, 194 42 C 192 70, 80 80, 22 66 C -6 56, 4 26, 46 16" />
            </svg>
            <svg v-if="item.kind === 'under'" class="ink under-svg" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 12 C 40 4, 70 18, 110 9 S 180 6, 198 12" />
            </svg>
          </span>{{ ' ' }}
        </template>
      </p>
      <p class="sign">— me, 2025</p>
    </div>
  </section>
</template>

<style scoped>
.mani { min-height: 100vh; display: grid; place-items: center; padding: 96px var(--gutter) 64px; }
.sheet {
  position: relative;
  max-width: 1100px;
  width: 100%;
  padding: clamp(28px, 5vw, 72px);
  background: var(--paper);
  box-shadow: 0 30px 70px -30px rgba(60, 40, 20, 0.45);
  transform: rotate(-0.6deg);
  background-image: repeating-linear-gradient(transparent 0 calc(1.25em - 1px), rgba(47, 111, 106, 0.14) calc(1.25em - 1px) 1.25em);
  background-size: 100% 1.25em;
  font-size: clamp(26px, min(3.8vw, 6vh), 60px);
}
.copy { font-family: var(--serif); line-height: 1.25; letter-spacing: -0.01em; }
.w { display: inline-block; position: relative; }
.w.mark {
  background-image: linear-gradient(transparent, transparent), linear-gradient(rgba(255, 170, 60, 0.75), rgba(255, 170, 60, 0.75));
  background-repeat: no-repeat;
  background-position: 0 72%;
  background-size: 100% 42%;
  padding: 0 0.08em;
}
.ink { position: absolute; overflow: visible; pointer-events: none; }
.ink path { fill: none; stroke: var(--pink); stroke-width: 2.5; stroke-linecap: round; vector-effect: non-scaling-stroke; }
.circle .ink { inset: -0.3em -0.35em; width: calc(100% + 0.7em); height: calc(100% + 0.6em); }
.under-svg { left: 0; bottom: -0.1em; width: 100%; height: 0.3em; }
.under-svg path { stroke: var(--teal); stroke-width: 3; }
.sign { font-family: var(--hand); font-size: 0.8em; margin-top: 0.8em; color: var(--pink); transform: rotate(-3deg); display: inline-block; }
</style>
