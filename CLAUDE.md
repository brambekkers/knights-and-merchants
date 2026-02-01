# Knights and Merchants Clone - AI Context

This document provides context for AI assistants working on this codebase.

## Project Overview

A browser-based clone of the classic RTS game "Knights and Merchants" (KAM). The game features resource gathering, production chains, building construction, and eventually military units.

## Tech Stack

- **Framework**: Nuxt 3 (Vue 3 + TypeScript)
- **State Management**: Pinia stores
- **Animation**: GSAP for character movement
- **Styling**: Scoped CSS in Vue SFCs
- **Auto-imports**: Nuxt auto-imports from `stores/` and `types/` directories

## Project Structure

```
src/
├── components/
│   └── game/
│       ├── game.vue          # Main game component with game loop
│       ├── people.vue        # Character rendering
│       ├── roads.vue         # Road rendering
│       ├── grid.vue          # Map grid rendering
│       └── sidebar/          # UI sidebar components
├── constant/
│   ├── buildingInfo.ts       # Building definitions (costs, patterns, generation)
│   └── maps/
│       └── map1.ts           # Level 1 map data
├── stores/
│   ├── players.ts            # Player state, resource generation
│   ├── job.ts                # Job queue and assignment
│   ├── movement.ts           # Character movement/animation
│   ├── delivery.ts           # Serf delivery orchestration
│   ├── map.ts                # Map state
│   └── build.ts              # Building placement
├── types/
│   ├── Players.ts            # Player, Building, Character types
│   ├── Job.ts                # Job, Movement types
│   ├── Resources.ts          # All resource types
│   ├── Buildings.ts          # Building type definitions
│   ├── Map.ts                # Grid, Cell types
│   └── General.ts            # Vector2D
└── utils/
    ├── pathfinder.ts         # BFS pathfinding on roads
    ├── buildingEntry.ts      # Find road tile adjacent to building
    └── placement.ts          # Building/road placement logic
```

## Core Systems

### 1. Map System
- 64x64 grid of cells
- Each cell has: `blockedBuilding`, `blockedRoad`, `isRoad`
- Characters can only move on road cells
- Buildings occupy multiple cells based on their pattern

### 2. Building System
- Buildings are placed on the grid using patterns (2D arrays)
- Pattern value `1` = occupied tile, `2` = entry point (door)
- Buildings have:
  - `maxStock`: Maximum storage for each resource type
  - `generate`: Production info (`duration`, `input`, `output`)
  - Construction costs: `stone`, `wood`
- Resource generation uses `setTimeout` based on `duration`

### 3. Resource System
Resource types are categorized:
- **Raw**: trunk, stone, ironOre, goldOre, coal, corn
- **Processed**: wood, iron, gold, flour
- **Food**: bread, sausage, fish, wine
- **Animal**: pig, skin, leather, horse
- **Weapons**: axe, sword, lance, pike, bow, crossbow
- **Armor**: woodenShield, ironShield, leatherArmor, ironArmor

### 4. Character System
- Characters have: `id`, `x`, `y`, `state`, `type`, `carrying`
- States: `idle`, `busy`
- Types: `servant`, `builder`, `miner`, `woodcutter`, `carpenter`, `fisherman`, `farmer`, `baker`, `metallurgist`, `blacksmith`, `animalbreeder`, `butcher`, `recruit`
- Serfs (servants) handle resource delivery
- Building operators are defined in `src/constant/characterInfo.ts`:

| Building | Operator |
|----------|----------|
| quarry, goldmine, coalmine, ironmine | miner |
| woodcutter | woodcutter |
| sawmill, weaponworkshop, armoryworkshop, siegeworkshop | carpenter |
| farm, vineyard | farmer |
| mill, bakery | baker |
| swinefarm, stables | animalbreeder |
| butcher, tannery | butcher |
| fisherman | fisherman |
| metallurgist, ironsmithy | metallurgist |
| weaponsmithy, armorsmithy | blacksmith |
| barracks, watchtower | recruit |
| storehouse, marketplace | (none) |

### 5. Job System
Jobs have two phases:
1. **to-pickup**: Serf walks to source building
2. **to-delivery**: Serf walks to destination building

Job structure:
```typescript
{
  id: JobId,
  status: 'ready' | 'in-progress' | 'delivering',
  sourceBuildingId: BuildingId,
  destBuildingId: BuildingId,
  resource: Resource,
  amount: number,
  x1, y1: pickup coordinates,
  x2, y2: delivery coordinates
}
```

### 6. Delivery System
The delivery store orchestrates resource flow:
1. **Scans** buildings every 1 second for:
   - **Offers**: Buildings with output resources available
   - **Needs**: Buildings missing input resources
2. **Matches** offers to needs by priority
3. **Creates** delivery jobs
4. Overflow goes to storehouse

Priority factors:
- Empty input buffer = high priority (production halted)
- Full output buffer = high priority (blocking production)
- Food chain buildings get priority boost

### 7. Movement System
- Uses GSAP for smooth animation
- Pathfinder uses BFS algorithm on road network
- Movement speed configurable (0-5 levels)

## Game Loop

```typescript
const gameLoop = () => {
  requestAnimationFrame(gameLoop)
  usePlayersStore().update()    // Resource generation
  useDeliveryStore().update()   // Create delivery jobs
  useJobStore().update()        // Assign jobs to serfs
  useMovementStore().update()   // Animate movement
}
```

## Key Patterns

### Store Access
```typescript
// Within same store - use .value
const jobs = ref<Job[]>([])
jobs.value.push(job)

// From another store - use storeToRefs
const { jobs } = storeToRefs(useJobStore())
jobs.value.push(job)

// Map store returns ref directly
const { map } = useMapStore()
```

### Building Entry Points
Buildings have entry points marked with `2` in their pattern. The road tile for pickup/delivery is found adjacent to this entry point:
```typescript
const entryPoint = getBuildingEntryPoint(building, map)
```

## Production Chains

```
Woodcutter → trunk
Sawmill: trunk → wood

Farm → corn
Mill: corn → flour
Bakery: flour → bread

Swine Farm: corn → pig
Butcher: pig → sausage + skin
Tannery: skin → leather

Coal Mine → coal
Iron Mine → ironOre
Iron Smithy: ironOre + coal → iron

Gold Mine → goldOre
Metallurgist: goldOre + coal → gold

Weapon Workshop: wood → axe, lance, bow
Weapon Smithy: iron + coal → sword, pike, crossbow

Armory Workshop: wood → woodenShield, leather → leatherArmor
Armor Smithy: iron + coal → ironShield, ironArmor

Stables: corn → horse
Vineyard → wine
Fisherman → fish
Quarry → stone
```

## Current Implementation Status

### Working
- Building placement with collision detection
- Road network and pathfinding
- Resource generation in buildings
- Serf delivery system (pickup → delivery)
- Character movement animation
- UI for building selection and info display

### Not Yet Implemented
- Building construction phase (needs materials delivered)
- Laborer system for construction
- Field/vineyard crop placement
- Worker assignment to buildings
- Inn feeding system
- Military units and combat
- Save/Load system
- Multiple players/AI

## Common Tasks

### Adding a new building type
1. Add to `Building` type in `src/types/Buildings.ts`
2. Add definition in `src/constant/buildingInfo.ts` with pattern, costs, maxStock, generate

### Adding a new resource type
1. Add to appropriate category in `src/types/Resources.ts`
2. Update building `maxStock` and `generate` where needed

### Modifying delivery priority
Edit `calculateNeedPriority()` and `calculateOfferPriority()` in `src/stores/delivery.ts`

## Testing the Delivery System

1. Run `pnpm dev`
2. Observe the mill (has initial corn/flour stock)
3. Watch serfs pick up flour and deliver to bakery
4. Check building info panel to see stock changes

---

# Original Knights and Merchants Reference

This section contains reference information from the original KAM game (source: knightsandmerchants.net).

## Game Versions

- **The Shattered Kingdom** - Original game (1998)
- **The Peasants Rebellion** - Expansion pack with additional units
- **KaM Remake** - Community open-source remake

## Citizens (Non-Combat Workers)

| Worker | Role | Workplace |
|--------|------|-----------|
| **Serf** | Delivers resources between buildings, feeds soldiers | Trained at School |
| **Laborer** | Constructs roads and buildings | Needs stone + timber delivered |
| **Stonemason** | Mines and refines stone | Quarry |
| **Woodcutter** | Fells trees, removes knots, plants new trees | Woodcutter's Hut |
| **Carpenter** | Processes wood, creates wooden weapons/armor | Sawmill, Workshops |
| **Farmer** | Harvests corn and grapes | Farm, Vineyard |
| **Fisherman** | Catches fish from lakes | Fisherman's Hut |
| **Baker** | Grinds flour, bakes bread | Mill, Bakery |
| **Animal Breeder** | Breeds horses and pigs | Stables, Swine Farm |
| **Butcher** | Converts pigs to sausages, skins to leather | Butcher's, Tannery |
| **Miner** | Extracts coal, gold ore, iron ore | Mines |
| **Metallurgist** | Smelts ore into refined metals | Metallurgist's, Iron Smithy |
| **Blacksmith** | Forges weapons and armor from iron | Weapon/Armor Smithy |
| **Recruit** | Throws stones from towers, becomes soldier | Watchtower, Barracks |

## Military Units

### Infantry
| Unit | Equipment | Notes |
|------|-----------|-------|
| **Militia** | Hand axe | Weakest, cheapest. Has charge attack (2x speed) |
| **Axe Fighter** | Axe, leather armor, wooden shield | Better durability |
| **Sword Fighter** | Sword, iron armor, iron shield | Strongest infantry, pairs well with ranged |

### Ranged Units
| Unit | Equipment | Notes |
|------|-----------|-------|
| **Bowman** | Bow, leather armor | Effective but vulnerable to melee |
| **Crossbowman** | Crossbow, iron armor | Superior to bowman |

### Anti-Cavalry (Spearmen)
| Unit | Equipment | Notes |
|------|-----------|-------|
| **Lance Carrier** | Lance, leather armor | +2 attack vs cavalry |
| **Pikeman** | Pike, iron armor | Destroys knights, loses to sword fighters |

### Mounted Units
| Unit | Equipment | Notes |
|------|-----------|-------|
| **Scout** | Axe, leather armor, wooden shield, horse | Highest line of sight, vulnerable to lances |
| **Knight** | Sword, iron armor, iron shield, horse | Very deadly, 2x speed, countered by pikes |

### Siege Weapons (Peasants Rebellion only)
| Unit | Cost | Notes |
|------|------|-------|
| **Catapult** | 5 timber + 5 iron | Extremely effective vs buildings, slow, fragile |
| **Ballista** | 5 timber + 5 iron | Most powerful weapon, deadly accurate |

## Buildings Reference

### Resource Production (Cost: 3 timber, 2 stone, HP: 250)
| Building | Worker | Output |
|----------|--------|--------|
| Quarry | Stonemason | Stone (from greenish mountains) |
| Woodcutter's | Woodcutter | Tree trunks |
| Gold Mine | Miner | Gold ore (from gold-veined mountains) |
| Coal Mine | Miner | Coal (look for black dots on ground) |
| Iron Mine | Miner | Iron ore (from bluish mountains) |

### Food Production (Cost: 4 timber, 3 stone, HP: 350)
| Building | Worker | Input → Output |
|----------|--------|----------------|
| Farm | Farmer | (fields) → Corn |
| Mill | Baker | Corn → Flour |
| Bakery | Baker | Flour → Bread (main food source) |
| Vineyard | Farmer | (fields) → Wine (fully restores soldier condition) |
| Swine Farm | Animal Breeder | Corn → Pigs |
| Butcher's | Butcher | 1 Pig → 3 Sausages (best condition restore) |
| Fisherman's | Fisherman | → Fish (for peasants only, depletes over time) |

### Refinement (Cost: 4 timber, 3 stone, HP: 350)
| Building | Worker | Input → Output |
|----------|--------|----------------|
| Sawmill | Carpenter | Trunk → Timber |
| Metallurgist's | Metallurgist | Gold ore + Coal → Gold |
| Iron Smithy | Metallurgist | Iron ore + Coal → Iron |
| Tannery | Butcher | Skins → Leather |

### Weapon/Armor Production (Cost: 4 timber, 3 stone, HP: 350)
| Building | Worker | Products |
|----------|--------|----------|
| Weapons Workshop | Carpenter | 2 timber → Axe/Lance/Bow |
| Weapon Smithy | Blacksmith | 1 iron + 1 coal → Sword/Pike/Crossbow |
| Armory Workshop | Carpenter | 1 timber → Wooden Shield, 1 leather → Leather Armor |
| Armor Smithy | Blacksmith | 1 iron + 1 coal → Iron Shield/Iron Armor |

### Military & Civic (Cost: 6 timber, 5 stone, HP: 550-600)
| Building | Function |
|----------|----------|
| Schoolhouse | Train workers for gold |
| Storehouse | Central resource storage (heart of town) |
| Inn | Feeding point for all citizens (capacity: 6) |
| Barracks | Train soldiers (recruit + equipment) (HP: 600) |
| Stables | Breed horses from corn |
| Town Hall | Hire mercenaries for gold |
| Marketplace | Trade resources (expensive rates) |
| Watchtower | Defense, recruits throw stones (3 timber, 2 stone, HP: 250) |
| Siege Workshop | Build catapults/ballistas (4 timber, 3 stone, HP: 300) |

## Resource Details

### Raw Materials
| Resource | Source | Notes |
|----------|--------|-------|
| Tree Trunks | Woodcutter | Converted to timber at sawmill |
| Stone | Quarry | For buildings, roads, watchtower ammo |
| Iron Ore | Iron Mine | Brown-yellowish mountains with blue veins |
| Gold Ore | Gold Mine | Gray mountains with gold veins |
| Coal | Coal Mine | Limited supply - manage carefully! |

### Key Resources
| Resource | Production | Usage |
|----------|------------|-------|
| **Timber** | Sawmill | Most uses - buildings, weapons, shields, vine fields |
| **Gold** | Metallurgist | Training workers at school, hiring mercenaries |
| **Corn** | Farm | Gateway resource - flour, pigs, horses |

### Food Hierarchy
| Food | Source | Effect |
|------|--------|--------|
| Bread | Bakery | Main food source |
| Sausages | Butcher | Best condition restoration |
| Wine | Vineyard | Completely fills soldier condition |
| Fish | Fisherman | Peasants only, lake depletes over time |

## Soldier Equipment Costs

### Wooden Equipment (Weapons Workshop)
- Hand Axe: 2 timber
- Lance: 2 timber
- Longbow: 2 timber
- Wooden Shield: 1 timber

### Iron Equipment (Smithies)
- Sword: 1 iron + 1 coal
- Pike: 1 iron + 1 coal
- Crossbow: 1 iron + 1 coal
- Iron Shield: 1 iron + 1 coal
- Iron Armor: 1 iron + 1 coal

### Other Equipment
- Leather Armor: 1 leather (Armory Workshop)
- Horse: Corn (Stables)

## Soldier Composition

| Unit | Recruit + Equipment |
|------|---------------------|
| Militia | Recruit + Axe |
| Axe Fighter | Recruit + Axe + Leather Armor + Wooden Shield |
| Sword Fighter | Recruit + Sword + Iron Armor + Iron Shield |
| Lance Carrier | Recruit + Lance + Leather Armor |
| Pikeman | Recruit + Pike + Iron Armor |
| Bowman | Recruit + Bow + Leather Armor |
| Crossbowman | Recruit + Crossbow + Iron Armor |
| Scout | Recruit + Axe + Leather Armor + Wooden Shield + Horse |
| Knight | Recruit + Sword + Iron Armor + Iron Shield + Horse |

## Game Mechanics Notes

- **Serfs** are the backbone - they deliver ALL resources and feed soldiers
- **Coal** is limited and critical for iron/gold production and weapon crafting
- **Inn** is central - all citizens gather there to eat
- **Fish depletes** from lakes over time
- **Fields must be placed** for farms and vineyards to produce
- **Laborers** physically construct buildings after materials are delivered
- **Recruits** can defend from watchtowers before becoming soldiers
- **Spearmen** (Lance Carrier, Pikeman) have +2 attack bonus vs cavalry
- **Mounted units** have 2x movement speed
