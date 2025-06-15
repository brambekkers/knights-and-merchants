export const useJobStore = defineStore('job', () => {
  const { players } = storeToRefs(usePlayersStore())
  const { movements } = storeToRefs(useMovementStore())
  const { map } = useMapStore()

  const jobs = ref<Job[]>([
    {
      id: 'job-1',
      status: 'ready',
      type: 'gathering wood',
      character: 'woodcutter',
      description: 'Collect resources from the environment.',
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      get: [],
      set: ['wood']
    },
    {
      id: 'job-2',
      status: 'ready',
      type: 'delivering',
      character: 'servant',
      description: 'Transport resources to different locations.',
      x1: 7,
      y1: 8,
      x2: 15,
      y2: 13,
      get: ['stone'],
      set: ['stone']
    },
    {
      id: 'job-3',
      status: 'ready',
      type: 'delivering',
      character: 'servant',
      description: 'Transport resources to different locations.',
      x1: 8,
      y1: 12,
      x2: 8,
      y2: 3,
      get: ['bread'],
      set: ['bread']
    }
  ])

  const getAvailableCharacters = (char: CharactersType) => {
    const player = players.value[0] // Assuming single player for now
    const res = player.characters.find((c) => c.type === char && c.state === 'idle')
    if (!res) return null
    res.state = 'busy'
    return res
  }

  const update = () => {
    if (!jobs.value.length) return

    for (const job of jobs.value) {
      if (job.status === 'in-progress') continue

      const char = getAvailableCharacters(job.character)
      if (!char) continue

      const movement: Movement = {
        characterId: char.id,
        jobId: job.id,
        status: 'ready',
        path: [] as Vector2D[]
      }

      // Check if the character is already at the starting point of the job
      if (char.x !== job.x1 || char.y !== job.y1) {
        const path1 = pathfinder(map, { x1: char.x, y1: char.y, x2: job.x1, y2: job.y1 })
        if (path1) movement.path = [...path1]
      }

      // Move to the job's destination
      const path2 = pathfinder(map, { x1: job.x1, y1: job.y1, x2: job.x2, y2: job.y2 })
      if (path2) movement.path = [...movement.path, ...path2]

      job.status = 'in-progress' // Update job status
      console.log(`Job ${job.id} started with character ${char.id}.`)
      console.log(`Path for job ${job.id}:`, movement.path)
      movements.value.push(movement)
    }
  }

  const onComplete = (jobId: JobId) => {
    console.log(`Job ${jobId} completed.`)
  }

  return { jobs, update, onComplete }
})
