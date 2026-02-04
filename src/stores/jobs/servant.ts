import { buildingInfo } from '@/constant/buildingInfo'
import { getBuildingEntryInfo } from '@/utils/buildingEntry'

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
   * Start building entry animation for pickup
   * Character will enter building, pickup resource, then exit and continue to delivery
   */
  const startPickupEntry = (
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

    // Get building entry info for animation
    const entryInfo = getBuildingEntryInfo(sourceBuilding, map)
    if (!entryInfo) {
      character.state = 'idle'
      return { success: false, shouldContinue: false }
    }

    // Set up building entry animation
    movement.phase = 'entering-building'
    movement.status = 'ready'
    movement.buildingEntryPoint = entryInfo.entryPoint
    movement.buildingDoorPoint = entryInfo.doorPoint

    // Set up callback for when character exits the building
    movement.onBuildingExit = () => {
      executePickup(job, movement, character)
    }

    return { success: true, shouldContinue: true }
  }

  /**
   * Execute the actual pickup logic (called after exiting building)
   */
  const executePickup = (
    job: Job,
    movement: Movement,
    character: Character
  ): void => {
    const sourceBuilding = job.sourceBuildingId
      ? getBuildingById(job.sourceBuildingId)
      : null

    if (!sourceBuilding || !job.resource || !job.amount) {
      character.state = 'idle'
      useJobStore().removeJob(job.id)
      useJobStore().removeMovement(job.id)
      return
    }

    const availableStock = sourceBuilding.stock[job.resource] || 0

    if (availableStock < job.amount) {
      // Not enough resource at source - fail the job
      character.state = 'idle'
      useJobStore().removeJob(job.id)
      useJobStore().removeMovement(job.id)
      return
    }

    // Remove resource from source building
    sourceBuilding.stock[job.resource] = availableStock - job.amount

    // Add to character's carrying
    character.carrying = {
      resource: job.resource,
      amount: job.amount
    }

    // Calculate path to destination
    const isConstructionDelivery = !!job.constructionSiteId
    const path = pathfinder(map, {
      x1: character.x,
      y1: character.y,
      x2: job.x2,
      y2: job.y2
    }, {
      movementType: isConstructionDelivery ? 'road-preferred' : 'road-only',
      allowConstructionDestination: isConstructionDelivery
    })

    if (!path || path.length === 0) {
      // Can't reach destination - drop resource back and fail job
      sourceBuilding.stock[job.resource] = (sourceBuilding.stock[job.resource] || 0) + job.amount
      character.carrying = undefined
      character.state = 'idle'
      useJobStore().removeJob(job.id)
      useJobStore().removeMovement(job.id)
      return
    }

    // Update movement for delivery phase
    job.status = 'delivering'
    movement.phase = 'to-delivery'
    movement.status = 'ready'
    movement.path = path
    // Clear building entry data
    movement.buildingEntryPoint = undefined
    movement.buildingDoorPoint = undefined
    movement.onBuildingExit = undefined
  }

  /**
   * Start building entry animation for delivery
   */
  const startDeliveryEntry = (
    job: Job,
    movement: Movement,
    character: Character
  ): { success: boolean; shouldRemoveJob: boolean; shouldRemoveMovement: boolean } => {
    const destBuilding = job.destBuildingId
      ? getBuildingById(job.destBuildingId)
      : null

    if (!destBuilding) {
      // Construction delivery - no building entry needed
      if (job.constructionSiteId) {
        const success = handleConstructionDelivery(job, character)
        return { success, shouldRemoveJob: true, shouldRemoveMovement: true }
      }
      character.state = 'idle'
      return { success: false, shouldRemoveJob: true, shouldRemoveMovement: true }
    }

    // Get building entry info for animation
    const entryInfo = getBuildingEntryInfo(destBuilding, map)
    if (!entryInfo) {
      // Fallback: deliver without animation
      const success = handleBuildingDelivery(job, character)
      return { success, shouldRemoveJob: true, shouldRemoveMovement: true }
    }

    // Set up building entry animation
    movement.phase = 'entering-building'
    movement.status = 'ready'
    movement.buildingEntryPoint = entryInfo.entryPoint
    movement.buildingDoorPoint = entryInfo.doorPoint

    // Set up callback for when character exits the building
    movement.onBuildingExit = () => {
      executeDelivery(job, movement, character)
    }

    return { success: true, shouldRemoveJob: false, shouldRemoveMovement: false }
  }

  /**
   * Execute the actual delivery logic (called after exiting building)
   */
  const executeDelivery = (
    job: Job,
    movement: Movement,
    character: Character
  ): void => {
    handleBuildingDelivery(job, character)
    useJobStore().removeJob(job.id)
    useJobStore().removeMovement(job.id)
  }

  /**
   * Handle servant delivering to a construction site (no building entry animation)
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
    // After exiting building, the callback handles the next step
    if (movement.phase === 'exiting-building') {
      // Movement continues - don't remove anything yet
      return { success: true, shouldRemoveJob: false, shouldRemoveMovement: false }
    }

    if (movement.phase === 'to-pickup') {
      // Arrived at pickup location - start building entry
      const result = startPickupEntry(job, movement, character)
      return {
        success: result.success,
        shouldRemoveJob: !result.success,
        shouldRemoveMovement: !result.success
      }
    }

    if (movement.phase === 'to-delivery') {
      // Arrived at delivery location
      if (job.constructionSiteId) {
        // Construction delivery - no building entry needed
        const success = handleConstructionDelivery(job, character)
        return { success, shouldRemoveJob: true, shouldRemoveMovement: true }
      }

      // Regular building delivery - start building entry
      return startDeliveryEntry(job, movement, character)
    }

    return { success: false, shouldRemoveJob: true, shouldRemoveMovement: true }
  }

  return {
    onComplete,
    getCharacterById,
    getBuildingById
  }
})
