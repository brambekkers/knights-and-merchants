export const useDebugStore = defineStore('debug', () => {
  const showGrid = ref(true)
  const showCoordinates = ref(false)
  const showBlocking = ref(false)
  const showMovementArea = ref(false)

  return { showGrid, showMovementArea, showBlocking, showCoordinates }
})
