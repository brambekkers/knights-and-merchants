<script setup lang="ts">
  const { cellSize } = useMapStore()
  const { middlePosition, building } = storeToRefs(useBuildStore())
  const { map } = storeToRefs(useMapStore())

  const cellSizePx = cellSize + 'px'

  const top = computed(() => (middlePosition.value?.y || 0) * cellSize + 'px')
  const left = computed(() => (middlePosition.value?.x || 0) * cellSize + 'px')

  const isBlocked = ({ y, x }: { x: number; y: number }) => map.value[y]?.[x]?.blockedBuilding
</script>

<template>
  <div
    v-if="middlePosition"
    class="newBuilding"
    @click="useBuildStore().addBuilding()">
    <div
      v-for="(row, y) of building.pattern"
      :key="y"
      class="tile-row">
      <div
        v-for="(state, x) of row"
        :key="`newBuilding_${y}_${x}`"
        class="tile"
        :class="{
          blocked: state === 0,
          border: state !== 0 && !isBlocked({ y: middlePosition.y + y, x: middlePosition.x + x }),
          'border-blocked': state !== 0 && isBlocked({ y: middlePosition.y + y, x: middlePosition.x + x })
        }">
        <img
          v-if="state === 1 && isBlocked({ y: middlePosition.y + y, x: middlePosition.x + x })"
          src="/assets/ui/remove.png" />
        <img
          v-if="state === 2 && !isBlocked({ y: middlePosition.y + y, x: middlePosition.x + x })"
          src="@/assets/icons/entranceTile.png" />
        <img
          v-if="state === 2 && isBlocked({ y: middlePosition.y + y, x: middlePosition.x + x })"
          src="@/assets/icons/entranceBlocked.png" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .newBuilding {
    position: absolute;
    z-index: 900;
    top: v-bind(top);
    left: v-bind(left);

    .tile-row {
      display: flex;
      flex-direction: row;

      .tile {
        width: v-bind(cellSizePx);
        height: v-bind(cellSizePx);

        display: flex;
        align-items: center;
        justify-content: center;

        &.border {
          border: solid 2px #96f3e1;
        }

        img {
          width: 60%;
          object-fit: cover;
        }
      }
    }
  }
</style>
