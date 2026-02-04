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
    id="characters"
    v-for="(player, i) of players"
    :key="`player_${i}`">
    <!-- Servant characters use animated component -->
    <GameCharactersServant
      v-for="char of player.characters.filter((c) => c.type === 'servant')"
      :key="char.id"
      :character="char"
      :is-selected="isSelected(char)"
      @click="handleClick(char)" />

    <!-- Other character types (fallback to static image for now) -->
    <div
      v-for="char of player.characters.filter((c) => c.type !== 'servant')"
      v-show="char.visible !== false"
      :key="char.id"
      :id="char.id"
      class="character-container"
      :class="{ selected: isSelected(char) }"
      :style="{
        top: top(char.y),
        left: left(char.x)
      }"
      @click="handleClick(char)">
      <img :src="`/assets/characters/${char.type}.png`" />
    </div>
  </div>
</template>

<style scoped>
  .character-container {
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
    }

    img {
      position: absolute;
      height: 2.5rem;
      inset: 0;
      margin: auto;
    }
  }
</style>
