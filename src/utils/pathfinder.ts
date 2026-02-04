import type { MovementType } from '@/constant/movementInfo'

type PathfinderCoordinates = {
  x1: number // Starting x-coordinate
  y1: number // Starting y-coordinate
  x2: number // Ending x-coordinate
  y2: number // Ending y-coordinate
}

type PathfinderOptions = {
  movementType: MovementType
  /** Allow destination to be a construction site (for builders) */
  allowConstructionDestination?: boolean
}

// 8-directional movement (including diagonals)
const MOVES = [
  { dx: 0, dy: -1, cost: 1 }, // Up
  { dx: 0, dy: 1, cost: 1 }, // Down
  { dx: -1, dy: 0, cost: 1 }, // Left
  { dx: 1, dy: 0, cost: 1 }, // Right
  { dx: -1, dy: -1, cost: 1.4 }, // Up-Left (diagonal)
  { dx: 1, dy: -1, cost: 1.4 }, // Up-Right (diagonal)
  { dx: -1, dy: 1, cost: 1.4 }, // Down-Left (diagonal)
  { dx: 1, dy: 1, cost: 1.4 } // Down-Right (diagonal)
]

/**
 * Unified pathfinder supporting multiple movement types
 * Uses A* algorithm with 8-directional movement (including diagonals)
 *
 * Movement types:
 * - road-only: Can only move on roads
 * - road-preferred: Prefers roads but can walk off-road, avoids other construction sites
 * - free: Can move anywhere not blocked by buildings
 */
export const pathfinder = (
  map: Grid,
  coords: PathfinderCoordinates,
  options: PathfinderOptions = { movementType: 'road-only' }
): Vector2D[] | null => {
  const { x1, y1, x2, y2 } = coords
  const { movementType, allowConstructionDestination } = options
  const numRows = map.length
  const numCols = map[0]?.length ?? 0

  // Check if coordinates are in bounds
  const inBounds = (x: number, y: number): boolean => {
    return x >= 0 && x < numCols && y >= 0 && y < numRows
  }

  // Get cell safely
  const getCell = (x: number, y: number): Cell | undefined => {
    return map[y]?.[x]
  }

  // Check if a tile is walkable based on movement type
  const isWalkable = (x: number, y: number): boolean => {
    if (!inBounds(x, y)) return false
    const cell = getCell(x, y)
    if (!cell) return false

    switch (movementType) {
      case 'road-only':
        return cell.isRoad === true

      case 'road-preferred':
        if (cell.isRoad) return true
        if (cell.blockedBuilding) return false
        if (cell.beingBuild) return false // Avoid other construction sites
        return true // Open terrain

      case 'free':
        if (cell.blockedBuilding) return false
        return true

      default:
        return cell.isRoad === true
    }
  }

  // Get movement cost multiplier for a tile (used by road-preferred to penalize off-road)
  const getMovementCostMultiplier = (x: number, y: number): number => {
    if (movementType !== 'road-preferred') return 1

    const cell = getCell(x, y)
    if (!cell) return 1

    // Roads have normal cost, off-road has 1.5x penalty
    // This makes roads preferred but allows shortcuts when significantly shorter
    return cell.isRoad ? 1 : 1.5
  }

  // Check if a tile is walkable, but also allow blockedBuilding tiles
  // Used for tiles adjacent to construction sites so builder can approach from any direction
  const isWalkableOrBlockedBuilding = (x: number, y: number): boolean => {
    if (!inBounds(x, y)) return false
    const cell = getCell(x, y)
    if (!cell) return false

    // Allow blockedBuilding tiles (building footprint buffer zones)
    // but still block actual obstacles like roads being built
    if (cell.blockedRoad && !cell.isRoad) return false
    if (cell.beingBuild) return false
    return true
  }

  // Check if a tile is valid as a start/end point
  // More lenient than isWalkable - allows tiles where characters can reasonably stand
  const isValidStartPoint = (x: number, y: number): boolean => {
    if (!inBounds(x, y)) return false
    const cell = getCell(x, y)
    if (!cell) return false

    // Roads are always valid
    if (cell.isRoad) return true

    // Construction sites are valid (character may have just delivered there)
    if (cell.beingBuild) return true

    // For road-preferred, be extremely lenient - allow any in-bounds tile
    // The A* algorithm will handle finding a valid path
    if (movementType === 'road-preferred') {
      return true
    }

    return isWalkable(x, y)
  }

  // Check if destination is valid (may differ from walkable for construction sites)
  const isValidDestination = (x: number, y: number): boolean => {
    if (!inBounds(x, y)) return false
    const cell = getCell(x, y)
    if (!cell) return false

    // If construction destination is allowed, accept beingBuild tiles
    if (allowConstructionDestination && cell.beingBuild) {
      return true
    }

    // For road-preferred mode, use same lenient logic as start points
    // If a character can stand somewhere (start point), they should be able to go there (destination)
    if (movementType === 'road-preferred') {
      return isValidStartPoint(x, y)
    }

    return isWalkable(x, y)
  }

  // Check if diagonal movement is allowed (no corner cutting)
  const canMoveDiagonally = (fromX: number, fromY: number, dx: number, dy: number): boolean => {
    // For diagonal moves, check that we're not cutting corners
    if (dx !== 0 && dy !== 0) {
      // Must be able to walk through at least one of the adjacent cardinal tiles
      const canPassHorizontal = isWalkable(fromX + dx, fromY)
      const canPassVertical = isWalkable(fromX, fromY + dy)

      // Allow diagonal if at least one cardinal direction is open (no corner cutting)
      return canPassHorizontal || canPassVertical
    }
    return true // Not a diagonal move
  }

  // Validate start and end points
  if (!isValidStartPoint(x1, y1)) {
    console.error(`Pathfinder (${movementType}): Start point is not walkable.`, { x1, y1 })
    return null
  }
  if (!isValidDestination(x2, y2)) {
    console.error(`Pathfinder (${movementType}): End point is not valid.`, { x2, y2 })
    return null
  }

  // Octile distance heuristic - must be admissible (never overestimate)
  // Uses minimum possible costs: 1.0 cardinal, 1.4 diagonal
  const DIAGONAL_COST = 1.4
  const CARDINAL_COST = 1.0
  const heuristic = (x: number, y: number): number => {
    const dx = Math.abs(x - x2)
    const dy = Math.abs(y - y2)
    const diagonal = Math.min(dx, dy)
    const straight = Math.abs(dx - dy)
    return diagonal * DIAGONAL_COST + straight * CARDINAL_COST
  }

  // A* algorithm
  type Node = { x: number; y: number; g: number; f: number }
  const openSet: Node[] = [{ x: x1, y: y1, g: 0, f: heuristic(x1, y1) }]
  const gScores: Record<string, number> = { [`${x1},${y1}`]: 0 }
  const predecessors: Record<string, Vector2D | null> = { [`${x1},${y1}`]: null }

  while (openSet.length > 0) {
    // Get node with lowest f score
    openSet.sort((a, b) => a.f - b.f)
    const current = openSet.shift()!
    const { x: currentX, y: currentY, g: currentG } = current
    const currentKey = `${currentX},${currentY}`

    // Skip if we've already processed this node with a better path
    // (handles duplicate entries in openSet from finding better routes)
    if (gScores[currentKey] !== undefined && currentG > gScores[currentKey]) continue

    // Check if we've reached the destination
    if (currentX === x2 && currentY === y2) {
      // Reconstruct path
      const path: Vector2D[] = []
      let node: Vector2D | null = { x: x2, y: y2 }
      while (node !== null) {
        path.unshift(node)
        node = predecessors[`${node.x},${node.y}`] ?? null
      }
      return path
    }

    // Explore neighbors (8 directions)
    for (const move of MOVES) {
      const nextX = currentX + move.dx
      const nextY = currentY + move.dy
      const nextKey = `${nextX},${nextY}`

      // Check diagonal movement constraints
      if (!canMoveDiagonally(currentX, currentY, move.dx, move.dy)) continue

      // Allow reaching the destination even if it's a construction site
      const isDestination = nextX === x2 && nextY === y2
      // Also allow walking through blockedBuilding tiles when adjacent to destination
      // This lets builders approach construction sites from any direction
      const isAdjacentToDestination = allowConstructionDestination &&
        Math.abs(nextX - x2) <= 1 && Math.abs(nextY - y2) <= 1
      const canWalk = isDestination
        ? isValidDestination(nextX, nextY)
        : isAdjacentToDestination
          ? isWalkableOrBlockedBuilding(nextX, nextY)
          : isWalkable(nextX, nextY)

      if (!canWalk) continue

      // Apply cost multiplier (off-road penalty for road-preferred mode)
      const moveCost = move.cost * getMovementCostMultiplier(nextX, nextY)
      const tentativeG = currentG + moveCost

      // Only process if we found a better path
      if (gScores[nextKey] === undefined || tentativeG < gScores[nextKey]) {
        gScores[nextKey] = tentativeG
        predecessors[nextKey] = { x: currentX, y: currentY }
        openSet.push({ x: nextX, y: nextY, g: tentativeG, f: tentativeG + heuristic(nextX, nextY) })
      }
    }
  }

  // No path found
  return null
}

/**
 * Convenience function for road-only pathfinding (servants delivering on roads)
 */
export const roadPathfinder = (map: Grid, coords: PathfinderCoordinates): Vector2D[] | null => {
  return pathfinder(map, coords, { movementType: 'road-only' })
}

/**
 * Convenience function for builder pathfinding (can go off-road, destination can be construction site)
 */
export const preferredPathfinder = (map: Grid, coords: PathfinderCoordinates): Vector2D[] | null => {
  return pathfinder(map, coords, {
    movementType: 'road-preferred',
    allowConstructionDestination: true
  })
}

/**
 * Convenience function for free movement (click-to-move, future implementation)
 */
export const freePathfinder = (map: Grid, coords: PathfinderCoordinates): Vector2D[] | null => {
  return pathfinder(map, coords, { movementType: 'free' })
}
