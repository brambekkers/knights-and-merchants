const map: Grid = createEmptyMap({ x: 64, y: 64 })

const players: Players = [
  {
    buildings: [
      {
        id: 'building-1',
        x: 3,
        y: 1,
        type: 'school',
        stock: {}
      },
      {
        id: 'building-2',
        x: 7,
        y: 1,
        type: 'inn',
        stock: {}
      },
      {
        id: 'building-3',
        x: 6,
        y: 6,
        type: 'storehouse',
        stock: {}
      },
      {
        id: 'building-4',
        x: 12,
        y: 5,
        type: 'farm',
        stock: {}
      },
      {
        id: 'building-5',
        x: 10,
        y: 9,
        type: 'mill',
        stock: {
          corn: 5
        }
      },
      {
        id: 'building-6',
        x: 6,
        y: 10,
        type: 'bakery',
        stock: {}
      },
      {
        id: 'building-7',
        x: 1,
        y: 11,
        type: 'vineyard',
        stock: {}
      },
      {
        id: 'building-8',
        x: 14,
        y: 12,
        type: 'watchtower',
        stock: {}
      }
    ],
    roads: [
      { id: 'road-1', x: 4, y: 3 },
      { id: 'road-2', x: 8, y: 3 },
      { id: 'road-3', x: 7, y: 8 },
      { id: 'road-4', x: 4, y: 4 },
      { id: 'road-5', x: 5, y: 4 },
      { id: 'road-6', x: 6, y: 4 },
      { id: 'road-7', x: 7, y: 4 },
      { id: 'road-8', x: 8, y: 4 },
      { id: 'road-9', x: 5, y: 8 },
      { id: 'road-10', x: 5, y: 7 },
      { id: 'road-11', x: 5, y: 6 },
      { id: 'road-12', x: 5, y: 5 },
      { id: 'road-13', x: 5, y: 9 },
      { id: 'road-14', x: 6, y: 9 },
      { id: 'road-15', x: 7, y: 9 },
      { id: 'road-16', x: 13, y: 7 },
      { id: 'road-17', x: 9, y: 4 },
      { id: 'road-18', x: 9, y: 6 },
      { id: 'road-19', x: 9, y: 5 },
      { id: 'road-20', x: 9, y: 8 },
      { id: 'road-21', x: 9, y: 7 },
      { id: 'road-22', x: 9, y: 9 },
      { id: 'road-23', x: 8, y: 9 },
      { id: 'road-24', x: 13, y: 8 },
      { id: 'road-25', x: 11, y: 8 },
      { id: 'road-26', x: 10, y: 8 },
      { id: 'road-27', x: 12, y: 8 },
      { id: 'road-28', x: 11, y: 10 },
      { id: 'road-29', x: 11, y: 11 },
      { id: 'road-30', x: 10, y: 11 },
      { id: 'road-31', x: 9, y: 10 },
      { id: 'road-32', x: 9, y: 11 },
      { id: 'road-33', x: 8, y: 12 },
      { id: 'road-34', x: 7, y: 13 },
      { id: 'road-35', x: 8, y: 13 },
      { id: 'road-36', x: 9, y: 13 },
      { id: 'road-37', x: 9, y: 12 },
      { id: 'road-38', x: 3, y: 12 },
      { id: 'road-39', x: 3, y: 13 },
      { id: 'road-40', x: 4, y: 13 },
      { id: 'road-41', x: 5, y: 13 },
      { id: 'road-42', x: 6, y: 13 },
      { id: 'road-43', x: 15, y: 13 },
      { id: 'road-44', x: 15, y: 14 },
      { id: 'road-45', x: 14, y: 14 },
      { id: 'road-46', x: 13, y: 14 },
      { id: 'road-47', x: 12, y: 14 },
      { id: 'road-48', x: 11, y: 14 },
      { id: 'road-49', x: 10, y: 14 },
      { id: 'road-50', x: 9, y: 14 }
    ],
    fields: [],
    vines: [],
    characters: []
  }
]

players.forEach((player) => {
  player.roads.forEach((road) => {
    const { x, y } = road
    placeRoad({
      map,
      x,
      y
    })
  })

  player.buildings.forEach((building) => {
    const { x, y, type } = building
    placeBuilding({
      map,
      x,
      y,
      type
    })
  })
})

export { map, players }
