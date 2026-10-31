import { prints } from './months.js'

const shot = prints

const km = ([a, b], [c, d]) => {
  const r = (x) => (x * Math.PI) / 180
  const h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

const count = (arr) => arr.reduce((acc, x) => ((acc[x] = (acc[x] || 0) + 1), acc), {})

const byPlace = Object.entries(count(shot.filter((m) => m.place).map((m) => m.place))).sort((a, b) => b[1] - a[1])
export const topPlace = byPlace[0] ? { name: byPlace[0][0], n: byPlace[0][1] } : null
export const places = byPlace.map(([p]) => p)

// "home" = the most-photographed place; the furthest photo is measured from there
const home = shot.find((m) => m.place === topPlace?.name)?.loc
const far = home
  ? shot.filter((m) => m.loc).map((m) => ({ m, d: km(home, m.loc) })).sort((a, b) => b.d - a.d)[0]
  : null
export const furthest = far ? { place: far.m.place, month: far.m.m, km: Math.round(far.d / 10) * 10, from: topPlace.name } : null

// Rough buckets from each photo's tag
const BUCKETS = {
  people: ['family', 'tradition', 'squad', 'birthday'],
  food: ['snacks', 'food', 'treatyourself'],
  'me, myself & I': ['travel', 'newtoy', 'ride'],
}
export const mix = Object.entries(BUCKETS)
  .map(([label, tags]) => ({ label, n: shot.filter((m) => tags.includes(m.tag)).length }))
  .map((b) => ({ ...b, pct: shot.length ? Math.round((b.n / shot.length) * 100) : 0 }))
  .sort((a, b) => b.n - a.n)

export const total = shot.length
export const photos = shot.map((m) => m.src)
