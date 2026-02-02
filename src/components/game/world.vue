<script setup lang="ts">
  const { showBuildPosition, showRoadPosition } = storeToRefs(useBuildStore())
  useMovementStore()
  const worldEl = useTemplateRef<HTMLElement>('world')
  const { x, y, arrivedState } = useScroll(worldEl, { behavior: 'smooth' })
</script>

<template>
  <div
    id="world"
    ref="world">
    <GameMovement
      v-model:x="x"
      v-model:y="y"
      :arrivedState />

    <GameGrid />
    <GameRoads />
    <GameConstructionSites />
    <GameBuildings />
    <GamePeople />
    <GameNewRoad v-if="showRoadPosition" />
    <GameNewBuilding v-if="showBuildPosition" />
  </div>
</template>

<style scoped>
  #world {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    background: #eee;
  }
</style>
