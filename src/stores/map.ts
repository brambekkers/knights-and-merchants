import { map as level1Map } from '@/constant/maps/map1'

export const useMapStore = defineStore('map', () => {
  const cellSize = 50
  const map = ref<Grid>(level1Map)

  return { map, cellSize }
})
