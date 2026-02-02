/**
 * General job store - manages job queue and dispatches to character-specific job stores
 *
 * Job types are handled by specialized stores in jobs/:
 * - Servant jobs (delivery, construction-delivery) → jobs/servant.ts
 * - Builder jobs (construction) → jobs/builder.ts
 *
 * This store handles:
 * - Job queue management
 * - Job assignment to available characters
 * - Dispatching completion events to appropriate job stores
 */
export const useJobStore = defineStore('job', () => {
  const { players } = storeToRefs(usePlayersStore())
  const { movements } = storeToRefs(useMovementStore())
  const { map } = useMapStore()

  // Job queue - populated by delivery store and construction store
  const jobs = ref<Job[]>([])

  /**
   * Find an idle character of the specified type
   * Marks the character as busy if found
   */
  const getAvailableCharacter = (charType: CharactersType): Character | null => {
    const player = players.value[0]
    if (!player) return null
    const character = player.characters.find((c) => c.type === charType && c.state === 'idle')
    if (!character) return null
    character.state = 'busy'
    return character
  }

  /**
   * Find a character by ID
   */
  const getCharacterById = (characterId: CharacterId): Character | null => {
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
   * Remove a job from the queue
   */
  const removeJob = (jobId: JobId): void => {
    const index = jobs.value.findIndex((j) => j.id === jobId)
    if (index > -1) {
      jobs.value.splice(index, 1)
    }
  }

  /**
   * Remove a movement from the queue
   */
  const removeMovement = (jobId: JobId): void => {
    const index = movements.value.findIndex((m) => m.jobId === jobId)
    if (index > -1) {
      movements.value.splice(index, 1)
    }
  }

  /**
   * Determine the initial movement phase based on job type
   */
  const getInitialPhase = (job: Job): Movement['phase'] => {
    if (job.type === 'construction') {
      return 'to-construction'
    }
    return 'to-pickup'
  }

  /**
   * Main update loop - assigns jobs to available characters
   */
  const update = (): void => {
    if (!jobs.value.length) return

    for (const job of jobs.value) {
      // Only process ready jobs
      if (job.status !== 'ready') continue

      // Find an available character of the required type
      const character = getAvailableCharacter(job.character)
      if (!character) continue

      // Create movement record
      const movement: Movement = {
        characterId: character.id,
        jobId: job.id,
        status: 'ready',
        phase: getInitialPhase(job),
        path: []
      }

      // Calculate path to first destination (x1, y1)
      const targetX = job.x1
      const targetY = job.y1

      if (character.x !== targetX || character.y !== targetY) {
        const path = pathfinder(map, {
          x1: character.x,
          y1: character.y,
          x2: targetX,
          y2: targetY
        })

        if (path) {
          movement.path = [...path]
        } else {
          // Cannot reach destination - release character
          character.state = 'idle'
          continue
        }
      }

      job.status = 'in-progress'
      movements.value.push(movement)
    }
  }

  /**
   * Called when a character finishes moving to a destination
   * Dispatches to the appropriate job store based on character type
   */
  const onComplete = (jobId: JobId): void => {
    const job = jobs.value.find((j) => j.id === jobId)
    if (!job) return

    const movement = getMovementForJob(jobId)
    if (!movement) return

    const character = getCharacterById(movement.characterId)
    if (!character) return

    // Dispatch to appropriate job store based on character type
    let result: { success: boolean; shouldRemoveJob: boolean; shouldRemoveMovement: boolean }

    switch (job.character) {
      case 'servant':
        result = useServantJobStore().onComplete(job, movement, character)
        break

      case 'builder':
        result = useBuilderJobStore().onComplete(job, movement, character)
        break

      default:
        // Unknown character type - clean up
        character.state = 'idle'
        result = { success: false, shouldRemoveJob: true, shouldRemoveMovement: true }
    }

    // Clean up based on job store result
    if (result.shouldRemoveJob) {
      removeJob(jobId)
    }
    if (result.shouldRemoveMovement) {
      removeMovement(jobId)
    }
  }

  return {
    jobs,
    update,
    onComplete,
    removeJob,
    removeMovement,
    getCharacterById,
    getBuildingById,
    getMovementForJob
  }
})
