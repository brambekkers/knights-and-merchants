// Raw Materials
export type RawResource =
  | 'trunk'    // Tree trunks from woodcutter
  | 'stone'    // From quarry
  | 'ironOre'  // From iron mine
  | 'goldOre'  // From gold mine
  | 'coal'     // From coal mine
  | 'corn'     // From farm (wheat/corn)

// Processed Materials
export type ProcessedResource =
  | 'wood'     // Timber from sawmill
  | 'iron'     // From iron smithy
  | 'gold'     // From metallurgist
  | 'flour'    // From mill

// Food
export type FoodResource =
  | 'bread'    // From bakery
  | 'sausage'  // From butcher
  | 'fish'     // From fisherman
  | 'wine'     // From vineyard

// Animal Products
export type AnimalResource =
  | 'pig'      // From swine farm
  | 'skin'     // From swine farm (when pig slaughtered)
  | 'leather'  // From tannery
  | 'horse'    // From stables

// Weapons (from workshops)
export type WeaponResource =
  | 'axe'      // Weapons workshop (wood)
  | 'sword'    // Weapon smithy (iron + coal)
  | 'lance'    // Weapons workshop (wood)
  | 'pike'     // Weapon smithy (iron + coal)
  | 'bow'      // Weapons workshop (wood)
  | 'crossbow' // Weapon smithy (iron + coal)

// Armor & Shields
export type ArmorResource =
  | 'woodenShield'  // Armory workshop (wood)
  | 'ironShield'    // Armor smithy (iron + coal)
  | 'leatherArmor'  // Armory workshop (leather)
  | 'ironArmor'     // Armor smithy (iron + coal)

// Combined type for all resources
export type Resource =
  | RawResource
  | ProcessedResource
  | FoodResource
  | AnimalResource
  | WeaponResource
  | ArmorResource

// Utility type for stock/inventory objects
export type Stock = Partial<Record<Resource, number>>

// Resource categories for UI grouping
export const RESOURCE_CATEGORIES = {
  raw: ['trunk', 'stone', 'ironOre', 'goldOre', 'coal', 'corn'] as const,
  processed: ['wood', 'iron', 'gold', 'flour'] as const,
  food: ['bread', 'sausage', 'fish', 'wine'] as const,
  animal: ['pig', 'skin', 'leather', 'horse'] as const,
  weapons: ['axe', 'sword', 'lance', 'pike', 'bow', 'crossbow'] as const,
  armor: ['woodenShield', 'ironShield', 'leatherArmor', 'ironArmor'] as const
} as const
