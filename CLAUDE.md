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
│       ├── characters.vue    # Main character rendering (routes to type-specific components)
│       ├── characters/       # Character-specific animated components
│       │   └── Servant.vue   # Animated servant with 8-directional walking sprites
│       ├── roads.vue         # Road rendering
│       ├── grid.vue          # Map grid rendering
│       └── sidebar/          # UI sidebar components
├── constant/
│   ├── buildingInfo.ts       # Building definitions (costs, patterns, generation)
│   ├── movementInfo.ts       # Character movement type mappings
│   └── maps/
│       └── map1.ts           # Level 1 map data
├── stores/
│   ├── players.ts            # Player state, resource generation
│   ├── job.ts                # General job dispatcher
│   ├── jobs/                 # Character-specific job handlers
│   │   ├── servant.ts        # Servant jobs (delivery)
│   │   └── builder.ts        # Builder jobs (construction)
│   ├── construction.ts       # Construction site management
│   ├── movement.ts           # Character movement/animation
│   ├── delivery.ts           # Serf delivery orchestration
│   ├── map.ts                # Map state
│   └── build.ts              # Building/road/field/vines placement
├── types/
│   ├── Players.ts            # Player, Building, Character types
│   ├── Job.ts                # Job, Movement types
│   ├── Construction.ts       # Construction site types
│   ├── Resources.ts          # All resource types
│   ├── Buildings.ts          # Building type definitions
│   ├── Map.ts                # Grid, Cell types
│   └── General.ts            # Vector2D
└── utils/
    ├── pathfinder.ts         # A* pathfinding with movement types (8-directional)
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
- Characters have: `id`, `x`, `y`, `state`, `type`, `carrying`, `visible`
- States: `idle`, `busy`
- Types: `servant`, `builder`, `miner`, `woodcutter`, `carpenter`, `fisherman`, `farmer`, `baker`, `metallurgist`, `blacksmith`, `animalbreeder`, `butcher`, `recruit`
- `visible`: Optional boolean (defaults to true), set to false when entering buildings
- Serfs (servants) handle resource delivery
- Builders construct roads, fields, vines, and buildings
- Movement types per character defined in `src/constant/movementInfo.ts`
- Building operators are defined in `src/constant/characterInfo.ts`:

**Character Animation (Servant):**
- Sprites located in `public/assets/characters/servant/`
- 8 directions: `up`, `down`, `left`, `right`, `upLeft`, `upRight`, `downLeft`, `downRight`
- 8 frames per direction: `direction1.png` through `direction8.png`
- Direction calculated from position delta (watches x/y changes)
- Animation auto-stops after 150ms of no movement

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
The job system uses a dispatcher pattern with specialized job stores:

**Architecture:**
- `job.ts` - General dispatcher: manages job queue, assigns characters, routes to job stores
- `jobs/servant.ts` - Handles servant jobs (delivery, construction-delivery)
- `jobs/builder.ts` - Handles builder jobs (construction)

**Job Types:**
- `delivery` - Servant delivers resources between buildings
- `construction-delivery` - Servant delivers materials to construction site
- `construction` - Builder constructs at a site

**Movement Phases:**
- `to-pickup` - Walking to source building (servant)
- `to-delivery` - Walking to destination (servant)
- `to-construction` - Walking to construction site (builder)
- `working` - Builder working at site (managed by construction store)
- `entering-building` - Animating from road entry point to building door
- `inside-building` - Character hidden, waiting inside building
- `exiting-building` - Animating from building door back to road entry point

**Job structure:**
```typescript
{
  id: JobId,
  status: 'ready' | 'in-progress' | 'delivering',
  type: 'delivery' | 'construction-delivery' | 'construction',
  character: CharactersType,
  sourceBuildingId?: BuildingId,
  destBuildingId?: BuildingId,
  constructionSiteId?: ConstructionSiteId,
  resource?: Resource,
  amount?: number,
  x1, y1: first destination coordinates,
  x2, y2: second destination coordinates
}
```

### 5b. Construction System
Builders construct roads, fields, vines, and buildings.

**Construction Flow:**
1. User places item → construction site created (marked, not built)
2. Builder assigned → walks to site entry point
3. Servants deliver required materials (if any)
4. Builder works proportionally to delivered materials
5. When 100% complete → actual item created

**Resource Requirements:**
- Roads: 1 stone
- Fields: none (just builder work)
- Vines: 1 wood
- Buildings: per `buildingInfo` (stone + wood costs)

**ConstructionSite structure:**
```typescript
{
  id: ConstructionSiteId,
  type: 'building' | 'road' | 'field' | 'vines',
  x, y: position,
  buildingType?: Building,
  buildingId?: BuildingId,
  requiredResources: Partial<Record<Resource, number>>,
  deliveredResources: Partial<Record<Resource, number>>,
  status: 'planned' | 'waiting-builder' | 'in-progress' | 'completed',
  progress: number, // 0-100
  assignedBuilderId?: CharacterId,
  entryPoint?: Vector2D
}
```

**Key behaviors:**
- Buildings are placed with `construction: 0` (under construction) and don't generate resources until complete
- Builder can start working with partial materials (progress limited by delivered %)
- Construction store manages builder assignment and progress updates

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
- Movement speed configurable (0-5 levels)

**Pathfinding:**
- A* algorithm with Euclidean distance heuristic
- 8-directional movement (cardinal: cost 1.0, diagonal: cost 1.4)
- Corner-cutting prevention for diagonal moves

**Movement Types** (defined in `constant/movementInfo.ts`):
| Type | Behavior | Characters |
|------|----------|------------|
| `road-only` | Only walks on roads | Building operators (miner, baker, etc.) |
| `road-preferred` | Prefers roads, can walk off-road, avoids construction sites | Servants, Builders |
| `free` | Can walk anywhere not blocked by buildings | Future click-to-move units |

**Pathfinder Functions:**
```typescript
// Main function with options
pathfinder(map, coords, { movementType, allowConstructionDestination })

// Convenience wrappers
roadPathfinder(map, coords)       // road-only
preferredPathfinder(map, coords)  // road-preferred + allowConstructionDestination
freePathfinder(map, coords)       // free movement

// Dynamic selection based on character type (used in job.ts)
const movementType = getMovementType(characterType)  // from movementInfo.ts
```

## Game Loop

```typescript
const gameLoop = () => {
  requestAnimationFrame(gameLoop)
  usePlayersStore().update()      // Resource generation (skips buildings under construction)
  useConstructionStore().update() // Assign builders, process construction progress
  useDeliveryStore().update()     // Create delivery jobs (includes construction site needs)
  useJobStore().update()          // Assign jobs to characters (servants, builders)
  useMovementStore().update()     // Animate movement
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
// Get just the road tile (entry point)
const entryPoint = getBuildingEntryPoint(building, map)

// Get both entry point and door point (for animations)
const { entryPoint, doorPoint } = getBuildingEntryInfo(building, map)
```

### Building Entry/Exit Animation
When servants pickup or deliver resources, they visually "enter" the building:
1. Character walks to entry point (road tile adjacent to door)
2. Character animates from entry point to door point (building tile)
3. Character becomes hidden (`visible = false`)
4. After ~800ms inside, character reappears at door
5. Character animates from door back to entry point
6. Pickup/delivery logic executes, job continues

**Movement structure for building entry:**
```typescript
{
  // ... standard movement fields
  buildingEntryPoint?: Vector2D  // Road tile where character enters/exits
  buildingDoorPoint?: Vector2D   // Building door tile
  onBuildingExit?: () => void    // Callback after exiting (pickup/delivery logic)
}
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
- **Builder construction system** (roads, fields, vines, buildings)
- **Construction material delivery** (servants deliver to construction sites)
- **Progressive building** (builder works proportionally to delivered materials)
- **Animated character sprites** (servant walking animation, 8 directions)
- **Building entry/exit animation** (servants visually enter/exit buildings during pickup/delivery)

### Not Yet Implemented
- Worker assignment to buildings (operators)
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

### Adding a new character job type
1. Create `src/stores/jobs/<character>.ts` with `onComplete()` handler
2. Add case to switch in `job.ts` `onComplete()` to dispatch to new job store
3. Update `getInitialPhase()` in `job.ts` if new movement phases needed
4. Add new phases to `Movement['phase']` in `src/types/Job.ts` if needed

### Adding animated sprites for a new character type
1. Add sprite images to `public/assets/characters/<type>/`
   - 8 directions: `up`, `down`, `left`, `right`, `upLeft`, `upRight`, `downLeft`, `downRight`
   - 8 frames per direction: `<direction>1.png` through `<direction>8.png`
2. Create `src/components/game/characters/<Type>.vue` (copy from `Servant.vue`)
3. Update `src/components/game/characters.vue` to render the new component for that character type

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
