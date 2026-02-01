<script setup lang="ts">
  const trunks = ref(1)
  const planks = ref(1)
</script>

<template>
  <div id="sawmill">
    <img
      class="full"
      src="/assets/building/sawmill/full.png" />

    <!-- Trunks -->
    <img
      class="trunk"
      :src="`/assets/building/sawmill/trunk${trunks}.png`" />

    <!-- Planks -->
    <img
      class="plank"
      :class="`plank${planks}`"
      :src="`/assets/building/sawmill/planks${planks}.png`" />
  </div>
</template>

<style scoped>
  #sawmill {
    position: relative;
    translate: 95px 60px;

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
