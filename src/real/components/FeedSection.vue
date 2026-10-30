<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EVENTS, CATEGORIES } from '../events.js'
import { globe } from '../store.js'
import EventCard from './EventCard.vue'

gsap.registerPlugin(Flip)

const root = ref(null)
const activeId = ref(null)
const filters = [{ id: 'all', label: 'Everything', color: 'var(--fg)' }, ...CATEGORIES]

const months = computed(() => {
  const out = []
  for (const e of EVENTS) {
    const m = new Date(e.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long' })
    let g = out.find((x) => x.name === m)
    if (!g) out.push((g = { name: m, items: [] }))
    g.items.push(e)
  }
  return out
})
const visible = (e) => globe.filter === 'all' || e.cat === globe.filter
const countFor = (id) => (id === 'all' ? EVENTS.length : EVENTS.filter((e) => e.cat === id).length)

let triggers = []
function bindTriggers() {
  triggers.forEach((t) => t.kill())
  triggers = [...root.value.querySelectorAll('[data-event]')]
    .filter((el) => el.offsetParent !== null)
    .map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (!self.isActive) return
          const e = EVENTS.find((x) => x.id === el.dataset.event)
          activeId.value = e.id
          globe.focus = e.loc ? { id: e.id, loc: e.loc, place: e.place, cat: e.cat } : globe.focus
        },
      }),
    )
}

async function setFilter(id) {
  if (globe.filter === id) return
  const cards = root.value.querySelectorAll('.flip-item')
  const state = Flip.getState(cards)
  globe.filter = id
  await nextTick()
  Flip.from(state, {
    duration: 0.8,
    ease: 'expo.inOut',
    stagger: 0.02,
    absolute: true,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 }),
    onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.4 }),
    onComplete: () => {
      ScrollTrigger.refresh()
      bindTriggers()
    },
  })
}

onMounted(() => {
  bindTriggers()
  ScrollTrigger.create({
    trigger: root.value,
    start: 'top 60%',
    end: 'bottom 40%',
    onLeave: () => (globe.focus = null),
    onLeaveBack: () => (globe.focus = null),
  })
  gsap.from(root.value.querySelectorAll('.feed-head > *'), {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 75%' },
  })
})
onBeforeUnmount(() => triggers.forEach((t) => t.kill()))
</script>

<template>
  <section id="feed" ref="root" class="feed" data-globe="feed">
    <div class="feed-col">
      <div class="feed-head">
        <p class="eyebrow mono">the timeline</p>
        <h2>Month by month,<br /><span class="serif">pin by pin.</span></h2>
        <p class="lede">Scroll the stories and the globe flies to where each one happened.</p>
      </div>

      <div class="filters">
        <button
          v-for="f in filters"
          :key="f.id"
          class="chip mono"
          :class="{ on: globe.filter === f.id }"
          :style="{ '--c': f.color }"
          v-magnetic="0.2"
          @click="setFilter(f.id)"
        >
          <i />{{ f.label }} <sup>{{ countFor(f.id) }}</sup>
        </button>
      </div>

      <template v-for="m in months" :key="m.name">
        <div v-show="m.items.some(visible)" class="month flip-item">
          <span class="serif">{{ m.name }}</span>
          <span class="mono">{{ m.items.filter(visible).length }} stories</span>
        </div>
        <div v-for="e in m.items" v-show="visible(e)" :key="e.id" :data-event="e.id" class="flip-item slot" :data-flip-id="e.id">
          <EventCard :event="e" :active="activeId === e.id" />
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.feed { position: relative; padding: 140px var(--gutter) 120px; }
.feed-col { width: min(620px, 48vw); margin-left: auto; margin-right: 2vw; display: flex; flex-direction: column; gap: 18px; }
.feed-head h2 { font-size: clamp(44px, 5.2vw, 88px); line-height: 0.95; letter-spacing: -0.05em; }
.feed-head .serif { color: var(--red); }
.lede { color: var(--muted); margin-top: 16px; font-size: 17px; }
.filters {
  position: sticky;
  top: 72px;
  z-index: 5;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 14px 0;
  margin: 12px 0;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(8, 8, 10, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: background 0.4s, color 0.4s, border-color 0.4s;
}
.chip i { width: 7px; height: 7px; border-radius: 50%; background: var(--c); }
.chip sup { color: var(--muted); font-size: 9px; }
.chip:hover { border-color: var(--c); }
.chip.on { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.chip.on sup { color: var(--bg); }
.month {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 48px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line);
}
.month .serif { font-size: clamp(40px, 4.4vw, 68px); line-height: 1; }
.month .mono { color: var(--muted); }

@media (max-width: 899px) {
  .feed { padding-top: 60vh; }
  .feed-col { width: 100%; margin: 0; }
  .filters { top: 64px; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin-inline: calc(var(--gutter) * -1); padding-inline: var(--gutter); }
  .filters::-webkit-scrollbar { display: none; }
  .chip { flex-shrink: 0; }
}
</style>
