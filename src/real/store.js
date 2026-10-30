import { reactive } from 'vue'

// Shared state between the DOM sections and the WebGL globe.
export const globe = reactive({
  mode: 'hero', // hero | feed | numbers | feature | outro
  focus: null, // event currently being read: { id, loc, place, cat }
  filter: 'all',
})
