export const useSidebarStore = defineStore('sidebar', () => {
  const menu = ref<'build' | 'stats' | 'ratios' | 'menu' | 'building'>('build')
  const buildSelect = ref<Building | 'road' | 'vines' | 'field' | 'delete' | null>(null)
  const selectedBuilding = ref<PlayerBuilding | null>(null)

  const selectBuilding = (building: PlayerBuilding | null) => {
    selectedBuilding.value = building
    if (building) {
      menu.value = 'building'
    }
  }

  return { menu, buildSelect, selectedBuilding, selectBuilding }
})
