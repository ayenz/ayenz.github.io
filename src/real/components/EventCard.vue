<script setup>
import { computed } from 'vue'
import images from '../images.json'
import { CATEGORIES, fmtDate } from '../events.js'

const props = defineProps({ event: Object, active: Boolean })
const cat = computed(() => CATEGORIES.find((c) => c.id === props.event.cat))
const img = computed(() => props.event.img && images[props.event.img])
</script>

<template>
  <article
    class="card"
    :class="{ active, serious: event.serious, 'no-img': !img, feature: event.feature }"
    :style="{ '--c': cat.color }"
    :data-cursor="img ? 'read' : null"
  >
    <figure v-if="img" class="media">
      <img :src="img.src" :alt="event.title" loading="lazy" decoding="async" :width="img.w" :height="img.h" />
      <figcaption class="credit mono">
        <a :href="img.page" target="_blank" rel="noopener">{{ img.author }} · {{ img.license }}</a>
      </figcaption>
    </figure>
    <div class="body">
      <div class="meta mono">
        <span class="date">{{ fmtDate(event) }}</span>
        <span class="cat"><i />{{ cat.label }}</span>
        <span v-if="event.place" class="place">{{ event.place }}</span>
      </div>
      <h3>{{ event.title }}</h3>
      <p>{{ event.body }}</p>
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  border-radius: 22px;
  border: 1px solid var(--line);
  background: rgba(14, 14, 17, 0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow: hidden;
  transition: border-color 0.5s var(--ease), transform 0.6s var(--ease), opacity 0.6s var(--ease);
  opacity: 0.55;
}
.card.active { border-color: var(--c); opacity: 1; transform: translateX(-8px); }
.media { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #111; }
.feature .media { aspect-ratio: 4 / 3; }
.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.08);
  filter: grayscale(0.8) contrast(1.05);
  transition: transform 1.2s var(--ease), filter 0.8s var(--ease);
}
.card.active .media img, .card:hover .media img { filter: none; transform: scale(1); }
.credit {
  position: absolute;
  left: 10px;
  bottom: 10px;
  font-size: 10px;
  text-transform: none;
  letter-spacing: 0.02em;
  background: rgba(8, 8, 10, 0.7);
  color: #bdb7ab;
  padding: 4px 8px;
  border-radius: 4px;
  max-width: calc(100% - 20px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.credit a:hover { color: var(--fg); }
.body { padding: 22px 24px 26px; }
.meta { display: flex; flex-wrap: wrap; gap: 8px 16px; color: var(--muted); margin-bottom: 14px; }
.date { color: var(--fg); }
.cat { display: inline-flex; align-items: center; gap: 6px; color: var(--c); }
.cat i { width: 6px; height: 6px; border-radius: 50%; background: var(--c); }
h3 { font-size: clamp(24px, 2.2vw, 32px); line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 12px; }
.feature h3 { font-size: clamp(30px, 3vw, 44px); }
p { color: #bfb9ad; line-height: 1.55; font-size: 16px; }

.no-img .body { padding-top: 30px; }
.no-img h3 { font-family: var(--serif); font-weight: 400; font-size: clamp(28px, 2.8vw, 40px); letter-spacing: -0.02em; }
.no-img::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--c);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.8s var(--ease);
}
.no-img.active::before { transform: scaleY(1); }
.serious { background: rgba(10, 10, 12, 0.85); }
.serious h3 { font-style: normal; }

@media (max-width: 899px) {
  .card { background: rgba(14, 14, 17, 0.92); opacity: 0.85; }
  .card.active { transform: none; }
}
</style>
