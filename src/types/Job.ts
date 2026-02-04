export type JobId = `job-${string}`

export type Job = {
  id: JobId
  status: 'ready' | 'in-progress' | 'delivering'
  type: string
  character: CharactersType
  description: string
  x1: number
  y1: number
  x2: number
  y2: number
  // Delivery job fields
  sourceBuildingId?: BuildingId
  destBuildingId?: BuildingId
  resource?: Resource
  amount?: number
  // Construction job fields
  constructionSiteId?: ConstructionSiteId
}

export type Movement = {
  characterId: CharacterId
  jobId: JobId
  status: 'ready' | 'in-progress'
  phase: 'to-pickup' | 'to-delivery' | 'to-construction' | 'working' | 'entering-building' | 'inside-building' | 'exiting-building'
  path: Vector2D[]
  // Building entry/exit data
  buildingEntryPoint?: Vector2D // Road tile where character enters/exits
  buildingDoorPoint?: Vector2D // Door tile on the building
  onBuildingExit?: () => void // Callback after exiting building
}
