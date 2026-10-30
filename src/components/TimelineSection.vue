<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const months = [
  { m: 'Jan', title: 'Resolution: touch grass', body: 'Everyone’s New Year’s resolution was “touch grass.” Grass reported record traffic and asked for a day off.', tag: 'wellness', hue: 80 },
  { m: 'Feb', title: 'The verified pigeon', body: 'A pigeon somehow got verified on three social apps. It posts mostly bread reviews. Honestly? Valid content.', tag: 'internet', hue: 300 },
  { m: 'Mar', title: 'Too-perfect latte art', body: 'The first fully robot-run café opened. The latte art was so perfect it felt rude. People left to drink sad office coffee instead.', tag: 'food', hue: 25 },
  { m: 'Apr', title: 'Global Nap Day', body: 'Somebody declared a worldwide nap day as a joke. Productivity went up 4%. Nobody can explain it. We’re not asking questions.', tag: 'culture', hue: 220 },
  { m: 'May', title: 'The 2019 to-do list', body: 'A guy finally finished his to-do list from 2019. Item #1 was “reply to Sarah.” Sarah has moved on. Sarah is thriving.', tag: 'human', hue: 150 },
  { m: 'Jun', title: 'Ice cream weather', body: 'It got so hot that ice cream got its own weather report. Today’s forecast: 90% chance of drips by 2pm.', tag: 'climate', hue: 40 },
  { m: 'Jul', title: 'Vinyl strikes back', body: 'For exactly one (1) hour, vinyl outsold streaming. Music execs are still breathing into paper bags.', tag: 'music', hue: 340 },
  { m: 'Aug', title: 'Moon selfie', body: 'A tiny rover on the moon sent home its first selfie. It’s a bit blurry and the angle is bad. It’s iconic.', tag: 'space', hue: 260 },
  { m: 'Sep', title: 'Nap-mode chairs', body: 'Office chairs with a built-in “nap mode” went viral. HR departments everywhere filed a collective sigh.', tag: 'work', hue: 190 },
  { m: 'Oct', title: 'Costume of the year', body: 'The top Halloween costume was “a loading spinner.” Just spin slowly in a corner. Terrifying. Relatable.', tag: 'spooky', hue: 20 },
  { m: 'Nov', title: 'Seven minutes of peace', body: 'The whole internet agreed on one thing for seven minutes. Servers crashed from the shock. Nobody remembers what it was.', tag: 'internet', hue: 110 },
  { m: 'Dec', title: 'Wait, it’s over?', body: 'The year ended. Nobody was ready. Somebody said “this year flew by” 41 million times. Same as always.', tag: 'finale', hue: 280 },
]

const root = ref(null)
const track = ref(null)
let mm

onMounted(() => {
  mm = gsap.matchMedia()

  mm.add('(min-width: 900px)', () => {
    const distance = () => track.value.scrollWidth - window.innerWidth
    const scroller = gsap.to(track.value, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: root.value,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })
    // per-card parallax + reveal as it slides into view
    gsap.utils.toArray('.month', root.value).forEach((card) => {
      gsap.fromTo(card.querySelector('.art-num'), { xPercent: 60 }, {
        xPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: scroller, start: 'left right', end: 'right left', scrub: true },
      })
      gsap.from(card.querySelectorAll('.reveal'), {
        y: 60,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: card, containerAnimation: scroller, start: 'left 80%' },
      })
    })
  })

  mm.add('(max-width: 899px)', () => {
    gsap.utils.toArray('.month', root.value).forEach((card) => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        rotate: 3,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 90%' },
      })
    })
  })
})

onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section id="timeline" ref="root" class="timeline" data-mood="timeline">
    <div ref="track" class="track">
      <div class="intro">
        <p class="eyebrow mono">chapter 01 — the year</p>
        <h2>Twelve months.<br /><span class="serif">Zero</span> chill.</h2>
        <p class="lede">A month-by-month recap of things that totally, definitely happened. Keep scrolling and don’t fact-check us.</p>
        <span class="hint mono">scroll → → →</span>
      </div>

      <article
        v-for="(item, i) in months"
        :key="item.m"
        class="month"
        :style="{ '--h': item.hue }"
        v-tilt="8"
        data-cursor="read"
      >
        <div class="art">
          <div class="art-blob" />
          <div class="art-grid" />
          <span class="art-num">{{ String(i + 1).padStart(2, '0') }}</span>
        </div>
        <div class="meta reveal mono">
          <span>{{ item.m }} 2026</span>
          <span class="tag">#{{ item.tag }}</span>
        </div>
        <h3 class="reveal">{{ item.title }}</h3>
        <p class="reveal">{{ item.body }}</p>
        <div class="glare" />
      </article>

      <div class="outro-card">
        <span class="serif">and that’s</span>
        <strong>a wrap.</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline { position: relative; overflow: hidden; }
.track {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 48px);
  height: 100vh;
  padding: 0 var(--gutter);
  width: max-content;
  will-change: transform;
}
.intro { width: min(520px, 80vw); flex-shrink: 0; }
.intro h2 { font-size: clamp(48px, 7vw, 108px); line-height: 0.9; letter-spacing: -0.05em; font-weight: 700; }
.intro .serif { color: var(--pink); }
.lede { margin-top: 28px; color: var(--muted); font-size: 18px; line-height: 1.5; max-width: 38ch; }
.hint { display: inline-block; margin-top: 40px; color: var(--acid); animation: nudge 1.4s var(--ease) infinite; }
@keyframes nudge { 50% { transform: translateX(12px); } }

.month {
  --c: hsl(var(--h) 95% 60%);
  position: relative;
  flex-shrink: 0;
  width: clamp(300px, 28vw, 420px);
  padding: 18px;
  border-radius: 28px;
  background: rgba(18, 18, 22, 0.6);
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  border: 1px solid var(--line);
  transform-style: preserve-3d;
  overflow: hidden;
}
.month:nth-of-type(even) { margin-top: 18vh; }
.month:nth-of-type(odd) { margin-bottom: 18vh; }
.art {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 18px;
  overflow: hidden;
  background: hsl(var(--h) 40% 8%);
  margin-bottom: 20px;
}
.art-blob {
  position: absolute;
  inset: -30%;
  background:
    radial-gradient(circle at 30% 30%, var(--c), transparent 45%),
    radial-gradient(circle at 70% 60%, hsl(calc(var(--h) + 120) 95% 60%), transparent 40%),
    conic-gradient(from 0deg, transparent, hsl(calc(var(--h) + 60) 90% 55% / 0.6), transparent 40%);
  filter: blur(18px);
  animation: swirl 9s linear infinite;
}
@keyframes swirl { to { transform: rotate(360deg); } }
.art-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  mix-blend-mode: overlay;
}
.art-num {
  position: absolute;
  right: 14px;
  bottom: -0.12em;
  font-size: 120px;
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.7);
}
.meta { display: flex; justify-content: space-between; color: var(--muted); margin-bottom: 12px; }
.tag { color: var(--c); }
.month h3 { font-size: 28px; letter-spacing: -0.03em; line-height: 1.05; margin-bottom: 10px; }
.month p { color: #b9b8b0; line-height: 1.5; font-size: 15px; }
.glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255, 255, 255, 0.14), transparent 45%);
  opacity: 0;
  transition: opacity 0.4s;
}
.month:hover .glare { opacity: 1; }
.outro-card {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding-right: 10vw;
  font-size: clamp(56px, 8vw, 140px);
  line-height: 0.9;
  letter-spacing: -0.05em;
}
.outro-card strong { color: var(--acid); }

@media (max-width: 899px) {
  .track { flex-direction: column; height: auto; width: 100%; padding: 120px var(--gutter); align-items: stretch; }
  .intro, .month { width: 100%; }
  .month:nth-of-type(n) { margin: 0; }
  .outro-card { padding: 40px 0 0; }
  .hint { display: none; }
}
</style>
