<script setup lang="ts">
  const { cellSize } = useMapStore()

  const cellSizePx = cellSize + 'px'
  const { position } = storeToRefs(useBuildStore())
  const { showGrid, showBlocking, showCoordinates } = storeToRefs(useDebugStore())
  const { map } = storeToRefs(useMapStore())

  const borderStyle = computed(() => (showGrid.value ? 'solid 1px rgba(0,0,0, 0.2)' : 'none'))

  onMounted(() => {
    document.addEventListener('mousemove', (event) => {
      const worldElement = document.querySelector('#world')
      if (worldElement) {
        const worldRect = worldElement.getBoundingClientRect()
        const worldScrollX = worldElement.scrollLeft
        const worldScrollY = worldElement.scrollTop
        const x = Math.floor((event.clientX - worldRect.left + worldScrollX) / cellSize)
        const y = Math.floor((event.clientY - worldRect.top + worldScrollY) / cellSize)

        position.value = { x, y }
      }
    })
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', () => {})
  })
</script>

<template>
  <section class="grid">
    <div
      v-for="(row, y) of map"
      :key="y"
      class="tile-row">
      <div
        v-for="(cell, x) of row"
        :key="x"
        class="tile"
        :class="{
          'block-building': showBlocking && cell.blockedBuilding,
          'block-road': showBlocking && cell.blockedRoad
        }">
        <span v-if="showCoordinates"> {{ y }},{{ x }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .grid {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 800;
    width: min-content;
    pointer-events: none;

    .tile-row {
      display: flex;
      flex-direction: row;

      .tile {
        border: v-bind(borderStyle);
        width: v-bind(cellSizePx);
        height: v-bind(cellSizePx);

        display: flex;
        align-items: center;
        justify-content: center;

        span {
          font-size: 0.8rem;
          color: #666;
        }
      }

      .block-building {
        background-color: rgba(201, 107, 0, 0.3);
      }

      .block-road {
        background-color: rgba(255, 0, 0, 0.3);
      }
    }
  }
</style>
