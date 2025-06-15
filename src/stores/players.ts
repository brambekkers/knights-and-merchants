import { players as level1Players } from '@/constant/maps/map1'

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

  return { players, player, addBuilding, addRoad, addField, addVines }
})
