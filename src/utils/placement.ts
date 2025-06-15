import buildingInfo from '@/constant/buildingInfo'

type BuildingInfo = Vector2D & {
  map: Grid
  type: Building
}

type RoadInfo = Vector2D & {
  map: Grid
}

export const placeBuilding = (info: BuildingInfo) => {
  const buildInfo = buildingInfo[info.type]
  if (!buildInfo) return

  // Block all tiles that the building occupies
  for (let y = 0; y < buildInfo.pattern.length; y++) {
    for (let x = 0; x < buildInfo.pattern[0].length; x++) {
      info.map[info.y + y][info.x + x].blockedRoad = true
    }
  }

  // mark the tiles around the building as blocked for roads
  for (let y = -1; y <= buildInfo.pattern.length; y++) {
    for (let x = -1; x <= buildInfo.pattern[0].length; x++) {
      if (!info.map[info.y + y]?.[info.x + x]) return
      info.map[info.y + y][info.x + x].blockedBuilding = true
    }
  }
}

export const placeRoad = (info: RoadInfo) => {
  // Check if the road can be placed
  if (info.map[info.y][info.x].blockedRoad) return false

  // Mark the road tile as blocked for buildings
  info.map[info.y][info.x].blockedRoad = true
  info.map[info.y][info.x].isRoad = true
}
