<script setup lang="ts">
  defineProps<{
    type: Building
  }>()

  const { t } = useI18n()
</script>

<template>
  <header class="header">
    <h2 class="title">{{ t(`buildings.${type}`) }}</h2>
  </header>
</template>

<style scoped>
  header {
    display: flex;
    justify-content: center;
    margin-bottom: -0.5rem;
  }
</style>
