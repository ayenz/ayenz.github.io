import { months, prints } from './months.js'

// Shown until real photos (with city-level locations) are added.
const DEMO = [
  { place: 'Jakarta', loc: [-6.2, 106.85] },
  { place: 'Bandung', loc: [-6.91, 107.61] },
  { place: 'Yogyakarta', loc: [-7.8, 110.36] },
  { place: 'Bali', loc: [-8.65, 115.22] },
  { place: 'Singapore', loc: [1.35, 103.82] },
  { place: 'Jakarta', loc: [-6.2, 106.85] },
]

const real = prints.filter((p) => p.loc).map((p) => ({ place: p.place, loc: p.loc, m: p.m, n: p.n, photo: p.src }))
export const isDemo = real.length === 0
export const stops = isDemo ? DEMO.map((d, i) => ({ ...d, m: months[i * 2].m, n: months[i * 2].n, photo: null })) : real

export function km([lat1, lng1], [lat2, lng2]) {
  const r = (d) => (d * Math.PI) / 180
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lng2 - lng1) / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(a))
}

export const totalKm = stops.reduce((sum, s, i) => (i ? sum + km(stops[i - 1].loc, s.loc) : 0), 0)
export const cities = [...new Set(stops.map((s) => s.place))]
