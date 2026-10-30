<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const text =
  '2026 wasn’t really a year. It was a group project where everyone showed up late, nobody read the brief, half the team was on mute, and somehow — *somehow* — we still turned something in. So here’s to the ^chaos^, the ~memes~, the 3am ideas, and every single tab you swore you’d read later.'

// *word* = serif, ^word^ = acid pill, ~word~ = pink pill
const words = text.split(' ').map((raw) => {
  let kind = ''
  let w = raw
  if (/\*.+\*/.test(raw)) { kind = 'serif'; w = raw.replace(/\*/g, '') }
  else if (/\^.+\^/.test(raw)) { kind = 'pill acid'; w = raw.replace(/\^/g, '') }
  else if (/~.+~/.test(raw)) { kind = 'pill pink'; w = raw.replace(/~/g, '') }
  return { w, kind }
})

const root = ref(null)

onMounted(() => {
  gsap.fromTo(
    root.value.querySelectorAll('.w'),
    { opacity: 0.12, y: 12, filter: 'blur(4px)' },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      stagger: 0.05,
      ease: 'none',
      scrollTrigger: { trigger: root.value.querySelector('.copy'), start: 'top 80%', end: 'bottom 45%', scrub: 1 },
    },
  )
  gsap.to(root.value.querySelector('.big-quote'), {
    rotate: 200,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
  })
})
</script>

<template>
  <section id="manifesto" ref="root" class="section manifesto" data-mood="manifesto">
    <p class="eyebrow mono">chapter 02 — the manifesto</p>
    <span class="big-quote serif" aria-hidden="true">“</span>
    <p class="copy">
      <span v-for="(item, i) in words" :key="i" class="w" :class="item.kind">{{ item.w }}&nbsp;</span>
    </p>
    <p class="sign mono">— signed, the committee of people who are tired</p>
  </section>
</template>

<style scoped>
.manifesto { overflow: clip; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
.big-quote {
  position: absolute;
  right: var(--gutter);
  top: 8%;
  font-size: clamp(200px, 30vw, 480px);
  line-height: 1;
  color: var(--acid);
  opacity: 0.18;
  pointer-events: none;
}
.copy {
  font-size: clamp(30px, 5.2vw, 84px);
  line-height: 1.08;
  letter-spacing: -0.04em;
  font-weight: 500;
  max-width: 22ch;
}
.w { display: inline-block; }
.w.serif { color: var(--acid); }
.w.pill {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
  padding: 0 0.3em;
  border-radius: 999px;
  margin-right: 0.2em;
  line-height: 1.1;
}
.w.pill.acid { background: var(--acid); color: var(--bg); }
.w.pill.pink { background: var(--pink); color: var(--bg); }
.sign { margin-top: 48px; color: var(--muted); }
</style>
