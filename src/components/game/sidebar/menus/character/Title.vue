<script setup lang="ts">
  defineProps<{
    type: CharactersType
  }>()

  const { t } = useI18n()
</script>

<template>
  <header class="header">
    <h2 class="title">{{ t(`characters.${type}`) }}</h2>
  </header>
</template>

<style scoped>
  header {
    display: flex;
    justify-content: center;
    margin-bottom: -1rem;
  }
</style>
