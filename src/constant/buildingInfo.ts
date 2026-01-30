export default {
  school: {
    stone: 5,
    wood: 6,
    health: 550,
    pattern: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 2, 1]
    ],
    maxStock: {},
    generate: null
  },
  inn: {
    stone: 5,
    wood: 6,
    health: 550,
    pattern: [
      [0, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 2, 1, 1]
    ],
    maxStock: {},
    generate: null
  },
  quarry: {
    stone: 2,
    wood: 3,
    health: 250,
    pattern: [
      [1, 1, 1],
      [1, 2, 1]
    ],
    maxStock: {},
    generate: null
  },
  woodcutter: {
    stone: 2,
    wood: 3,
    health: 250,
    pattern: [
      [1, 1, 1],
      [1, 1, 2]
    ],
    maxStock: {},
    generate: null
  },
  sawmill: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1, 1],
      [1, 2, 1, 1]
    ],
    maxStock: {
      tree: 3,
      wood: 6
    },
    generate: {
      duration: 4000,
      input: {
        tree: 1
      },
      output: {
        wood: 2
      }
    } as GenerateInfo
  },
  farm: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 2, 1, 1]
    ],
    maxStock: {},
    generate: null
  },
  mill: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1],
      [1, 2, 1]
    ],
    maxStock: {
      wheat: 5,
      flour: 4
    },
    generate: {
      duration: 5000,
      input: {
        wheat: 1
      },
      output: {
        flour: 1
      }
    } as GenerateInfo
  },
  bakery: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 2]
    ],
    maxStock: {},
    generate: null
  },
  swinefarm: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [0, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 2]
    ],
    maxStock: {},
    generate: null
  },
  butcher: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 0],
      [1, 1, 1],
      [1, 1, 2]
    ],
    maxStock: {},
    generate: null
  },
  fisherman: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 0],
      [2, 1, 1]
    ],
    maxStock: {},
    generate: null
  },
  vineyard: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1],
      [1, 1, 2]
    ],
    maxStock: {},
    generate: null
  },
  goldmine: {
    stone: 2,
    wood: 3,
    health: 250,
    pattern: [[1, 2]],
    generate: null,
    maxStock: {}
  },
  coalmine: {
    stone: 2,
    wood: 3,
    health: 250,
    pattern: [
      [1, 1, 1],
      [1, 2, 1]
    ],
    maxStock: {},
    generate: null
  },
  metallurgist: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 2, 1]
    ],
    maxStock: {},
    generate: null
  },
  weaponworkshop: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1, 1],
      [1, 2, 1, 1]
    ],
    maxStock: {},
    generate: null
  },
  tannery: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1],
      [1, 2, 1]
    ],
    maxStock: {},
    generate: null
  },
  armoryworkshop: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 0],
      [1, 1, 1],
      [2, 1, 1]
    ],
    maxStock: {},
    generate: null
  },
  stables: {
    stone: 5,
    wood: 6,
    health: 550,
    pattern: [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 2, 1]
    ],
    maxStock: {},
    generate: null
  },
  ironmine: {
    stone: 2,
    wood: 3,
    health: 250,
    pattern: [[1, 2, 1]],
    maxStock: {},
    generate: null
  },
  ironsmithy: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1, 1],
      [1, 1, 2, 1]
    ],
    maxStock: {},
    generate: null
  },
  weaponsmithy: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1, 1],
      [1, 2, 1, 1]
    ],
    maxStock: {},
    generate: null
  },
  armorsmithy: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [0, 1, 1, 0],
      [1, 1, 1, 1],
      [1, 2, 1, 1]
    ],
    maxStock: {},
    generate: null
  },
  barracks: {
    stone: 5,
    wood: 6,
    health: 600,
    pattern: [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 2, 1, 1]
    ],
    maxStock: {},
    generate: null
  },
  townhall: {
    stone: 5,
    wood: 6,
    health: 550,
    pattern: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 2, 1]
    ],
    maxStock: {},
    generate: null
  },
  storehouse: {
    stone: 5,
    wood: 6,
    health: 550,
    pattern: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 2, 1]
    ],
    maxStock: {},
    generate: null
  },
  watchtower: {
    stone: 2,
    wood: 3,
    health: 250,
    pattern: [
      [1, 1],
      [1, 2]
    ],
    maxStock: {},
    generate: null
  },
  siegeworkshop: {
    stone: 3,
    wood: 4,
    health: 300,
    pattern: [[1]],
    maxStock: {},
    generate: null
  },
  marketplace: {
    stone: 6,
    wood: 5,
    health: 550,
    pattern: [
      [0, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 2]
    ],
    maxStock: {},
    generate: null
  }
} satisfies BuildingInfo
