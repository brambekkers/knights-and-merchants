import { buildingInfo } from '@/constant/buildingInfo'

/**
 * Store for handling servant-specific job logic
 * Servants handle resource delivery between buildings and to construction sites
 */
export const useServantJobStore = defineStore('servantJob', () => {
  const { players } = storeToRefs(usePlayersStore())
  const { map } = useMapStore()

  /**
   * Find a character by ID
   */
  const getCharacterById = (characterId: CharacterId): Character | null => {
    const player = players.value[0]
    return player?.characters.find((c) => c.id === characterId) || null
  }

  /**
   * Find a building by ID
   */
  const getBuildingById = (buildingId: BuildingId): PlayerBuilding | null => {
    const player = players.value[0]
    return player?.buildings.find((b) => b.id === buildingId) || null
  }

  /**
   * Handle servant arriving at pickup location
   * Returns true if successful and movement should continue to delivery
   */
  const handlePickup = (
    job: Job,
    movement: Movement,
    character: Character
  ): { success: boolean; shouldContinue: boolean } => {
    const sourceBuilding = job.sourceBuildingId
      ? getBuildingById(job.sourceBuildingId)
      : null

    if (!sourceBuilding || !job.resource || !job.amount) {
      character.state = 'idle'
      return { success: false, shouldContinue: false }
    }

    const availableStock = sourceBuilding.stock[job.resource] || 0

    if (availableStock < job.amount) {
      // Not enough resource at source - fail the job
      character.state = 'idle'
      return { success: false, shouldContinue: false }
    }

    // Remove resource from source building
    sourceBuilding.stock[job.resource] = availableStock - job.amount

    // Add to character's carrying
    character.carrying = {
      resource: job.resource,
      amount: job.amount
    }

    // Calculate path to destination
    const path = pathfinder(map, {
      x1: character.x,
      y1: character.y,
      x2: job.x2,
      y2: job.y2
    })

    if (!path || path.length === 0) {
      // Can't reach destination - drop resource back and fail job
      sourceBuilding.stock[job.resource] = (sourceBuilding.stock[job.resource] || 0) + job.amount
      character.carrying = undefined
      character.state = 'idle'
      return { success: false, shouldContinue: false }
    }

    // Update movement for delivery phase
    job.status = 'delivering'
    movement.phase = 'to-delivery'
    movement.status = 'ready'
    movement.path = path

    return { success: true, shouldContinue: true }
  }

  /**
   * Handle servant delivering to a construction site
   */
  const handleConstructionDelivery = (
    job: Job,
    character: Character
  ): boolean => {
    if (!job.constructionSiteId || !character.carrying) {
      return false
    }

    // Deliver to construction site
    useConstructionStore().deliverResource(
      job.constructionSiteId,
      character.carrying.resource,
      character.carrying.amount
    )

    // Clear character and mark as idle
    character.carrying = undefined
    character.state = 'idle'

    return true
  }

  /**
   * Handle servant delivering to a building
   */
  const handleBuildingDelivery = (
    job: Job,
    character: Character
  ): boolean => {
    const destBuilding = job.destBuildingId
      ? getBuildingById(job.destBuildingId)
      : null

    if (destBuilding && character.carrying) {
      const info = buildingInfo[destBuilding.type]
      const maxStock = info.maxStock[character.carrying.resource] || 255
      const currentStock = destBuilding.stock[character.carrying.resource] || 0

      // Calculate how much we can deliver (respect max stock)
      const deliverAmount = Math.min(
        character.carrying.amount,
        maxStock - currentStock
      )

      if (deliverAmount > 0) {
        // Add resource to destination building
        destBuilding.stock[character.carrying.resource] = currentStock + deliverAmount
      }
    }

    // Clear character carrying and mark as idle
    character.carrying = undefined
    character.state = 'idle'

    return true
  }

  /**
   * Main handler for servant job completion
   * Called when servant finishes moving to a destination
   */
  const onComplete = (
    job: Job,
    movement: Movement,
    character: Character
  ): { success: boolean; shouldRemoveJob: boolean; shouldRemoveMovement: boolean } => {
    if (movement.phase === 'to-pickup') {
      const result = handlePickup(job, movement, character)
      return {
        success: result.success,
        shouldRemoveJob: !result.success,
        shouldRemoveMovement: !result.success
      }
    }

    if (movement.phase === 'to-delivery') {
      // Check if this is a construction delivery
      if (job.constructionSiteId) {
        const success = handleConstructionDelivery(job, character)
        return { success, shouldRemoveJob: true, shouldRemoveMovement: true }
      }

      // Regular building delivery
      const success = handleBuildingDelivery(job, character)
      return { success, shouldRemoveJob: true, shouldRemoveMovement: true }
    }

    return { success: false, shouldRemoveJob: true, shouldRemoveMovement: true }
  }

  return {
    onComplete,
    getCharacterById,
    getBuildingById
  }
})
