<script setup lang="ts">
  import { operatorMap } from '@/constant/characterInfo'

  const { t } = useI18n()
  const sidebarStore = useSidebarStore()
  const { selectedCharacter } = storeToRefs(sidebarStore)
  const { player } = storeToRefs(usePlayersStore())

  // Get the building this character operates (if any)
  const operatedBuilding = computed(() => {
    if (!player.value || !selectedCharacter.value) return null
    return player.value.buildings.find((b) => b.operator === selectedCharacter.value?.id) || null
  })

  // Check if character type can operate buildings
  const canOperate = computed(() => {
    if (!selectedCharacter.value) return false
    return Object.values(operatorMap).includes(selectedCharacter.value.type)
  })

  // Get buildings that need this character type as operator
  const availableWorkplaces = computed(() => {
    if (!player.value || !selectedCharacter.value) return []
    const charType = selectedCharacter.value.type

    return player.value.buildings.filter((b) => {
      const neededOperator = operatorMap[b.type]
      return neededOperator === charType && !b.operator
    })
  })
</script>

<template>
  <div
    class="character-info"
    v-if="selectedCharacter"
    :key="selectedCharacter.id">
    <section>
      <GameSidebarMenusCharacterTitle :type="selectedCharacter.type" />
      <GameSidebarMenusCharacterStats :character="selectedCharacter" />
    </section>

    <!-- Carrying Section -->
    <section
      class="carrying-section"
      v-if="selectedCharacter.carrying">
      <label>{{ t('ui.carrying') }}</label>
      <div class="carrying-item">
        <span class="resource-name">{{ t(`resources.${selectedCharacter.carrying.resource}`) }}</span>
        <span class="resource-amount">x{{ selectedCharacter.carrying.amount }}</span>
      </div>
    </section>

    <!-- Workplace Section -->
    <section
      class="workplace-section"
      v-if="canOperate">
      <label>{{ t('ui.workplace') }}</label>
      <div
        v-if="operatedBuilding"
        class="workplace-info">
        <span>{{ t(`buildings.${operatedBuilding.type}`) }}</span>
        <span class="coords">({{ operatedBuilding.x }}, {{ operatedBuilding.y }})</span>
      </div>
      <div
        v-else-if="availableWorkplaces.length > 0"
        class="no-workplace">
        {{ t('ui.unassigned') }} ({{ availableWorkplaces.length }} {{ t('ui.available') }})
      </div>
      <div
        v-else
        class="no-workplace">
        {{ t('ui.noWorkplace') }}
      </div>
    </section>

    <!-- Location -->
    <section class="coords-section">
      <label>{{ t('ui.location') }}</label>
      <span>X: {{ selectedCharacter.x }}, Y: {{ selectedCharacter.y }}</span>
    </section>

    <!-- ID (debug) -->
    <section class="id-section">
      <label>ID</label>
      <span class="id-text">{{ selectedCharacter.id }}</span>
    </section>
  </div>
</template>

<style scoped>
  .character-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    color: #f5f5dc;
    font-size: 0.85rem;
  }

  /* Sections below header */
  section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #998;
  }

  .carrying-section .carrying-item {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0.5rem;
    background: rgba(74, 222, 128, 0.2);
    border: 1px solid rgba(74, 222, 128, 0.4);
    border-radius: 4px;
  }

  .resource-name {
    text-transform: capitalize;
  }

  .resource-amount {
    color: #4ade80;
    font-weight: bold;
  }

  .workplace-section .workplace-info {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  .workplace-info .coords {
    color: #888;
    font-family: monospace;
    font-size: 0.75rem;
  }

  .no-workplace {
    font-style: italic;
    padding: 0.25rem 0;
    color: #888;
  }

  .coords-section span {
    font-family: monospace;
  }

  .id-section .id-text {
    font-family: monospace;
    font-size: 0.7rem;
    color: #666;
  }
</style>
