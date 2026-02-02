/**
 * Store for handling builder-specific job logic
 * Builders construct roads, fields, vines, and buildings
 */
export const useBuilderJobStore = defineStore('builderJob', () => {
  const { players } = storeToRefs(usePlayersStore())

  /**
   * Find a character by ID
   */
  const getCharacterById = (characterId: CharacterId): Character | null => {
    const player = players.value[0]
    return player?.characters.find((c) => c.id === characterId) || null
  }

  /**
   * Handle builder arriving at construction site
   * The builder stays at the site until construction is complete
   */
  const handleArrivalAtSite = (
    job: Job,
    character: Character
  ): boolean => {
    if (!job.constructionSiteId) {
      return false
    }

    // Notify construction store that builder arrived
    // The construction store will manage the building progress
    useConstructionStore().onBuilderArrived(job.constructionSiteId, character.id)

    // Builder stays busy - construction store will release when done
    // Don't mark as idle here

    return true
  }

  /**
   * Main handler for builder job completion
   * Called when builder finishes moving to a destination
   */
  const onComplete = (
    job: Job,
    movement: Movement,
    character: Character
  ): { success: boolean; shouldRemoveJob: boolean; shouldRemoveMovement: boolean } => {
    if (movement.phase === 'to-construction') {
      const success = handleArrivalAtSite(job, character)

      // Remove movement but keep job for tracking
      // Construction store will remove job when construction completes
      return {
        success,
        shouldRemoveJob: false,
        shouldRemoveMovement: true
      }
    }

    // Unknown phase for builder
    return { success: false, shouldRemoveJob: true, shouldRemoveMovement: true }
  }

  return {
    onComplete,
    getCharacterById
  }
})
