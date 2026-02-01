import { buildingInfo } from '@/constant/buildingInfo'

export const useBuildStore = defineStore('build', () => {
  const { menu, buildSelect } = storeToRefs(useSidebarStore())
  const { map } = storeToRefs(useMapStore())

  const position = ref<{ x: number; y: number } | null>(null)
  const middlePosition = computed(() => {
    if (!buildSelect.value) return null
    if (!buildingInfo[buildSelect.value as Building]) return null
    const { pattern } = buildingInfo[buildSelect.value as Building]
    return {
      x: (position.value?.x || 0) - Math.floor(pattern[0].length / 2),
      y: (position.value?.y || 0) - Math.floor(pattern.length / 2)
    }
  })
  const building = computed(() => buildingInfo[buildSelect.value as Building])
  const showRoadPosition = computed(
    () =>
      menu.value === 'build' &&
      (buildSelect.value === 'road' || buildSelect.value === 'vines' || buildSelect.value === 'field')
  )
  const showBuildPosition = computed(
    () => menu.value === 'build' && buildSelect.value !== null && !showRoadPosition.value
  )
  const isBlocked = ({ y, x }: { x: number; y: number }) => map.value[y]?.[x]?.blockedBuilding

  const canPlaceBuilding = computed(() => {
    if (!middlePosition.value || !building.value) return false

    let canPlace = true
    for (let y = 0; y < building.value.pattern.length; y++) {
      for (let x = 0; x < building.value.pattern[0].length; x++) {
        const posX = middlePosition.value.x + x
        const posY = middlePosition.value.y + y
        const block = isBlocked({ x: posX, y: posY })
        if (block) {
          canPlace = false
          break
        }
      }
    }
    return canPlace
  })

  const addBuilding = () => {
    if (!canPlaceBuilding.value) return
    if (!middlePosition.value || !position.value) return

    const { pattern, health } = buildingInfo[buildSelect.value as Building]!
    const building = {
      id: uid('building-') as BuildingId,
      health,
      ...middlePosition.value,
      type: buildSelect.value as Building,
      construction: 0,
      stock: {},
      generating: false
    }
    // add road on the entrance of the building
    const lastRowIndex = pattern.length - 1
    let x = pattern[lastRowIndex]?.findIndex((tile) => tile === 2) || 0
    let y = lastRowIndex
    placeRoad({ map: map.value, x: middlePosition.value.x + x, y: middlePosition.value.y + y })
    usePlayersStore().addRoad({ x: middlePosition.value.x + x, y: middlePosition.value.y + y })

    // place the building
    placeBuilding({ map: map.value, ...building })
    usePlayersStore().addBuilding(building)

    // reset building selection
    buildSelect.value = null
  }

  const addRoad = () => {
    if (!position.value) return
    const { x, y } = position.value

    if (buildSelect.value === 'road') {
      // Check if road is blocked
      if (map.value[y]?.[x]?.blockedRoad) return

      placeRoad({ map: map.value, ...position.value })
      usePlayersStore().addRoad(position.value)
    }

    if (buildSelect.value === 'field') {
    }
    if (buildSelect.value === 'vines') {
    }
  }

  watch(showBuildPosition, (bool) => {
    if (!bool) position.value = null
  })

  return { showBuildPosition, showRoadPosition, position, building, middlePosition, addBuilding, addRoad }
})
