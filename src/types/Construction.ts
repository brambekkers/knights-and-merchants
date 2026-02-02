export type ConstructionSiteId = `construction-${string}`
export type ConstructionType = 'building' | 'road' | 'field' | 'vines'

export type ConstructionSite = {
  id: ConstructionSiteId
  type: ConstructionType
  x: number
  y: number
  buildingType?: Building // Only for type === 'building'
  buildingId?: BuildingId // Link to PlayerBuilding for buildings
  requiredResources: Partial<Record<Resource, number>>
  deliveredResources: Partial<Record<Resource, number>>
  status: 'planned' | 'waiting-builder' | 'in-progress' | 'completed'
  progress: number // 0-100 (work done by builder)
  assignedBuilderId?: CharacterId
  entryPoint?: Vector2D // Road tile for deliveries
}
