type PathfinderCoordinates = {
  x1: number // Starting x-coordinate
  y1: number // Starting y-coordinate
  x2: number // Ending x-coordinate
  y2: number // Ending y-coordinate
}

export const pathfinder = (map: Grid, coords: PathfinderCoordinates) => {
  const { x1, y1, x2, y2 } = coords
  const numRows = map.length
  const numCols = map[0].length

  // --- 1. Initial Validation ---
  // Check if start or end points are out of bounds or not on a road
  if (
    x1 < 0 ||
    x1 >= numCols ||
    y1 < 0 ||
    y1 >= numRows ||
    x2 < 0 ||
    x2 >= numCols ||
    y2 < 0 ||
    y2 >= numRows ||
    !map[y1][x1].isRoad ||
    !map[y2][x2].isRoad
  ) {
    console.error('Start or end point is invalid.')
    return null // Invalid start or end
  }

  // --- 2. Initialization ---
  // The queue will store objects: {x, y}
  const queue = [{ x: x1, y: y1 }]

  // A map to store the path. `predecessor[cellKey] = {x, y}`
  // This lets us trace our steps back from the end to the start.
  const predecessors: Record<string, Vector2D | null> = {}

  // A 2D array to keep track of visited cells
  const visited = Array(numRows)
    .fill(false)
    .map(() => Array(numCols).fill(false))

  visited[y1][x1] = true
  const startKey = `${x1},${y1}`
  predecessors[startKey] = null // The start has no predecessor

  // --- 3. The BFS Loop ---
  while (queue.length > 0) {
    const { x: currentX, y: currentY } = queue.shift() // Dequeue the first cell

    // Check if we've reached the destination
    if (currentX === x2 && currentY === y2) {
      // --- 5. Reconstruct the Path ---
      const path = []
      let current: Vector2D | null = { x: x2, y: y2 }
      while (current !== null) {
        path.unshift(current) // Add to the beginning of the array
        const key: string = `${current.x},${current.y}`
        current = predecessors[key]
      }
      return path
    }

    // --- 4. Explore Neighbors ---
    // Define potential moves (up, down, left, right)
    const moves = [
      { dx: 0, dy: -1 }, // Up
      { dx: 0, dy: 1 }, // Down
      { dx: -1, dy: 0 }, // Left
      { dx: 1, dy: 0 } // Right
    ]

    for (const move of moves) {
      const nextX = currentX + move.dx
      const nextY = currentY + move.dy

      // Check if the neighbor is valid
      if (
        nextX >= 0 &&
        nextX < numCols &&
        nextY >= 0 &&
        nextY < numRows &&
        map[nextY][nextX].isRoad &&
        !visited[nextY][nextX]
      ) {
        // Mark as visited
        visited[nextY][nextX] = true
        // Enqueue the neighbor
        queue.push({ x: nextX, y: nextY })
        // Record how we got here
        const nextKey = `${nextX},${nextY}`
        predecessors[nextKey] = { x: currentX, y: currentY }
      }
    }
  }

  // --- 6. No Path Found ---
  // If the queue becomes empty and we haven't found the end
  return null
}
