<script setup lang="ts">
  const { players } = storeToRefs(usePlayersStore())

  const { cellSize } = useMapStore()
  const cellSizePx = cellSize + 'px'

  const top = (y: number) => y * cellSize + 'px'
  const left = (x: number) => x * cellSize + 'px'
</script>

<template>
  <div
    id="peoples"
    v-for="(player, i) of players"
    :key="`player_${i}`">
    <div
      v-for="(char, j) of player.characters"
      :key="`character_${i}_${j}`"
      :id="char.id"
      class="people-container"
      :style="{
        top: top(char.y),
        left: left(char.x)
      }">
      <div class="pill" />
    </div>
  </div>
</template>

<style scoped>
  .people-container {
    position: absolute;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    width: v-bind(cellSizePx);
    height: v-bind(cellSizePx);

    .pill {
      width: 20px;
      height: 35px;
      background-color: rgba(221, 58, 221, 1);
      content: ' ';
      border-radius: 10px;
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
    }
  }
</style>
