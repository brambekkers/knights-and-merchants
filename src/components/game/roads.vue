<script setup lang="ts">
  const { players } = storeToRefs(usePlayersStore())

  const { cellSize } = useMapStore()
  const { map } = storeToRefs(useMapStore())

  const cellSizePx = cellSize + 'px'
  const top = (y: number) => y * cellSize + 'px'
  const left = (x: number) => x * cellSize + 'px'

  const getNeighboringRoads = ({ y, x }: Vector2D) => {
    const neighbors = {
      top: false,
      right: false,
      bottom: false,
      left: false
    }

    if (map.value[y - 1]?.[x]?.isRoad) neighbors.top = true
    if (map.value[y][x + 1]?.isRoad) neighbors.right = true
    if (map.value[y + 1]?.[x]?.isRoad) neighbors.bottom = true
    if (map.value[y][x - 1]?.isRoad) neighbors.left = true

    return neighbors
  }

  const getRoadType = ({ y, x }: Vector2D) => {
    const neighbors = getNeighboringRoads({ y, x })

    if (neighbors.top && neighbors.right && !neighbors.bottom && !neighbors.left) return 'top-right'
    if (neighbors.right && neighbors.bottom && !neighbors.top && !neighbors.left) return 'bottom-right'
    if (neighbors.bottom && neighbors.left && !neighbors.top && !neighbors.right) return 'bottom-left'
    if (neighbors.left && neighbors.top && !neighbors.bottom && !neighbors.right) return 'top-left'
    if (neighbors.top && neighbors.right && !neighbors.bottom && neighbors.left) return 'top-right-left'
    if (!neighbors.top && neighbors.right && neighbors.bottom && neighbors.left) return 'bottom-right-left'
    if (neighbors.top && neighbors.right && neighbors.bottom && !neighbors.left) return 'top-bottom-right'
    if (neighbors.top && !neighbors.right && neighbors.bottom && neighbors.left) return 'top-bottom-left'
    if ((neighbors.top || neighbors.bottom) && !neighbors.left && !neighbors.right) return 'vertical'
    if ((neighbors.left || neighbors.right) && !neighbors.top && !neighbors.bottom) return 'horizontal'

    if (neighbors.top && neighbors.left && neighbors.bottom && neighbors.right) return 'cross'

    return 'horizontal'
  }
</script>

<template>
  <div
    v-for="(player, i) of players"
    id="roads"
    :key="`player_${i}`">
    <div
      v-for="(road, j) of player.roads"
      :key="`road${i}_${j}`"
      class="road"
      :style="{
        top: top(road.y),
        left: left(road.x),
        width: cellSizePx,
        height: cellSizePx
      }">
      <img
        v-if="getRoadType(road) === 'horizontal'"
        src="`@/assets/road/1.png`" />
      <img
        v-else-if="getRoadType(road) === 'vertical'"
        src="`@/assets/road/2.png`" />
      <img
        v-else-if="getRoadType(road) === 'top-right'"
        src="`@/assets/road/3.png`" />
      <img
        v-else-if="getRoadType(road) === 'top-left'"
        src="`@/assets/road/4.png`" />
      <img
        v-else-if="getRoadType(road) === 'bottom-left'"
        src="`@/assets/road/5.png`" />
      <img
        v-else-if="getRoadType(road) === 'bottom-right'"
        src="`@/assets/road/6.png`" />
      <img
        v-else-if="getRoadType(road) === 'bottom-right-left'"
        src="`@/assets/road/7.png`" />
      <img
        v-else-if="getRoadType(road) === 'top-right-left'"
        src="`@/assets/road/8.png`" />
      <img
        v-else-if="getRoadType(road) === 'top-bottom-right'"
        src="`@/assets/road/10.png`" />
      <img
        v-else-if="getRoadType(road) === 'top-bottom-left'"
        src="`@/assets/road/11.png`" />
      <img
        v-else-if="getRoadType(road) === 'cross'"
        src="`@/assets/road/9.png`" />
      <div v-else>{{ getRoadType(road) }}</div>
    </div>
  </div>
</template>

<style scoped>
  .road {
    position: absolute;
    width: v-bind(cellSizePx);
    height: v-bind(cellSizePx);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
