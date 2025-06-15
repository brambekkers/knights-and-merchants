<script setup lang="ts">
  const { players } = storeToRefs(usePlayersStore())
</script>

<template>
  <div
    v-for="(player, i) of players"
    :key="`player_${i}`">
    <div
      v-for="(building, j) of player.buildings"
      :key="`building_${i}_${j}`">
      <GameBuildingBase
        :type="building.type"
        :x="building.x"
        :y="building.y" />
    </div>
  </div>
</template>
