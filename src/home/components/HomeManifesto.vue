<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'

const text =
  '2026 taught me a lot. I *grew up* a little — enough to accept my ^flaws^ instead of fighting them. I stopped looking sideways and started focusing on me. Learned to be less selfish, to be ~grateful~ for what I already have, and to actually feel *every second* as it passes by.'

// *phrase* = serif, ^phrase^ = acid tag, ~phrase~ = pink tag
const words = text.match(/\*[^*]+\*|\^[^^]+\^|~[^~]+~|\S+/g).map((raw) => {
  if (raw.startsWith('*')) return { w: raw.slice(1, -1), kind: 'serif', hl: true, underline: raw.includes('every') }
  if (raw.startsWith('^')) return { w: raw.slice(1, -1), kind: 'tagw acid', hl: true }
  if (raw.startsWith('~')) return { w: raw.slice(1, -1), kind: 'tagw pink', hl: true }
  return { w: raw, kind: '' }
})

const root = ref(null)
let mm

onMounted(() => {
  mm = gsap.matchMedia()
  mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }, (ctx) => {
    const desktop = ctx.conditions.desktop
    const el = root.value
    const tl = gsap.timeline({
      scrollTrigger: desktop
        ? { trigger: el, start: 'top top', end: '+=160%', pin: true, scrub: 1 }
        : { trigger: el.querySelector('.copy'), start: 'top 80%', end: 'bottom 40%', scrub: 1 },
    })

    tl.fromTo(
      el.querySelectorAll('.w'),
      { opacity: 0.08, y: 14, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.05, ease: 'none', duration: 0.4 },
      0,
    )
    // highlighted words pop as the reveal reaches them
    el.querySelectorAll('.w.hl').forEach((w) => {
      const at = Number(w.dataset.i) * 0.05
      tl.fromTo(w, { scale: 0.7, rotate: -4 }, { scale: 1, rotate: 0, duration: 0.25, ease: 'back.out(3)' }, at)
      const fill = w.querySelector('.fill')
      if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 0.2, ease: 'power2.out' }, at)
    })
    const path = el.querySelector('.scribble path')
    const len = path.getTotalLength()
    tl.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.3 }, '>-0.1')
    tl.from(el.querySelector('.sign'), { opacity: 0, y: 30, duration: 0.2 }, '>')

    gsap.fromTo(el.querySelector('.ghost'), { xPercent: 10 }, {
      xPercent: -35,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: desktop ? '+=260%' : 'bottom top', scrub: true },
    })
    gsap.to(el.querySelector('.big-quote'), {
      rotate: 220,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: desktop ? '+=260%' : 'bottom top', scrub: true },
    })
  })
})
onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section id="manifesto" ref="root" class="manifesto" data-mood="reflect">
    <span class="ghost" aria-hidden="true">2026 · 2026 · 2026</span>
    <span class="big-quote serif" aria-hidden="true">“</span>

    <p class="eyebrow mono">the manifesto</p>
    <p class="copy">
      <template v-for="(item, i) in words" :key="i">
        <span class="w" :class="[item.kind, { hl: item.hl, ul: item.underline }]" :data-i="i">
          <span v-if="item.kind.startsWith('tagw')" class="fill" />
          <span class="t">{{ item.w }}</span>
          <svg v-if="item.underline" class="scribble" viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true">
            <path d="M4 18 C 60 6, 120 26, 180 14 S 270 8, 296 16" />
          </svg>
        </span>{{ ' ' }}
      </template>
    </p>
    <p class="sign mono">— signed, me <span class="serif">(a slightly better version)</span></p>
  </section>
</template>

<style scoped>
.manifesto {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 96px var(--gutter) 64px;
  overflow: clip;
}
.ghost {
  position: absolute;
  left: 0;
  bottom: 4vh;
  white-space: nowrap;
  font-size: clamp(160px, 28vw, 460px);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(236, 235, 228, 0.08);
  pointer-events: none;
  user-select: none;
}
.big-quote {
  position: absolute;
  right: var(--gutter);
  top: 6%;
  font-size: clamp(200px, 30vw, 480px);
  line-height: 1;
  color: var(--acid);
  opacity: 0.18;
  pointer-events: none;
}
.copy {
  position: relative;
  font-size: clamp(28px, min(4vw, 6.4vh), 66px);
  line-height: 1.1;
  letter-spacing: -0.04em;
  font-weight: 500;
  max-width: 23ch;
}
.w { display: inline-block; position: relative; }
.w.serif { color: var(--acid); }
.w.tagw {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
  padding: 0 0.32em;
  margin: 0 0.06em;
  line-height: 1.1;
  color: var(--bg);
  isolation: isolate;
}
.w.tagw .fill {
  position: absolute;
  inset: 0.04em 0;
  border-radius: 999px;
  transform-origin: left;
  z-index: -1;
}
.w.tagw.acid .fill { background: var(--acid); }
.w.tagw.pink .fill { background: var(--pink); }
.scribble {
  position: absolute;
  left: -2%;
  bottom: -0.22em;
  width: 104%;
  height: 0.4em;
  overflow: visible;
}
.scribble path { fill: none; stroke: var(--pink); stroke-width: 4; stroke-linecap: round; vector-effect: non-scaling-stroke; }
.sign { margin-top: 40px; color: var(--muted); }
.sign .serif { text-transform: none; font-size: 18px; letter-spacing: 0; color: var(--fg); }
</style>
