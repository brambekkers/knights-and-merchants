export type CharacterId = `character-${string}`
export type BuildingId = `building-${string}`
export type RoadId = `road-${string}`

export type PlayerBuilding = Vector2D & {
  id: BuildingId
  type: Building
  stock: { [key in Resource]?: number }
  generating?: boolean
  health?: number // Current health (defaults to max from buildingInfo)
  operator?: CharacterId // ID of the worker operating this building
  construction?: number // 0-100 construction progress, undefined = complete
}

export type PlayerRoad = Vector2D & {
  id: RoadId
}

export type CharactersType =
  | 'servant'
  | 'builder'
  | 'miner'
  | 'woodcutter'
  | 'carpenter'
  | 'fisherman'
  | 'farmer'
  | 'baker'
  | 'metallurgist'
  | 'blacksmith'
  | 'animalbreeder'
  | 'butcher'
  | 'recruit'

export type Character = Vector2D & {
  id: CharacterId
  state: 'idle' | 'busy'
  type: CharactersType
  carrying?: { resource: Resource; amount: number }
}

export type Player = {
  buildings: PlayerBuilding[]
  roads: PlayerRoad[]
  fields: Vector2D[]
  vines: Vector2D[]
  characters: Character[]
}
export type Players = Player[]
