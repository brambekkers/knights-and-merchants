export const useSidebarStore = defineStore('sidebar', () => {
  const menu = ref<'build' | 'stats' | 'ratios' | 'menu' | 'building'>('build')
  const buildSelect = ref<Building | 'road' | 'vines' | 'field' | 'delete' | null>(null)
  const selectedBuilding = ref<PlayerBuilding | null>(null)

  const selectBuilding = (building: PlayerBuilding | null) => {
    console.log(building)
    selectedBuilding.value = building
    if (building) {
      menu.value = 'building'
    }
  }

  const deselectBuilding = () => {
    selectedBuilding.value = null
    menu.value = 'build'
  }

  return { menu, buildSelect, selectedBuilding, selectBuilding, deselectBuilding }
})
