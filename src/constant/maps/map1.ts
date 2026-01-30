const map: Grid = createEmptyMap({ x: 64, y: 64 })

const players: Players = [
  {
    buildings: [
      {
        x: 3,
        y: 1,
        type: 'school',
        stock: {}
      },
      {
        x: 7,
        y: 1,
        type: 'inn',
        stock: {}
      },
      {
        x: 6,
        y: 6,
        type: 'storehouse',
        stock: {}
      },
      {
        x: 12,
        y: 5,
        type: 'farm',
        stock: {}
      },
      {
        x: 10,
        y: 9,
        type: 'mill',
        stock: {
          wheat: 5
        }
      },
      {
        x: 6,
        y: 10,
        type: 'bakery',
        stock: {}
      },
      {
        x: 1,
        y: 11,
        type: 'vineyard',
        stock: {}
      },
      {
        x: 14,
        y: 12,
        type: 'watchtower',
        stock: {}
      }
    ],
    roads: [
      {
        x: 4,
        y: 3
      },
      {
        x: 8,
        y: 3
      },
      {
        x: 7,
        y: 8
      },
      {
        x: 4,
        y: 4
      },
      {
        x: 5,
        y: 4
      },
      {
        x: 6,
        y: 4
      },
      {
        x: 6,
        y: 4
      },
      {
        x: 7,
        y: 4
      },
      {
        x: 8,
        y: 4
      },
      {
        x: 5,
        y: 8
      },
      {
        x: 5,
        y: 7
      },
      {
        x: 5,
        y: 6
      },
      {
        x: 5,
        y: 5
      },
      {
        x: 5,
        y: 9
      },
      {
        x: 6,
        y: 9
      },
      {
        x: 7,
        y: 9
      },
      {
        x: 13,
        y: 7
      },
      {
        x: 9,
        y: 4
      },
      {
        x: 9,
        y: 6
      },
      {
        x: 9,
        y: 5
      },
      {
        x: 9,
        y: 8
      },
      {
        x: 9,
        y: 7
      },
      {
        x: 9,
        y: 9
      },
      {
        x: 8,
        y: 9
      },
      {
        x: 13,
        y: 8
      },
      {
        x: 11,
        y: 8
      },
      {
        x: 10,
        y: 8
      },
      {
        x: 12,
        y: 8
      },
      {
        x: 11,
        y: 10
      },
      {
        x: 11,
        y: 11
      },
      {
        x: 10,
        y: 11
      },
      {
        x: 9,
        y: 10
      },
      {
        x: 9,
        y: 11
      },
      {
        x: 8,
        y: 12
      },
      {
        x: 7,
        y: 13
      },
      {
        x: 7,
        y: 13
      },
      {
        x: 8,
        y: 13
      },
      {
        x: 9,
        y: 13
      },
      {
        x: 9,
        y: 12
      },
      {
        x: 3,
        y: 12
      },
      {
        x: 3,
        y: 13
      },
      {
        x: 4,
        y: 13
      },
      {
        x: 5,
        y: 13
      },
      {
        x: 6,
        y: 13
      },
      {
        x: 15,
        y: 13
      },
      {
        x: 15,
        y: 14
      },
      {
        x: 14,
        y: 14
      },
      {
        x: 13,
        y: 14
      },
      {
        x: 12,
        y: 14
      },
      {
        x: 11,
        y: 14
      },
      {
        x: 10,
        y: 14
      },
      {
        x: 9,
        y: 14
      }
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
