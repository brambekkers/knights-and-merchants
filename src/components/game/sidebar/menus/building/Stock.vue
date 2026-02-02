<script setup lang="ts">
  const { building, info } = defineProps<{
    building: PlayerBuilding
    info: BuildingInfo | null
  }>()

  const { t } = useI18n()

  const input = computed(() => {
    if (!info?.generate?.input) return []
    return Object.entries(info.generate.input)?.filter(([_, amount]) => amount && amount > 0)
  })

  const output = computed(() => {
    if (!info?.generate?.input) return []
    return Object.entries(info.generate.output)?.filter(([_, amount]) => amount && amount > 0)
  })

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
  <!-- Stock Section -->
  <section class="stock-info">
    <div
      v-if="input.length > 0"
      class="stock-section">
      <p>{{ t('ui.needs') }}</p>
      <div class="stock-grid">
        <div
          v-for="[resource] in input"
          :key="resource"
          class="stock-item">
          <span class="resource-name">{{ t(`resources.${resource}`) }}</span>
          <span class="resource-amount">
            <img
              v-for="_ in building.stock?.[resource as Resource]"
              :src="`/assets/resources/${resource}.png`" />
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="output.length > 0"
      class="stock-section">
      <p>{{ t('ui.delivers') }} <span v-if="output[0][1] > 1"></span>({{ output[0][1] }}x)</p>
      <div class="stock-grid">
        <div
          v-for="[resource] in output"
          :key="resource"
          class="stock-item">
          <span class="resource-name">{{ t(`resources.${resource}`) }}</span>
          <span class="resource-amount">
            <img
              v-for="_ in building.stock?.[resource as Resource]"
              :src="`/assets/resources/${resource}.png`" />
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .stock-info {
    color: #eaeaea;

    .stock-section {
      margin-top: 0.6rem;

      p {
        font-size: 0.85rem;
        font-weight: 500;
        margin-bottom: 0.2rem;
        width: 100%;
        text-shadow: black 0.05rem 0.05rem 0, black -0.05rem -0.05rem 0, black 0.05rem -0.05rem 0,
          black -0.05rem 0.05rem 0;

        text-align: center;
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
        align-items: center;
        padding: 0.4rem 0.5rem;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 4px;

        .resource-name {
          text-transform: capitalize;
          font-weight: 900;
          opacity: 0.8;
        }

        .resource-amount {
          height: 20px;
          display: flex;
          gap: 0.1rem;
        }
      }
    }
  }
</style>
