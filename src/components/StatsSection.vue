<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const stats = [
  { value: 4.2, suffix: 'B', decimals: 1, label: 'browser tabs left open “for later”' },
  { value: 73, suffix: '%', decimals: 0, label: 'of meetings that could’ve been a meme' },
  { value: 1180000, suffix: '+', decimals: 0, label: 'times someone said “it’s giving”' },
  { value: 0, suffix: '', decimals: 0, label: 'people who fully read the terms & conditions' },
]

const root = ref(null)
const nums = ref([])

onMounted(() => {
  stats.forEach((s, i) => {
    const el = nums.value[i]
    const o = { v: s.value === 0 ? 999 : 0 }
    gsap.to(o, {
      v: s.value,
      duration: 2.4,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => {
        el.textContent = o.v.toLocaleString('en-US', { minimumFractionDigits: s.decimals, maximumFractionDigits: s.decimals })
      },
    })
  })
  gsap.from(root.value.querySelectorAll('.stat'), {
    y: 60,
    opacity: 0,
    stagger: 0.12,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 75%' },
  })
})
</script>

<template>
  <section ref="root" class="section stats" data-mood="stats">
    <p class="eyebrow mono">chapter 05 — numbers we made up</p>
    <div class="grid">
      <div v-for="(s, i) in stats" :key="s.label" class="stat" data-cursor="wow">
        <div class="num">
          <span :ref="(el) => (nums[i] = el)">0</span><em>{{ s.suffix }}</em>
        </div>
        <p>{{ s.label }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(2, 1fr); border-top: 1px solid var(--line); }
.stat {
  padding: 40px 24px 40px 0;
  border-bottom: 1px solid var(--line);
  position: relative;
  overflow: hidden;
}
.stat:nth-child(odd) { border-right: 1px solid var(--line); }
.stat:nth-child(even) { padding-left: 24px; }
.stat::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(198, 255, 61, 0.12), transparent 60%);
  transform: translateY(100%);
  transition: transform 0.7s var(--ease);
}
.stat:hover::before { transform: none; }
.num {
  font-size: clamp(56px, 9vw, 150px);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.num em { font-style: italic; font-family: var(--serif); font-weight: 400; color: var(--acid); }
.stat p { margin-top: 12px; color: var(--muted); max-width: 28ch; line-height: 1.4; position: relative; }

@media (max-width: 720px) {
  .grid { grid-template-columns: 1fr; }
  .stat:nth-child(n) { border-right: 0; padding-left: 0; }
}
</style>
