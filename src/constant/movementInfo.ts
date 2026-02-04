/**
 * Movement types for characters
 *
 * road-only: Can only move on roads. Used by building operators (baker, butcher, etc.)
 * road-preferred: Prefers roads but can walk off-road. Target must be connected to road network.
 *                 Used by servants, builders, etc.
 * free: Can move anywhere not blocked. Used for click-to-move units (future implementation).
 */
export type MovementType = 'road-only' | 'road-preferred' | 'free'

/**
 * Maps character types to their movement type
 */
export const characterMovement: Record<CharactersType, MovementType> = {
  // Workers - move on roads only (they walk between their building and resources)
  servant: 'road-preferred',
  builder: 'road-preferred',

  // Building operators - move on roads only
  miner: 'road-only',
  woodcutter: 'road-only',
  carpenter: 'road-only',
  fisherman: 'road-only',
  farmer: 'road-only',
  baker: 'road-only',
  metallurgist: 'road-only',
  blacksmith: 'road-only',
  animalbreeder: 'road-only',
  butcher: 'road-only',
  recruit: 'road-only'
}

/**
 * Get movement type for a character type
 */
export const getMovementType = (characterType: CharactersType): MovementType => {
  return characterMovement[characterType] || 'road-only'
}
