import type { Resource } from './Resources'
export type Building =
  | 'school'
  | 'inn'
  | 'quarry'
  | 'woodcutter'
  | 'sawmill'
  | 'farm'
  | 'mill'
  | 'bakery'
  | 'swinefarm'
  | 'butcher'
  | 'fisherman'
  | 'vineyard'
  | 'goldmine'
  | 'coalmine'
  | 'metallurgist'
  | 'weaponworkshop'
  | 'tannery'
  | 'armoryworkshop'
  | 'stables'
  | 'ironmine'
  | 'ironsmithy'
  | 'weaponsmithy'
  | 'armorsmithy'
  | 'barracks'
  | 'townhall'
  | 'storehouse'
  | 'watchtower'
  | 'siegeworkshop'
  | 'marketplace'

export type GenerateInfo = {
  duration: number // in miliseconds
  input: { [key in Resource]?: number }
  output: { [key in Resource]?: number }
}

export type BuildingInfo = {
  stone: number
  wood: number
  health: number
  pattern: number[][]
  maxStock: { [key in Resource]?: number }
  generate: GenerateInfo | null
}

export type BuildingsInfo = {
  [key in Building]: BuildingInfo
}
