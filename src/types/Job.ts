export type JobId = `job-${string}`

export type Job = {
  id: JobId
  status: 'ready' | 'in-progress'
  type: string
  character: CharactersType
  description: string
  x1: number
  y1: number
  x2: number
  y2: number
  get: Resource[] // Resources to get
  set: Resource[] // Resources to set
}

export type Movement = {
  characterId: CharacterId
  jobId: `job-${string}`
  status: 'ready' | 'in-progress'
  path: Vector2D[]
}
