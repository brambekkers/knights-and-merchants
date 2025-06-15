export const createEmptyMap = (size: Vector2D): Grid => {
  const map: Grid = []
  for (let y = 0; y < size.y; y++) {
    map.push([])
    for (let x = 0; x < size.x; x++) {
      map[y].push({
        isRoad: false,
        blockedBuilding: false,
        blockedRoad: false
      })
    }
  }

  // Initialize the edges of the map as blocked
  for (let y = 0; y < size.y; y++) {
    for (let x = 0; x < size.x; x++) {
      if (y === 0 || y === size.y - 1 || x === 0 || x === size.x - 1) {
        map[y][x].blockedBuilding = true
        map[y][x].blockedRoad = false
      }
    }
  }

  return map
}
