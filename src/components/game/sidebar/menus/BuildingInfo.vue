<script setup lang="ts">
  import { buildingInfo } from '@/constant/buildingInfo'

  const sidebarStore = useSidebarStore()
  const { selectedBuilding } = storeToRefs(sidebarStore)

  const info = computed(() => (selectedBuilding.value ? buildingInfo[selectedBuilding.value.type] : null))
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
      <GameSidebarMenusBuildingStock
        :building="selectedBuilding"
        :info="info" />
    </section>

    <GameSidebarMenusBuildingSchool v-if="selectedBuilding.type === 'school'" />

    <GameSidebarMenusBuildingDev
      :building="selectedBuilding"
      :info="info" />
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
