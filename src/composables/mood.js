import { reactive } from 'vue'

// Each section "tunes" the WebGL scene to a different mood.
export const MOODS = {
  hero:     { a: '#1b0b3a', b: '#4f7bff', c: '#ff4fd8', x: 0,    y: 0,    scale: 1,    intensity: 0.6 },
  ticker:   { a: '#0b2a1a', b: '#c6ff3d', c: '#4f7bff', x: 2.2,  y: 0.4,  scale: 0.7,  intensity: 1.2 },
  timeline: { a: '#2a0b1f', b: '#ff4fd8', c: '#ff7a2f', x: 0,    y: -2.6, scale: 1.4,  intensity: 0.4 },
  manifesto:{ a: '#08080a', b: '#ecebe4', c: '#c6ff3d', x: -2.4, y: 0,    scale: 0.9,  intensity: 1.6 },
  objects:  { a: '#2b1405', b: '#ff7a2f', c: '#4f7bff', x: 2.6,  y: -0.6, scale: 0.6,  intensity: 0.9 },
  stats:    { a: '#05122b', b: '#4f7bff', c: '#c6ff3d', x: -2,   y: 1,    scale: 0.7,  intensity: 1.6 },
  outro:    { a: '#1a0626', b: '#ff4fd8', c: '#c6ff3d', x: 2.2,  y: 0.6,  scale: 0.9,  intensity: 1 },
}

export const scene = reactive({ mood: 'hero', pulse: 0 })
