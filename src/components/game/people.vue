<script setup lang="ts">
  const { players } = storeToRefs(usePlayersStore())
  const { selectedCharacter } = storeToRefs(useSidebarStore())
  const { selectCharacter } = useSidebarStore()

  const { cellSize } = useMapStore()
  const cellSizePx = cellSize + 'px'

  const top = (y: number) => y * cellSize + 'px'
  const left = (x: number) => x * cellSize + 'px'

  const isSelected = (char: Character) => selectedCharacter.value?.id === char.id

  const handleClick = (char: Character) => {
    if (isSelected(char)) {
      selectCharacter(null)
    } else {
      selectCharacter(char)
    }
  }
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
      :class="{ selected: isSelected(char) }"
      :style="{
        top: top(char.y),
        left: left(char.x)
      }"
      @click="handleClick(char)">
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
    cursor: pointer;
    transition: transform 0.1s ease;

    &:hover {
      transform: scale(1.1);
    }

    &.selected {
      transform: scale(1.15);

      .pill {
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 8px 2px rgba(255, 255, 0, 0.8);
      }
    }

    .pill {
      width: 20px;
      height: 35px;
      background-color: rgba(221, 58, 221, 1);
      content: ' ';
      border-radius: 10px;
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
      transition: box-shadow 0.2s ease;
    }
  }
</style>
