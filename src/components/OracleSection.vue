<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { scrambleText } from '../composables/directives.js'
import { scene } from '../composables/mood.js'

const prophecies = [
  'You will rename a file “final_FINAL_v3” and actually mean it.',
  'A stranger’s dog will choose you. Accept the honor.',
  'Your next “quick 5-minute call” will last exactly 5 minutes. Legends say.',
  'You will find the perfect meme and have no one to send it to. Growth.',
  'Mercury is not in retrograde. You have run out of excuses.',
  'Your phone will hit 1% at the most cinematic moment possible.',
  'You will say “we should hang out soon” and then actually do it. Wild.',
  'Someone will finally laugh at that joke you’ve been workshopping since March.',
  'Your plants forgive you. Water them anyway.',
  'An email you’ve been avoiding will answer itself. Don’t ask how.',
  'You will nail the parallel park on the first try. Nobody will see it.',
  'The vibes are immaculate this week. Do not perform maintenance.',
]
const vibes = ['chaotic good', 'main character', 'npc but cozy', 'soft launch', 'unbothered', 'feral (affectionate)', 'big brain', 'side quest energy']

const root = ref(null)
const out = ref(null)
const vibe = ref('—')
const lucky = ref('—')
const meter = ref(null)
const spins = ref(0)
let last = -1

function consult() {
  let i
  do { i = (Math.random() * prophecies.length) | 0 } while (i === last)
  last = i
  spins.value++
  scrambleText(out.value, prophecies[i], 1.2)
  vibe.value = vibes[(Math.random() * vibes.length) | 0]
  lucky.value = String((Math.random() * 99) | 0).padStart(2, '0')
  gsap.fromTo(meter.value, { scaleX: 0 }, { scaleX: 0.2 + Math.random() * 0.8, duration: 1.6, ease: 'elastic.out(1, 0.5)' })
  gsap.fromTo('.orb', { scale: 0.85 }, { scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.3)' })
  gsap.fromTo('.orb-ring', { rotate: 0 }, { rotate: 360 * 2, duration: 1.6, ease: 'expo.out', stagger: 0.1 })
  scene.pulse++
}

onMounted(() => {
  gsap.from(root.value.querySelector('.panel'), {
    clipPath: 'inset(50% 50% 50% 50% round 32px)',
    duration: 1.6,
    ease: 'expo.inOut',
    scrollTrigger: { trigger: root.value, start: 'top 70%' },
  })
})
</script>

<template>
  <section id="oracle" ref="root" class="section oracle" data-mood="stats">
    <p class="eyebrow mono">chapter 04 — the oracle</p>
    <div class="panel">
      <div class="left">
        <h2>Ask the <span class="serif">oracle</span>.</h2>
        <p class="hint">A highly scientific prophecy machine. Powered by shaders and wishful thinking. Click the orb.</p>
        <p ref="out" class="prophecy">Your fortune is loading... just kidding, click the thing.</p>
        <dl class="readout mono">
          <div><dt>vibe</dt><dd>{{ vibe }}</dd></div>
          <div><dt>lucky no.</dt><dd>{{ lucky }}</dd></div>
          <div><dt>consulted</dt><dd>{{ spins }}×</dd></div>
          <div class="full">
            <dt>chaos meter</dt>
            <dd class="meter"><span ref="meter" /></dd>
          </div>
        </dl>
      </div>
      <button class="orb-wrap" v-magnetic="0.25" data-cursor="click me" aria-label="Consult the oracle" @click="consult">
        <span class="orb-ring" /><span class="orb-ring r2" /><span class="orb-ring r3" />
        <span class="orb"><span class="orb-core" /></span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.panel {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 48px;
  align-items: center;
  padding: clamp(24px, 5vw, 72px);
  border-radius: 32px;
  border: 1px solid var(--line);
  background: rgba(10, 10, 12, 0.5);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
h2 { font-size: clamp(44px, 6.5vw, 104px); letter-spacing: -0.05em; line-height: 0.95; }
h2 .serif { color: var(--blue); }
.hint { margin-top: 16px; color: var(--muted); line-height: 1.5; max-width: 40ch; }
.prophecy {
  margin-top: 40px;
  min-height: 3.6em;
  font-size: clamp(22px, 2.6vw, 34px);
  line-height: 1.2;
  letter-spacing: -0.02em;
  border-left: 3px solid var(--acid);
  padding-left: 20px;
}
.readout { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 40px; }
.readout div { border-top: 1px solid var(--line); padding-top: 10px; }
.readout .full { grid-column: 1 / -1; }
dt { color: var(--muted); margin-bottom: 6px; }
dd { color: var(--fg); }
.meter { height: 8px; border-radius: 8px; background: var(--line); overflow: hidden; }
.meter span { display: block; height: 100%; background: linear-gradient(90deg, var(--blue), var(--pink), var(--acid)); transform: scaleX(0.1); transform-origin: left; }

.orb-wrap { position: relative; aspect-ratio: 1; width: min(100%, 420px); justify-self: center; display: grid; place-items: center; }
.orb-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px dashed rgba(236, 235, 228, 0.3);
  animation: spin 20s linear infinite;
}
.orb-ring.r2 { inset: 8%; border-style: solid; border-color: transparent var(--acid) transparent var(--pink); animation-duration: 8s; animation-direction: reverse; }
.orb-ring.r3 { inset: 16%; border-color: rgba(79, 123, 255, 0.5); animation-duration: 14s; }
@keyframes spin { to { rotate: 360deg; } }
.orb {
  width: 60%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 25%, #fff, var(--blue) 25%, #3b0a6b 60%, #050510 80%);
  box-shadow: 0 0 80px rgba(79, 123, 255, 0.6), inset -20px -30px 60px rgba(0, 0, 0, 0.6), inset 10px 10px 40px rgba(255, 79, 216, 0.4);
  display: grid;
  place-items: center;
  overflow: hidden;
  transition: box-shadow 0.6s var(--ease);
}
.orb-wrap:hover .orb { box-shadow: 0 0 140px rgba(198, 255, 61, 0.6), inset -20px -30px 60px rgba(0, 0, 0, 0.6), inset 10px 10px 40px rgba(255, 79, 216, 0.6); }
.orb-core {
  width: 140%;
  aspect-ratio: 1;
  background: conic-gradient(from 0deg, transparent, rgba(198, 255, 61, 0.5), transparent 30%, rgba(255, 79, 216, 0.5), transparent 60%);
  filter: blur(20px);
  animation: spin 4s linear infinite;
  mix-blend-mode: screen;
}

@media (max-width: 860px) {
  .panel { grid-template-columns: 1fr; }
  .orb-wrap { order: -1; width: min(100%, 300px); }
}
</style>
