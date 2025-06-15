export const useSidebarStore = defineStore('sidebar', () => {
  const menu = ref<'build' | 'stats' | 'ratios' | 'menu'>('build')
  const buildSelect = ref<Building | 'road' | 'vines' | 'field' | 'delete' | null>(null)

  return { menu, buildSelect }
})
