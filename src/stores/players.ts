import { players as level1Players } from '@/constant/maps/map1'
import { buildingInfo } from '@/constant/buildingInfo'

export const usePlayersStore = defineStore('players', () => {
  const currentPlayer = ref<number>(0)
  const players = ref<Players>(level1Players)
  const player = computed(() => players.value[currentPlayer.value])

  const addBuilding = (building: PlayerBuilding, playerIndex: number = currentPlayer.value) => {
    players.value[playerIndex].buildings.push(building)
  }

  const addRoad = (road: Vector2D, playerIndex: number = currentPlayer.value) => {
    players.value[playerIndex].roads.push(road)
  }

  const addField = (field: Vector2D, playerIndex: number = currentPlayer.value) => {
    players.value[playerIndex].fields.push(field)
  }

  const addVines = (vines: Vector2D, playerIndex: number = currentPlayer.value) => {
    players.value[playerIndex].vines.push(vines)
  }

  const canGenerate = (generate: GenerateInfo, stock: PlayerBuilding['stock']) => {
    let canGenerate = true
    Object.entries(generate.input).forEach(([res, amount]) => {
      if ((stock[res as Resource] || 0) < amount) {
        canGenerate = false
      }
    })

    return canGenerate
  }

  const generateResources = (building: PlayerBuilding) => {
    const { type, generating, stock } = building
    const { generate } = buildingInfo[type]
    if (generate && !generating && canGenerate(generate, stock)) {
      building.generating = true

      // Simulate resource generation over time
      setTimeout(() => {
        // Deduct input resources
        Object.entries(generate.input).forEach(([res, amount]) => {
          stock[res as Resource]! -= amount as number
        })

        // Add output resources
        Object.entries(generate.output).forEach(([res, amount]) => {
          stock[res as Resource] = (stock[res as Resource] || 0) + (amount as number)
        })

        building.generating = false
      }, generate.duration)
    }
  }

  const update = () => {
    players.value.forEach((player) => {
      // Generate resources
      player.buildings.forEach((building) => generateResources(building))
    })
  }

  return { players, player, update, addBuilding, addRoad, addField, addVines }
})
