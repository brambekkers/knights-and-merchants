<script setup lang="ts">
  const { building, info } = defineProps<{
    building: PlayerBuilding
    info: BuildingInfo | null
  }>()

  const { t } = useI18n()

  const stockEntries = computed(() => {
    if (!building?.stock) return []
    return Object.entries(building.stock).filter(([_, amount]) => amount && amount > 0)
  })

  const maxStockEntries = computed(() => {
    if (!info?.maxStock) return []
    return Object.entries(info.maxStock)
  })
</script>

<template>
  <DevOnly>
    <section class="dev-info">
      <hr />
      <h3 class="title">DEV MODE</h3>
      <!-- Production Status -->
      <section
        class="production-section"
        v-if="info?.generate">
        <label>{{ t('ui.production') }}</label>
        <div class="production-info">
          <div
            class="production-status"
            :class="{ active: building.generating }">
            {{ building.generating ? t('ui.working') : t('ui.idle') }}
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
            <span class="resource-amount"> {{ building.stock?.[resource as Resource] ?? 0 }} / {{ max }} </span>
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
        <span>X: {{ building.x }}, Y: {{ building.y }}</span>
      </section>
    </section>
  </DevOnly>
</template>

<style scoped>
  .dev-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    color: #f5f5dc;
    font-size: 0.85rem;

    .title {
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }

    hr {
      margin-block: 0.5rem;
      border-color: black;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    }

    label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: rgb(206, 206, 204);
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

    .coords-section {
      display: flex;
      justify-content: space-between;
      span {
        font-family: monospace;
      }
    }
  }
</style>
