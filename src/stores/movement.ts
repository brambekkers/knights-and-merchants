import { gsap } from 'gsap'

export const useMovementStore = defineStore('movement', () => {
  const { players } = storeToRefs(usePlayersStore())
  const movements = ref<Movement[]>([])
  const movementSpeed = ref(2)
  const movementSpeedMap = [2, 1.5, 1, 0.6, 0.3, 0.05]
  const buildingEntryDuration = 0.5 // Duration for entering/exiting building animation
  const insideBuildingDuration = 800 // Time spent "inside" building in ms

  /**
   * Find a character by ID
   */
  const getCharacterById = (characterId: CharacterId): Character | null => {
    const player = players.value[0]
    return player?.characters.find((c) => c.id === characterId) || null
  }

  /**
   * Handle character entering a building
   * Animates from entry point to door, then hides character
   */
  const enterBuilding = (movement: Movement) => {
    const char = getCharacterById(movement.characterId)
    if (!char || !movement.buildingDoorPoint) return

    // Animate to door position
    gsap.to(char, {
      x: movement.buildingDoorPoint.x,
      y: movement.buildingDoorPoint.y,
      duration: buildingEntryDuration,
      ease: 'linear',
      onComplete: () => {
        // Hide character (entered building)
        char.visible = false
        movement.phase = 'inside-building'
        movement.status = 'ready'
      }
    })
  }

  /**
   * Handle character being inside building
   * Waits, then triggers exit animation
   */
  const insideBuilding = (movement: Movement) => {
    const char = getCharacterById(movement.characterId)
    if (!char) return

    // Wait inside building, then start exit animation
    setTimeout(() => {
      movement.phase = 'exiting-building'
      movement.status = 'ready'
    }, insideBuildingDuration)
  }

  /**
   * Handle character exiting a building
   * Shows character at door, animates back to entry point, then executes callback
   */
  const exitBuilding = (movement: Movement) => {
    const char = getCharacterById(movement.characterId)
    if (!char || !movement.buildingEntryPoint) return

    // Show character at door position
    char.visible = true

    // Animate back to entry point (road)
    gsap.to(char, {
      x: movement.buildingEntryPoint.x,
      y: movement.buildingEntryPoint.y,
      duration: buildingEntryDuration,
      ease: 'linear',
      onComplete: () => {
        // Execute the callback AFTER exiting (pickup/delivery logic)
        if (movement.onBuildingExit) {
          movement.onBuildingExit()
        }
      }
    })
  }

  /**
   * Move character along path
   */
  const moveCharacter = (movement: Movement) => {
    const { characterId, jobId, path } = movement
    const char = getCharacterById(characterId)
    if (!char) return

    // If path is empty, character is already at destination
    if (path.length === 0) {
      useJobStore().onComplete(jobId)
      return
    }

    const nextPosition = path.shift()
    if (!nextPosition) return

    gsap.to(char, {
      ...nextPosition,
      duration: movementSpeedMap[movementSpeed.value],
      ease: 'linear',
      onComplete: () => {
        if (path.length) {
          moveCharacter(movement)
        } else {
          // Let onComplete handle state changes - it may trigger another movement phase
          useJobStore().onComplete(jobId)
        }
      }
    })
  }

  const update = () => {
    if (!movements.value.length) return

    for (const movement of movements.value) {
      if (movement.status === 'in-progress') continue
      movement.status = 'in-progress'

      // Handle building entry/exit phases
      if (movement.phase === 'entering-building') {
        enterBuilding(movement)
      } else if (movement.phase === 'inside-building') {
        insideBuilding(movement)
      } else if (movement.phase === 'exiting-building') {
        exitBuilding(movement)
      } else {
        // Normal path movement
        moveCharacter(movement)
      }
    }
  }

  return {
    movements,
    movementSpeed,
    update,
    getCharacterById
  }
})
