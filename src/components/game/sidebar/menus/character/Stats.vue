<script setup lang="ts">
  const { character } = defineProps<{
    character: Character
  }>()

  const { t } = useI18n()

  // State color
  const stateColor = computed(() => {
    if (!character) return '#888'
    return character.state === 'idle' ? '#4ade80' : '#facc15'
  })
</script>

<template>
  <div class="character-stats">
    <img
      class="operator"
      :src="`/assets/characters/${character.type}.png`"
      :alt="character.type" />

    <!-- State Indicator -->
    <div class="state-container">
      <span class="state-text">{{ character.state === 'idle' ? t('ui.idle') : t('ui.busy') }}</span>
      <div
        class="state-indicator"
        :style="{ backgroundColor: stateColor }" />
    </div>
  </div>
</template>

<style scoped>
  .character-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 6px 8px;

    .operator {
      height: 1.7rem;
      transition: all 0.15s ease;
    }

    .state-container {
      display: flex;
      align-items: center;
      gap: 8px;

      .state-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        box-shadow: 0 0 4px currentColor;
      }

      .state-text {
        font-size: 0.85rem;
        text-transform: capitalize;
        color: #ddd;
      }
    }
  }
</style>
