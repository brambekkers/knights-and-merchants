import type { GenerateInfo, BuildingInfo } from '@/types/Buildings'

export const buildingInfo = {
  school: {
    stone: 5,
    wood: 6,
    health: 550,
    pattern: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 2, 1]
    ],
    maxStock: {
      gold: 10
    },
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
    maxStock: {
      bread: 5,
      sausage: 5,
      fish: 5,
      wine: 5
    },
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
    maxStock: {
      stone: 5
    },
    generate: {
      duration: 15750, // 3.81/min
      input: {},
      output: { stone: 1 }
    } as GenerateInfo
  },
  woodcutter: {
    stone: 2,
    wood: 3,
    health: 250,
    pattern: [
      [1, 1, 1],
      [1, 1, 2]
    ],
    maxStock: {
      trunk: 5
    },
    generate: {
      duration: 82200, // 0.73/min (slow - cuts trees)
      input: {},
      output: { trunk: 1 }
    } as GenerateInfo
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
      trunk: 4, // Input buffer limit
      wood: 5 // Output storage
    },
    generate: {
      duration: 18800, // 3.19/min, 1 trunk → 2 wood
      input: { trunk: 1 },
      output: { wood: 2 }
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
    maxStock: {
      corn: 5
    },
    generate: {
      duration: 53600, // 1.12/min (requires fields)
      input: {},
      output: { corn: 1 }
    } as GenerateInfo
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
      corn: 4, // Input buffer limit
      flour: 5 // Output storage
    },
    generate: {
      duration: 43500, // 1.38/min, 1 corn → 1 flour
      input: { corn: 1 },
      output: { flour: 1 }
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
    maxStock: {
      flour: 4, // Input buffer limit
      bread: 5 // Output storage
    },
    generate: {
      duration: 21200, // 2.83/min, 1 flour → 2 bread
      input: { flour: 1 },
      output: { bread: 2 }
    } as GenerateInfo
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
    maxStock: {
      corn: 4, // Input buffer limit
      pig: 5 // Output storage
    },
    generate: {
      duration: 66700, // 0.90/min, 2 corn → 1 pig
      input: { corn: 2 },
      output: { pig: 1 }
    } as GenerateInfo
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
    maxStock: {
      pig: 4, // Input buffer limit
      sausage: 5, // Output storage
      skin: 5 // Output storage
    },
    generate: {
      duration: 13900, // 4.33/min, 1 pig → 3 sausage + 1 skin
      input: { pig: 1 },
      output: { sausage: 3, skin: 1 }
    } as GenerateInfo
  },
  fisherman: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 0],
      [2, 1, 1]
    ],
    maxStock: {
      fish: 5
    },
    generate: {
      duration: 60000, // 1.00/min
      input: {},
      output: { fish: 1 }
    } as GenerateInfo
  },
  vineyard: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1],
      [1, 1, 2]
    ],
    maxStock: {
      wine: 5
    },
    generate: {
      duration: 64500, // 0.93/min (requires vines)
      input: {},
      output: { wine: 1 }
    } as GenerateInfo
  },
  goldmine: {
    stone: 2,
    wood: 3,
    health: 250,
    pattern: [[1, 2]],
    maxStock: {
      goldOre: 5
    },
    generate: {
      duration: 45500, // 1.32/min
      input: {},
      output: { goldOre: 1 }
    } as GenerateInfo
  },
  coalmine: {
    stone: 2,
    wood: 3,
    health: 250,
    pattern: [
      [1, 1, 1],
      [1, 2, 1]
    ],
    maxStock: {
      coal: 5
    },
    generate: {
      duration: 46200, // 1.30/min
      input: {},
      output: { coal: 1 }
    } as GenerateInfo
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
    maxStock: {
      goldOre: 4, // Input buffer limit
      coal: 4, // Input buffer limit
      gold: 5 // Output storage
    },
    generate: {
      duration: 21600, // 2.78/min, 1 goldOre + 1 coal → 1 gold
      input: { goldOre: 1, coal: 1 },
      output: { gold: 1 }
    } as GenerateInfo
  },
  weaponworkshop: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1, 1],
      [1, 2, 1, 1]
    ],
    maxStock: {
      wood: 4, // Input buffer limit (timber)
      axe: 5, // Output storage
      lance: 5, // Output storage
      bow: 5 // Output storage
    },
    generate: {
      duration: 36600, // 1.64/min, 2 wood → 1 weapon (cycles through axe/lance/bow)
      input: { wood: 2 },
      output: { axe: 1 } // Note: cycles through axe, lance, bow
    } as GenerateInfo
  },
  tannery: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1],
      [1, 2, 1]
    ],
    maxStock: {
      skin: 4, // Input buffer limit
      leather: 5 // Output storage
    },
    generate: {
      duration: 21000, // 2.86/min, 1 skin → 2 leather
      input: { skin: 1 },
      output: { leather: 2 }
    } as GenerateInfo
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
    maxStock: {
      wood: 4, // Input buffer limit
      leather: 4, // Input buffer limit
      woodenShield: 5, // Output storage
      leatherArmor: 5 // Output storage
    },
    generate: {
      duration: 42000, // 1.43/min, 1 wood → shield OR 1 leather → armor
      input: { wood: 1 },
      output: { woodenShield: 1 } // Note: alternates with leatherArmor
    } as GenerateInfo
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
    maxStock: {
      corn: 4, // Input buffer limit
      horse: 5 // Output storage
    },
    generate: {
      duration: 103400, // 0.58/min, 4 corn → 1 horse
      input: { corn: 4 },
      output: { horse: 1 }
    } as GenerateInfo
  },
  ironmine: {
    stone: 2,
    wood: 3,
    health: 250,
    pattern: [[1, 2, 1]],
    maxStock: {
      ironOre: 5
    },
    generate: {
      duration: 45500, // 1.32/min
      input: {},
      output: { ironOre: 1 }
    } as GenerateInfo
  },
  ironsmithy: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1, 1],
      [1, 1, 2, 1]
    ],
    maxStock: {
      ironOre: 4, // Input buffer limit
      coal: 4, // Input buffer limit
      iron: 5 // Output storage
    },
    generate: {
      duration: 33000, // 1.82/min, 1 ironOre + 1 coal → 1 iron
      input: { ironOre: 1, coal: 1 },
      output: { iron: 1 }
    } as GenerateInfo
  },
  weaponsmithy: {
    stone: 3,
    wood: 4,
    health: 350,
    pattern: [
      [1, 1, 1, 1],
      [1, 2, 1, 1]
    ],
    maxStock: {
      iron: 4, // Input buffer limit
      coal: 4, // Input buffer limit
      sword: 5, // Output storage
      pike: 5, // Output storage
      crossbow: 5 // Output storage
    },
    generate: {
      duration: 38500, // 1.56/min, 1 iron + 1 coal → 1 weapon
      input: { iron: 1, coal: 1 },
      output: { sword: 1 } // Note: cycles through sword, pike, crossbow
    } as GenerateInfo
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
    maxStock: {
      iron: 4, // Input buffer limit
      coal: 4, // Input buffer limit
      ironShield: 5, // Output storage
      ironArmor: 5 // Output storage
    },
    generate: {
      duration: 47200, // 1.27/min, 1 iron + 1 coal → 1 armor/shield
      input: { iron: 1, coal: 1 },
      output: { ironShield: 1 } // Note: alternates with ironArmor
    } as GenerateInfo
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
    maxStock: {
      axe: 5,
      sword: 5,
      lance: 5,
      pike: 5,
      bow: 5,
      crossbow: 5,
      woodenShield: 5,
      ironShield: 5,
      leatherArmor: 5,
      ironArmor: 5,
      horse: 5
    },
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
    maxStock: {
      gold: 20
    },
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
    maxStock: {
      // Raw materials
      trunk: 255,
      stone: 255,
      ironOre: 255,
      goldOre: 255,
      coal: 255,
      corn: 255,
      // Processed
      wood: 255,
      iron: 255,
      gold: 255,
      flour: 255,
      // Food
      bread: 255,
      sausage: 255,
      fish: 255,
      wine: 255,
      // Animals
      pig: 255,
      skin: 255,
      leather: 255,
      horse: 255,
      // Weapons
      axe: 255,
      sword: 255,
      lance: 255,
      pike: 255,
      bow: 255,
      crossbow: 255,
      // Armor
      woodenShield: 255,
      ironShield: 255,
      leatherArmor: 255,
      ironArmor: 255
    },
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
    maxStock: {
      stone: 10
    },
    generate: null
  },
  siegeworkshop: {
    stone: 3,
    wood: 4,
    health: 300,
    pattern: [[1]],
    maxStock: {
      wood: 10,
      iron: 10
    },
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
    maxStock: {
      // Can trade various resources
      wood: 20,
      stone: 20,
      iron: 20,
      gold: 20,
      bread: 20,
      wine: 20
    },
    generate: null
  }
} satisfies BuildingInfo
