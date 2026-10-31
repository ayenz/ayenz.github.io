<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { goToYear } from '../../composables/yearNav.js'

// Written from the 2025 roll.
const LINES = [
  'Dear 2026 me,',
  '2025 gave you sixteen frames: reunions, two rounds of Chinese New Year, a first date, a new phone, a dozen donuts and way too much good food.',
  'You didn’t get the new office. You got coffee with the fam instead. Fair trade.',
  'Keep showing up for your people — they’re the best part of every photo.',
  'And keep shooting. Even the blurry ones.',
  'See you on the other side,',
]

const root = ref(null)
let mm

onMounted(() => {
  mm = gsap.matchMedia()
  mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }, (ctx) => {
    const el = root.value
    const q = (s) => el.querySelector(s)
    // hide whatever part of the letter would poke out below the envelope
    const tuck = () => Math.max(0, q('.letter').offsetHeight - q('.env').offsetHeight * 0.88)
    gsap.set(q('.letter'), { clipPath: () => `inset(0px 0px ${tuck()}px 0px)` })
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top top', end: ctx.conditions.desktop ? '+=200%' : '+=160%', pin: true, scrub: 1 },
    })
    tl.from(q('.env'), { y: 120, rotate: -8, opacity: 0, duration: 0.2 })
      // the wax seal cracks in two and drops away
      .to(q('.seal'), { scale: 1.08, duration: 0.05 })
      .to(q('.seal .l'), { x: -26, y: 60, rotate: -40, opacity: 0, duration: 0.15 }, '>')
      .to(q('.seal .r'), { x: 26, y: 70, rotate: 35, opacity: 0, duration: 0.15 }, '<')
      .to(q('.flap'), { rotateX: 180, duration: 0.2, ease: 'power2.inOut' }, '>-0.05')
      .set(q('.flap'), { zIndex: 1 })
      .to(q('.letter'), { yPercent: -62, clipPath: 'inset(0px 0px 0px 0px)', duration: 0.25, ease: 'power2.out' }, '>')
      .to(q('.letter'), { yPercent: -8, scale: ctx.conditions.desktop ? 1.08 : 1, zIndex: 6, duration: 0.2 }, '>')
      .to(q('.pocket'), { opacity: 0.0, duration: 0.1 }, '<')
      .to(q('.env-back'), { opacity: 0, duration: 0.1 }, '<')
      .to(q('.flap'), { opacity: 0, duration: 0.1 }, '<')
      .from(el.querySelectorAll('.line'), { clipPath: 'inset(0 100% 0 0)', stagger: 0.08, duration: 0.12, ease: 'none' }, '>')
      .from(q('.sig'), { opacity: 0, scale: 0.8, rotate: -10, duration: 0.08 }, '>')
      .from(q('.cta'), { opacity: 0, y: 20, duration: 0.08 }, '>')
  })
})
onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section id="letter" ref="root" class="letter-sec" data-mood="letter">
    <p class="eyebrow mono">one last thing</p>
    <div class="env">
      <div class="env-back" />
      <article class="letter">
        <p v-for="(l, i) in LINES" :key="i" class="line" :class="{ first: i === 0 }">{{ l }}</p>
        <p class="sig">— me, Dec 2025</p>
        <button class="pill cta" v-magnetic data-cursor="2026" @click="goToYear(2026)">open 2026 →</button>
      </article>
      <div class="pocket" />
      <div class="flap" />
      <div class="seal" aria-hidden="true">
        <span class="l" /><span class="r" />
        <b class="mono">25</b>
      </div>
      <span class="addr mono">to: me, 2026<br />handle with care</span>
    </div>
  </section>
</template>

<style scoped>
.letter-sec { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; padding: 120px var(--gutter) 60px; }
.env {
  position: relative;
  width: min(620px, 92vw);
  aspect-ratio: 3 / 2;
  perspective: 1400px;
  margin-top: 18vh;
}
.env-back, .pocket, .flap { position: absolute; inset: 0; }
.env-back { background: #d9c3a0; box-shadow: 0 40px 80px -30px rgba(60, 40, 20, 0.55); border-radius: 6px; }
.pocket {
  z-index: 3;
  background: linear-gradient(160deg, #e6d2b1, #d4bc96);
  clip-path: polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%);
  border-radius: 6px;
}
.flap {
  z-index: 4;
  background: linear-gradient(#cdb48c, #e0c9a5);
  clip-path: polygon(0 0, 100% 0, 50% 58%);
  transform-origin: top;
  backface-visibility: visible;
}
.letter {
  position: absolute;
  z-index: 2;
  left: 5%;
  right: 5%;
  top: 6%;
  min-height: 150%;
  padding: 28px 30px 30px;
  background:
    repeating-linear-gradient(transparent 0 33px, rgba(47, 111, 106, 0.16) 33px 34px),
    var(--paper);
  background-position: 0 22px;
  box-shadow: 0 20px 50px -20px rgba(60, 40, 20, 0.45);
  font-family: var(--hand);
  font-size: clamp(22px, 2.4vw, 28px);
  line-height: 34px;
  color: #2a2522;
}
.line { margin-bottom: 10px; }
.line.first { font-weight: 700; }
.sig { color: var(--pink); font-weight: 700; margin-top: 6px; display: inline-block; rotate: -3deg; }
.cta { display: flex; margin-top: 18px; font-family: var(--mono); line-height: 1; }
.seal {
  position: absolute;
  z-index: 5;
  left: 50%;
  top: 58%;
  width: 74px;
  height: 74px;
  translate: -50% -50%;
  display: grid;
  place-items: center;
}
.seal span {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background: radial-gradient(circle at 70% 35%, #e0485c, #a51a2c 60%, #6f0c18);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.seal .l { left: 0; border-radius: 37px 0 0 37px; clip-path: polygon(0 0, 100% 0, 80% 30%, 100% 55%, 75% 75%, 100% 100%, 0 100%); }
.seal .r { right: 0; border-radius: 0 37px 37px 0; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, -25% 75%, 0 55%, -20% 30%); }
.seal b { position: relative; color: #ffd0d6; font-size: 18px; text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3); pointer-events: none; }
.addr { position: absolute; z-index: 4; left: 8%; bottom: 10%; font-size: 13px; color: #6b5a45; line-height: 1.4; }

@media (max-width: 899px) {
  .letter-sec { padding-top: 80px; }
  .env { margin-top: 26vh; }
  .letter { padding: 20px 18px; line-height: 30px; background-size: 100% 30px; }
}
</style>
