<script setup lang="ts">
  const { cellSize } = useMapStore()
  const { position, building } = storeToRefs(useBuildStore())
  const { map } = storeToRefs(useMapStore())

  const cellSizePx = cellSize + 'px'

  const top = computed(() => (position.value?.y || 0) * cellSize + 'px')
  const left = computed(() => (position.value?.x || 0) * cellSize + 'px')

  const isBlocked = ({ y, x }: { x: number; y: number }) => map.value[y]?.[x]?.blockedRoad
</script>

<template>
  <div
    v-if="position"
    class="tile"
    @click="useBuildStore().addRoad()">
    <img
      v-if="isBlocked(position)"
      class="blocked"
      src="@/assets/icons/remove.png" />
    <img
      v-else
      src="@/assets/icons/highlightTile.png" />
  </div>
</template>

<style scoped>
  .tile {
    z-index: 900;

    position: absolute;
    top: v-bind(top);
    left: v-bind(left);
    width: v-bind(cellSizePx);
    height: v-bind(cellSizePx);

    display: flex;
    align-items: center;
    justify-content: center;

    .blocked {
      width: 60%;
      object-fit: cover;
    }

    img {
      width: 100%;
      object-fit: cover;
    }
  }
</style>
