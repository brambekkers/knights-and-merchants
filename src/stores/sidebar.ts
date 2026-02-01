export const useSidebarStore = defineStore('sidebar', () => {
  const menu = ref<'build' | 'stats' | 'ratios' | 'menu' | 'building' | 'character'>('build')
  const buildSelect = ref<Building | 'road' | 'vines' | 'field' | 'delete' | null>(null)
  const selectedBuilding = ref<PlayerBuilding | null>(null)
  const selectedCharacter = ref<Characters | null>(null)

  const selectBuilding = (building: PlayerBuilding | null) => {
    selectedBuilding.value = building
    selectedCharacter.value = null
    if (building) {
      menu.value = 'building'
    }
  }

  const deselectBuilding = () => {
    selectedBuilding.value = null
    menu.value = 'build'
  }

  const selectCharacter = (character: Characters | null) => {
    selectedCharacter.value = character
    selectedBuilding.value = null
    if (character) {
      menu.value = 'character'
    }
  }

  const deselectCharacter = () => {
    selectedCharacter.value = null
    menu.value = 'build'
  }

  return {
    menu,
    buildSelect,
    selectedBuilding,
    selectedCharacter,
    selectBuilding,
    deselectBuilding,
    selectCharacter,
    deselectCharacter
  }
})
