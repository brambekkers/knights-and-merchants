import { buildingInfo } from '@/constant/buildingInfo'

export const useJobStore = defineStore('job', () => {
  const { players } = storeToRefs(usePlayersStore())
  const { movements } = storeToRefs(useMovementStore())
  const { map } = useMapStore()

  // Start with empty jobs array - delivery store will populate it
  const jobs = ref<Job[]>([])

  /**
   * Find an idle character of the specified type
   */
  const getAvailableCharacters = (char: CharactersType) => {
    const player = players.value[0]
    const res = player.characters.find((c) => c.type === char && c.state === 'idle')
    if (!res) return null
    res.state = 'busy'
    return res
  }

  /**
   * Find a character by ID
   */
  const getCharacterById = (characterId: CharacterId): Characters | null => {
    const player = players.value[0]
    return player.characters.find((c) => c.id === characterId) || null
  }

  /**
   * Find a building by ID
   */
  const getBuildingById = (buildingId: BuildingId): PlayerBuilding | null => {
    const player = players.value[0]
    return player.buildings.find((b) => b.id === buildingId) || null
  }

  /**
   * Find the movement associated with a job
   */
  const getMovementForJob = (jobId: JobId): Movement | null => {
    return movements.value.find((m) => m.jobId === jobId) || null
  }

  /**
   * Main update loop - assigns jobs to available characters
   */
  const update = () => {
    if (!jobs.value.length) return

    for (const job of jobs.value) {
      // Only process ready jobs
      if (job.status !== 'ready') continue

      const char = getAvailableCharacters(job.character)
      if (!char) continue

      const movement: Movement = {
        characterId: char.id,
        jobId: job.id,
        status: 'ready',
        phase: 'to-pickup',
        path: [] as Vector2D[]
      }

      // Calculate path to pickup location
      if (char.x !== job.x1 || char.y !== job.y1) {
        const path1 = pathfinder(map, { x1: char.x, y1: char.y, x2: job.x1, y2: job.y1 })
        if (path1) {
          movement.path = [...path1]
        } else {
          // Cannot reach pickup - skip this job for now
          char.state = 'idle'
          continue
        }
      }

      job.status = 'in-progress'
      movements.value.push(movement)
    }
  }

  /**
   * Called when a character finishes moving to a destination
   * Handles resource pickup/delivery and phase transitions
   */
  const onComplete = (jobId: JobId) => {
    const job = jobs.value.find((j) => j.id === jobId)
    if (!job) return

    const movement = getMovementForJob(jobId)
    if (!movement) return

    const character = getCharacterById(movement.characterId)
    if (!character) return

    if (movement.phase === 'to-pickup') {
      // Arrived at source building - pick up resource
      const sourceBuilding = job.sourceBuildingId
        ? getBuildingById(job.sourceBuildingId)
        : null

      if (sourceBuilding && job.resource && job.amount) {
        const availableStock = sourceBuilding.stock[job.resource] || 0

        if (availableStock >= job.amount) {
          // Remove resource from source building
          sourceBuilding.stock[job.resource] = availableStock - job.amount

          // Add to character's carrying
          character.carrying = {
            resource: job.resource,
            amount: job.amount
          }

          // Update job status and movement phase
          job.status = 'delivering'
          movement.phase = 'to-delivery'
          movement.status = 'ready'

          // Calculate path to destination
          const path = pathfinder(map, {
            x1: character.x,
            y1: character.y,
            x2: job.x2,
            y2: job.y2
          })

          if (path && path.length > 0) {
            movement.path = path
          } else {
            // Can't reach destination - drop resource back and fail job
            sourceBuilding.stock[job.resource] = (sourceBuilding.stock[job.resource] || 0) + job.amount
            character.carrying = undefined
            character.state = 'idle'
            removeJob(jobId)
            removeMovement(jobId)
          }
        } else {
          // Not enough resource at source - fail the job
          character.state = 'idle'
          removeJob(jobId)
          removeMovement(jobId)
        }
      } else {
        // Invalid job configuration
        character.state = 'idle'
        removeJob(jobId)
        removeMovement(jobId)
      }
    } else if (movement.phase === 'to-delivery') {
      // Arrived at destination - deliver resource
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

      // Clean up job and movement
      removeJob(jobId)
      removeMovement(jobId)
    }
  }

  /**
   * Remove a job from the queue
   */
  const removeJob = (jobId: JobId) => {
    const index = jobs.value.findIndex((j) => j.id === jobId)
    if (index > -1) {
      jobs.value.splice(index, 1)
    }
  }

  /**
   * Remove a movement from the queue
   */
  const removeMovement = (jobId: JobId) => {
    const index = movements.value.findIndex((m) => m.jobId === jobId)
    if (index > -1) {
      movements.value.splice(index, 1)
    }
  }

  return { jobs, update, onComplete }
})
