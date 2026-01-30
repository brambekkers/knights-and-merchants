# Knights and Merchants Clone - Todo List

## Phase 1: Resource & Economy Foundation
These are the most critical - the game's core loop depends on them.

- [x] **Complete resource types** - Add all missing: iron ore, gold ore, coal, corn, skins, leather, sausages, wine, horses, weapons, armor ✓
- [ ] **Serf delivery system** - Serfs autonomously pick up resources and deliver to buildings that need them
- [ ] **Dynamic job generation** - Buildings create delivery jobs when needing inputs or having outputs
- [ ] **Production chains** - Implement all chains:
  - [ ] Woodcutter → Sawmill (trunk → wood)
  - [ ] Farm → Mill → Bakery (corn → flour → bread)
  - [ ] Iron Mine → Iron Smithy (iron ore + coal → iron)
  - [ ] Gold Mine → Metallurgist (gold ore + coal → gold)
  - [ ] Swine Farm → Butcher (pig → sausages + skins)
  - [ ] Tannery (skins → leather)
  - [ ] Weapons Workshop (wood → axes, bows, lances)
  - [ ] Weapon Smithy (iron + coal → swords, pikes, crossbows)
  - [ ] Armory Workshop (wood/leather → shields, leather armor)
  - [ ] Armor Smithy (iron + coal → iron armor, iron shields)
  - [ ] Stables (corn → horses)
  - [ ] Vineyard → Inn (grapes → wine)
  - [ ] Fisherman (produces fish)

## Phase 2: Building Systems

- [ ] **Building construction phase** - Buildings need stone/wood delivered before becoming operational
- [ ] **Laborer system** - Laborers physically construct buildings using delivered materials
- [ ] **Field/vineyard placement** - Farms and vineyards need crop fields to be placed
- [ ] **Building deletion** - Remove/demolish buildings from map
- [ ] **Road connection validation** - Buildings must connect to road network to function
- [ ] **Max stock enforcement** - Buildings refuse deliveries when storage is full

## Phase 3: Population & Workers

- [ ] **Schoolhouse training** - Train serfs into specialized workers (costs gold)
- [ ] **Worker assignment** - Workers occupy and operate their buildings
- [ ] **Inn feeding system** - Workers need food to work, Inn distributes food types
- [ ] **Population management** - Track available workers vs required workers
- [ ] **Worker types to implement**:
  - [ ] Serf (delivery)
  - [ ] Laborer (construction)
  - [ ] Stonemason (quarry)
  - [ ] Woodcutter (woodcutter hut)
  - [ ] Carpenter (sawmill, workshops)
  - [ ] Farmer (farm, vineyard)
  - [ ] Fisherman (fisherman hut)
  - [ ] Baker (mill, bakery)
  - [ ] Animal Breeder (swine farm, stables)
  - [ ] Butcher (butcher, tannery)
  - [ ] Miner (all mines)
  - [ ] Metallurgist (metallurgist, iron smithy)
  - [ ] Blacksmith (weapon/armor smithy)
  - [ ] Recruit (watchtower, becomes soldier)

## Phase 4: Storehouse & Logistics

- [ ] **Storehouse as hub** - Central storage where serfs deliver excess resources
- [ ] **Resource routing** - Smart pathfinding to find nearest resource source
- [ ] **Multiple storehouses** - Support for multiple storage locations
- [ ] **Marketplace trading** - Exchange resources with other players/AI

## Phase 5: Military

### Unit Recruitment
- [ ] **Recruit training** - School produces recruits for military
- [ ] **Barracks recruitment** - Combine recruit + weapon + armor = soldier
- [ ] **Town Hall mercenaries** - Hire mercenary units for gold

### Unit Types
- [ ] Militia (axe + recruit)
- [ ] Axe Fighter (axe + leather armor + wooden shield + recruit)
- [ ] Sword Fighter (sword + iron armor + iron shield + recruit)
- [ ] Lance Carrier (lance + leather armor + recruit)
- [ ] Pikeman (pike + iron armor + recruit)
- [ ] Bowman (bow + leather armor + recruit)
- [ ] Crossbowman (crossbow + iron armor + recruit)
- [ ] Scout (axe + leather armor + wooden shield + horse + recruit)
- [ ] Knight (sword + iron armor + iron shield + horse + recruit)

### Combat System
- [ ] **Unit movement** - Military units move on command
- [ ] **Attack system** - Units engage enemies, deal damage
- [ ] **Health system** - Units have HP, can die
- [ ] **Watchtower defense** - Recruits in towers throw stones at enemies
- [ ] **Siege weapons** - Catapults and ballistas for destroying buildings

## Phase 6: Game Features

- [ ] **Save/Load system** - Persist game state
- [ ] **Multiple maps** - Support different map layouts
- [ ] **Win/lose conditions** - Mission objectives
- [ ] **AI opponents** - Computer-controlled enemies
- [ ] **Fog of war** - Limited visibility
- [ ] **Sound effects** - Audio feedback for actions
- [ ] **Music** - Background soundtrack

## Current Implementation Status

### Completed
- [x] Game world rendering (64x64 grid)
- [x] Building placement with collision detection
- [x] 32 building types with visual assets
- [x] Road placement and visualization (11 road variants)
- [x] Character rendering and basic movement animation
- [x] Pathfinding (BFS algorithm)
- [x] Basic resource generation (sawmill, mill)
- [x] UI sidebar with building selection
- [x] Debug visualization (grid, coordinates, blocking)

### Partially Done
- [ ] Job system (hardcoded 3 test jobs, needs dynamic generation)
- [ ] Character types (defined but limited usage)
- [ ] Resource system (only wood, stone, wheat, flour, bread working)
- [ ] Field/vine placement (UI exists, logic empty)

## Key Files Reference

| Component | File |
|-----------|------|
| Main game loop | `src/components/game.vue` |
| Building definitions | `src/constant/buildingInfo.ts` |
| Level data | `src/constant/maps/map1.ts` |
| Pathfinder | `src/utils/pathfinder.ts` |
| Placement logic | `src/utils/placement.ts` |
| Resource types | `src/types/Resources.ts` |
| Building types | `src/types/Buildings.ts` |
| Player/character types | `src/types/Players.ts` |
| Job types | `src/types/Job.ts` |

## Resources Reference (Original KAM)

### Raw Materials
- Tree trunks, Stone, Iron ore, Gold ore, Coal, Corn

### Processed Materials
- Wood (timber), Iron bars, Gold bars, Flour

### Food
- Bread, Sausages, Fish, Wine

### Animal Products
- Pigs, Skins, Leather, Horses

### Military Equipment
- Wooden shields, Iron shields
- Leather armor, Iron armor
- Axes, Swords, Lances, Pikes, Bows, Crossbows
