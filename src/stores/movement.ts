import { gsap } from 'gsap'

export const useMovementStore = defineStore('movement', () => {
  const { players } = storeToRefs(usePlayersStore())
  const movements = ref<Movement[]>([])
  const movementSpeed = ref(2)
  const movementSpeedMap = [2, 1.5, 1, 0.6, 0.3, 0.05]

  const moveCharacter = (movement: Movement) => {
    const { characterId, jobId, path } = movement
    const nextPosition = path.shift()
    const char = players.value[0].characters.find((c) => c.id === characterId)
    if (!char || !nextPosition) return
    gsap.to(char, {
      ...nextPosition,
      duration: movementSpeedMap[movementSpeed.value],
      ease: 'linear',
      onComplete: () => {
        if (path.length) {
          moveCharacter(movement)
        } else {
          char.state = 'idle' // Mark character as idle when done
          useJobStore().onComplete(jobId) // Update job status
          console.log(`Character ${characterId} reached destination at ${nextPosition.x}, ${nextPosition.y}`)
        }
      }
    })
  }

  const update = () => {
    if (!movements.value.length) return

    for (const movement of movements.value) {
      if (movement.status === 'in-progress') continue
      movement.status = 'in-progress' // Update status to in-progress
      moveCharacter(movement)
    }
  }

  return {
    movements,
    movementSpeed,
    update
  }
})
