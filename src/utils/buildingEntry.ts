import { buildingInfo } from '@/constant/buildingInfo'

export type BuildingEntryInfo = {
  entryPoint: Vector2D // Road tile where character stands
  doorPoint: Vector2D // Building door tile (where character "enters")
}

/**
 * Gets both the entry point (road tile) and door point (building tile)
 * for building entry/exit animations.
 */
export const getBuildingEntryInfo = (
  building: PlayerBuilding,
  map: Grid
): BuildingEntryInfo | null => {
  const info = buildingInfo[building.type]
  const pattern = info.pattern

  // Find the "2" in the pattern (the door)
  let doorRelX = 0
  let doorRelY = 0
  let found = false

  for (let y = 0; y < pattern.length; y++) {
    for (let x = 0; x < pattern[y].length; x++) {
      if (pattern[y][x] === 2) {
        doorRelX = x
        doorRelY = y
        found = true
        break
      }
    }
    if (found) break
  }

  if (!found) {
    console.warn(`No entry point found in pattern for building type: ${building.type}`)
    return null
  }

  // Calculate absolute position of the door on the building
  const doorAbsX = building.x + doorRelX
  const doorAbsY = building.y + doorRelY

  // Search for adjacent road tile (prioritize below, then other directions)
  // Buildings typically face downward, so the road is usually below
  const adjacentOffsets = [
    { dx: 0, dy: 1 },  // below (primary)
    { dx: 1, dy: 0 },  // right
    { dx: -1, dy: 0 }, // left
    { dx: 0, dy: -1 }  // above
  ]

  for (const offset of adjacentOffsets) {
    const roadX = doorAbsX + offset.dx
    const roadY = doorAbsY + offset.dy

    // Check bounds and if it's a road
    if (
      roadY >= 0 &&
      roadY < map.length &&
      roadX >= 0 &&
      roadX < map[0].length &&
      map[roadY][roadX].isRoad
    ) {
      return {
        entryPoint: { x: roadX, y: roadY },
        doorPoint: { x: doorAbsX, y: doorAbsY }
      }
    }
  }

  // No adjacent road found - building not connected to road network
  return null
}

/**
 * Gets the road tile position where serfs can pick up or deliver resources
 * for a given building. The entry point is marked with "2" in the building pattern.
 */
export const getBuildingEntryPoint = (
  building: PlayerBuilding,
  map: Grid
): Vector2D | null => {
  const info = getBuildingEntryInfo(building, map)
  return info?.entryPoint || null
}

/**
 * Cache entry points for all buildings to avoid recalculating
 */
export const cacheAllEntryPoints = (
  buildings: PlayerBuilding[],
  map: Grid
): Map<BuildingId, Vector2D> => {
  const cache = new Map<BuildingId, Vector2D>()

  for (const building of buildings) {
    const entryPoint = getBuildingEntryPoint(building, map)
    if (entryPoint) {
      cache.set(building.id, entryPoint)
    }
  }

  return cache
}
