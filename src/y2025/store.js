import { reactive } from 'vue'

// Light-leak "moods" for the film background, one per section.
export const LEAKS = {
  hero:      { hue: 0.04, x: 0.85, y: 0.2, power: 1.0, burn: 0.35 },
  strip:     { hue: 0.08, x: 0.1, y: 0.8, power: 0.7, burn: 0.2 },
  timeline:  { hue: 0.0, x: 0.95, y: 0.9, power: 0.55, burn: 0.15 },
  manifesto: { hue: 0.11, x: 0.05, y: 0.1, power: 0.8, burn: 0.25 },
  map:       { hue: 0.06, x: 0.9, y: 0.95, power: 0.5, burn: 0.3 },
  receipt:   { hue: 0.1, x: 0.1, y: 0.5, power: 0.7, burn: 0.2 },
  letter:    { hue: 0.02, x: 0.5, y: 0.15, power: 0.9, burn: 0.35 },
  outro:     { hue: 0.97, x: 0.5, y: 1.0, power: 1.2, burn: 0.45 },
}

export const film = reactive({ mood: 'hero', flash: 0, frame: 0 })
