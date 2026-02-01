<script setup lang="ts">
  const { construction, stock } = defineProps<{
    construction?: number // 0-100, undefined means complete
    stock?: Stock
  }>()

  const trunks = computed(() => stock?.trunk)
  const planks = computed(() => stock?.wood)

  const isComplete = computed(() => construction === undefined || construction >= 100)
</script>

<template>
  <div id="sawmill">
    <!-- Construction phase -->
    <GameBuildingConstructionRenderer
      v-if="!isComplete"
      class="construction"
      building-type="sawmill"
      :progress="construction ?? 0" />

    <!-- Completed building -->
    <template v-else>
      <img
        class="full"
        src="/assets/building/sawmill/full.png" />

      <!-- Trunks -->
      <img
        v-if="trunks"
        class="trunk"
        :src="`/assets/building/sawmill/trunk${trunks}.png`" />

      <!-- Planks -->
      <img
        v-if="planks"
        class="plank"
        :class="`plank${planks}`"
        :src="`/assets/building/sawmill/planks${planks}.png`" />
    </template>
  </div>
</template>

<style scoped>
  #sawmill {
    position: relative;
    translate: 95px 60px;

    .construction {
      position: absolute;
      left: -72px;
      top: -64px;
    }

    .full {
      position: absolute;
      left: -72px;
      top: -64px;
    }

    .trunk {
      position: absolute;
      left: -62px;
      top: -12px;
    }

    .plank {
      position: absolute;

      &.plank1 {
        left: -20px;
        top: -16px;
      }

      &.plank2 {
        left: -34px;
        top: -21px;
      }

      &.plank3,
      &.plank4,
      &.plank5 {
        left: -38px;
        top: -24px;
      }
    }
  }
</style>
