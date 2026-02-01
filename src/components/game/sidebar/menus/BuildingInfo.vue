<script setup lang="ts">
  import { buildingInfo } from '@/constant/buildingInfo'

  const { t } = useI18n()
  const sidebarStore = useSidebarStore()
  const { selectedBuilding } = storeToRefs(sidebarStore)

  const info = computed(() => (selectedBuilding.value ? buildingInfo[selectedBuilding.value.type] : null))

  const stockEntries = computed(() => {
    if (!selectedBuilding.value?.stock) return []
    return Object.entries(selectedBuilding.value.stock).filter(([_, amount]) => amount && amount > 0)
  })

  const maxStockEntries = computed(() => {
    if (!info.value?.maxStock) return []
    return Object.entries(info.value.maxStock)
  })

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
</script>

<template>
  <div
    class="building-info"
    v-if="selectedBuilding"
    :key="selectedBuilding.id">
    <section>
      <GameSidebarMenusBuildingTitle :type="selectedBuilding.type" />
      <GameSidebarMenusBuildingStats
        :building="selectedBuilding"
        :info="info" />
    </section>

    <!-- Production Status -->
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

    <!-- Stock Section -->
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

    <!-- Location -->
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

  .no-stock {
    font-style: italic;
    padding: 0.25rem 0;
    color: #888;
  }

  .coords-section span {
    font-family: monospace;
  }
</style>
