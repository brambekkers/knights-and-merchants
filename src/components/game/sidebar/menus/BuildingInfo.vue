<script setup lang="ts">
  import { buildingInfo } from '@/constant/buildingInfo'

  const { t } = useI18n()
  const sidebarStore = useSidebarStore()
  const { deselectBuilding } = sidebarStore
  const { selectedBuilding } = storeToRefs(sidebarStore)
  const { player } = storeToRefs(usePlayersStore())

  const info = computed(() => (selectedBuilding.value ? buildingInfo[selectedBuilding.value.type] : null))

  const healthPercent = computed(() => {
    if (!selectedBuilding.value || !info.value) return 100
    const currentHealth = selectedBuilding.value.health ?? info.value.health
    return Math.round((currentHealth / info.value.health) * 100)
  })

  const healthColor = computed(() => {
    if (healthPercent.value > 66) return '#4ade80'
    if (healthPercent.value > 33) return '#facc15'
    return '#f87171'
  })

  const operator = computed(() => {
    if (!player.value || !selectedBuilding.value?.operator) return null
    return player.value.characters.find((c) => c.id === selectedBuilding.value?.operator)
  })

  const stockEntries = computed(() => {
    if (!selectedBuilding.value?.stock) return []
    return Object.entries(selectedBuilding.value.stock).filter(([_, amount]) => amount && amount > 0)
  })

  const maxStockEntries = computed(() => {
    if (!info.value?.maxStock) return []
    return Object.entries(info.value.maxStock)
  })
</script>

<template>
  <div
    class="building-info"
    v-if="selectedBuilding"
    :key="selectedBuilding.id">
    <h2 class="title">{{ t(`buildings.${selectedBuilding.type}`) }}</h2>

    <section class="health-section">
      <label>{{ t('ui.health') }}</label>
      <div class="health-bar">
        <div
          class="health-fill"
          :style="{ width: `${healthPercent}%`, backgroundColor: healthColor }"></div>
      </div>
      <span class="health-text"> {{ selectedBuilding.health ?? info?.health }} / {{ info?.health }} </span>
    </section>

    <section class="operator-section">
      <label>{{ t('ui.operator') }}</label>
      <div
        class="operator-status"
        :class="{ active: operator }">
        <span v-if="operator">{{ operator.type }}</span>
        <span
          v-else
          class="no-operator"
          >{{ t('ui.noOperator') }}</span
        >
      </div>
    </section>

    <section
      class="production-section"
      v-if="info?.generate">
      <label>{{ t('ui.production') }}</label>
      <div class="production-info">
        <div
          class="production-status"
          :class="{ active: selectedBuilding.generating }">
          {{ selectedBuilding.generating ? t('ui.working') : t('ui.idle') }}
        </div>
        <div class="production-rate">{{ (60000 / info.generate.duration).toFixed(2) }}{{ t('ui.perMin') }}</div>
      </div>
    </section>

    <section class="stock-section">
      <label>{{ t('ui.stock') }}</label>
      <div
        class="stock-grid"
        v-if="maxStockEntries.length > 0">
        <div
          v-for="[resource, max] in maxStockEntries"
          :key="resource"
          class="stock-item">
          <span class="resource-name">{{ t(`resources.${resource}`) }}</span>
          <span class="resource-amount"> {{ selectedBuilding.stock?.[resource as Resource] ?? 0 }} / {{ max }} </span>
        </div>
      </div>
      <div
        v-else
        class="no-stock">
        {{ t('ui.noStorageCapacity') }}
      </div>
    </section>

    <section class="coords-section">
      <label>{{ t('ui.location') }}</label>
      <span>X: {{ selectedBuilding.x }}, Y: {{ selectedBuilding.y }}</span>
    </section>
  </div>
</template>

<style scoped>
  .building-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    color: #f5f5dc;
    font-size: 0.85rem;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  label {
    font-size: 0.7rem;
    text-transform: uppercase;

    letter-spacing: 0.05em;
  }

  .health-section .health-bar {
    height: 8px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    overflow: hidden;
  }

  .health-section .health-fill {
    height: 100%;
    transition: width 0.3s, background-color 0.3s;
  }

  .health-section .health-text {
    font-size: 0.75rem;
  }

  .operator-status {
    padding: 0.25rem 0.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    text-transform: capitalize;
  }

  .operator-status.active {
    background: rgba(74, 222, 128, 0.2);
    border: 1px solid rgba(74, 222, 128, 0.4);
  }

  .no-operator {
    font-style: italic;
  }

  .production-section .production-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .production-status {
    padding: 0.25rem 0.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    font-size: 0.75rem;
  }

  .production-status.active {
    background: rgba(250, 204, 21, 0.2);
    border: 1px solid rgba(250, 204, 21, 0.4);
    color: #facc15;
  }

  .production-rate {
    font-size: 0.75rem;
  }

  .stock-grid {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    max-height: 150px;
    overflow-y: auto;
  }

  .stock-item {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  .resource-name {
    text-transform: capitalize;
  }

  .resource-amount {
  }

  .no-stock {
    font-style: italic;
    padding: 0.25rem 0;
  }

  .coords-section span {
    font-family: monospace;
  }
</style>
