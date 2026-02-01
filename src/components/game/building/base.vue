<script setup lang="ts">
  import { buildingInfo } from '@/constant/buildingInfo'
  const { cellSize } = useMapStore()

  const { type, x, y, construction } = defineProps<{
    type: Building
    x: number
    y: number
    construction?: number
    stock?: Stock
  }>()

  const emit = defineEmits<{
    click: []
  }>()

  const buildingWidth = computed(() => buildingInfo[type].pattern[0].length * cellSize + 'px')
  const buildingHeight = computed(() => buildingInfo[type].pattern.length * cellSize + 'px')
  const buildingTop = computed(() => y * cellSize + 'px')
  const buildingLeft = computed(() => x * cellSize + 'px')
</script>

<template>
  <div
    class="image-container"
    @click="emit('click')">
    <GameBuildingSchool v-if="type === 'school'" />
    <GameBuildingInn v-if="type === 'inn'" />
    <GameBuildingQuarry v-if="type === 'quarry'" />
    <GameBuildingWoodcutter v-if="type === 'woodcutter'" />
    <GameBuildingSawmill
      v-if="type === 'sawmill'"
      :construction
      :stock />
    <GameBuildingFarm v-if="type === 'farm'" />
    <GameBuildingMill v-if="type === 'mill'" />
    <GameBuildingBakery v-if="type === 'bakery'" />
    <GameBuildingSwinefarm v-if="type === 'swinefarm'" />
    <GameBuildingButcher v-if="type === 'butcher'" />
    <GameBuildingFisherman v-if="type === 'fisherman'" />
    <GameBuildingVineyard v-if="type === 'vineyard'" />
    <GameBuildingGoldmine v-if="type === 'goldmine'" />
    <GameBuildingCoalmine v-if="type === 'coalmine'" />
    <GameBuildingMetallurgist v-if="type === 'metallurgist'" />
    <GameBuildingWeaponWorkshop v-if="type === 'weaponworkshop'" />
    <GameBuildingTannery v-if="type === 'tannery'" />
    <GameBuildingArmoryWorkshop v-if="type === 'armoryworkshop'" />
    <GameBuildingStables v-if="type === 'stables'" />
    <GameBuildingIronmine v-if="type === 'ironmine'" />
    <GameBuildingIronsmithy v-if="type === 'ironsmithy'" />
    <GameBuildingWeaponsmithy v-if="type === 'weaponsmithy'" />
    <GameBuildingArmorsmithy v-if="type === 'armorsmithy'" />
    <GameBuildingBarracks v-if="type === 'barracks'" />
    <GameBuildingTownhall v-if="type === 'townhall'" />
    <GameBuildingStorehouse v-if="type === 'storehouse'" />
    <GameBuildingWatchtower v-if="type === 'watchtower'" />
    <GameBuildingSiegeWorkshop v-if="type === 'siegeworkshop'" />
    <GameBuildingMarketplace v-if="type === 'marketplace'" />
  </div>
</template>

<style scoped>
  .image-container {
    position: absolute;
    z-index: 100;
    left: v-bind(buildingLeft);
    top: v-bind(buildingTop);
    width: v-bind(buildingWidth);
    height: v-bind(buildingHeight);
    cursor: pointer;
    transition: filter 0.15s ease;

    img {
      scale: 1.1;
    }

    &:hover {
      filter: brightness(1.2);
    }
  }
</style>
