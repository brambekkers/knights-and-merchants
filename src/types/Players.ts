export type PlayerBuilding = Vector2D & {
  type: Building
  stock: { [key in Resource]?: number }
  generating?: boolean
}

export type CharacterId = `character-${string}`

export type CharactersType = 'servant' | 'builder' | 'miner' | 'woodcutter' | 'fisherman' | 'farmer' | 'baker'

export type Characters = Vector2D & {
  id: CharacterId
  state: 'idle' | 'busy'
  type: CharactersType
}

export type Player = {
  buildings: PlayerBuilding[]
  roads: Vector2D[]
  fields: Vector2D[]
  vines: Vector2D[]
  characters: Characters[]
}
export type Players = Player[]
