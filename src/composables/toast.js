import { ref } from 'vue'

export const toasts = ref([])
let id = 0

export function toast(text) {
  const t = { id: ++id, text }
  toasts.value.push(t)
  setTimeout(() => {
    toasts.value = toasts.value.filter((x) => x.id !== t.id)
  }, 3200)
}
