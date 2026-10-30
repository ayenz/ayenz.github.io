<script setup>
import { YEARS, goToYear } from '../composables/yearNav.js'

const props = defineProps({ current: { type: Number, required: true } })

function go(e, y) {
  e.preventDefault()
  if (y !== props.current) goToYear(y)
}
</script>

<template>
  <nav v-if="YEARS.length > 1" class="years mono" aria-label="Year">
    <a
      v-for="year in YEARS"
      :key="year.y"
      :href="year.href"
      :class="{ on: year.y === current }"
      :aria-current="year.y === current ? 'page' : null"
      :data-cursor="year.y === current ? null : String(year.y)"
      @click="go($event, year.y)"
    >{{ year.y }}</a>
  </nav>
</template>

<style scoped>
.years {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-size: 12px;
}
.years a { padding: 7px 12px; border-radius: 999px; color: var(--muted); transition: color 0.3s, background 0.3s; }
.years a:hover { color: var(--fg); }
.years a.on { background: var(--fg); color: var(--bg); }
</style>
