<script setup lang="ts">
  import { operatorMap } from '@/constant/characterInfo'

  const { building, info } = defineProps<{
    building: PlayerBuilding
    info: BuildingInfo | null
  }>()

  const { player } = storeToRefs(usePlayersStore())

  // Toggle states for building controls
  const deliveryEnabled = ref(true)
  const repairEnabled = ref(false)

  const operator = computed(() => {
    if (!player.value || !building?.operator) return null
    return player.value.characters.find((c) => c.id === building?.operator)
  })

  const operatorType = computed((): CharactersType | null => {
    if (!building?.type) return null
    const type = building.type
    return operatorMap[type] || null
  })

  const hasOperator = computed(() => !!operator.value)

  const healthPercent = computed(() => {
    if (!building || !info) return 100
    const currentHealth = building.health ?? info.health
    return Math.round((currentHealth / info.health) * 100)
  })

  const healthColor = computed(() => {
    if (healthPercent.value > 66) return '#4ade80'
    if (healthPercent.value > 33) return '#facc15'
    return '#f87171'
  })
</script>

<template>
  <div class="building-stats">
    <!-- Delivery Toggle Button -->
    <button
      :class="{ active: deliveryEnabled }"
      @click="deliveryEnabled = !deliveryEnabled"
      :title="deliveryEnabled ? 'Disable delivery' : 'Enable delivery'">
      <img
        v-if="deliveryEnabled"
        src="@/assets/ui/buttons/open.png" />
      <img
        v-else
        src="@/assets/ui/buttons/close.png" />
    </button>

    <!-- Repair Toggle Button -->
    <button
      :class="{ active: repairEnabled }"
      @click="repairEnabled = !repairEnabled"
      :title="repairEnabled ? 'Disable repair' : 'Enable repair'">
      <img
        v-if="repairEnabled"
        src="@/assets/ui/buttons/repair.png" />
      <img
        v-else
        src="@/assets/ui/buttons/noRepair.png" />
    </button>

    <!-- Building Icon -->
    <div class="building-icon">
      <img
        :src="`/assets/building/icons/${building.type}.gif`"
        :alt="building.type" />
    </div>

    <img
      v-if="operatorType"
      class="operator"
      :class="{ 'has-operator': hasOperator }"
      :src="`/assets/characters/${operatorType}.png`"
      :alt="operatorType" />

    <!-- Health Bar with Text -->
    <div class="health-container">
      <h4 class="health-title">Condition</h4>
      <div class="health-bar">
        <div
          class="health-fill"
          :style="{ width: `${healthPercent}%`, backgroundColor: healthColor }" />
        <span class="health-text">{{ building.health ?? info?.health }}/{{ info?.health }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .building-stats {
    display: flex;
    align-items: center;
    gap: 6px;

    button {
      width: 15%;
      aspect-ratio: 1;
      cursor: pointer;
      background-color: #a4a489;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 80%;
      }
      &:hover {
        color: #aaa;
      }
    }

    .operator {
      height: 1.7rem;
      opacity: 0.5;
      transition: all 0.15s ease;

      &.has-operator {
        opacity: 1;
        color: #c9a227;
        border-color: #6a5a3a;
      }
    }

    .building-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      img {
        height: 1.7rem;
        object-fit: contain;
      }
    }

    .health-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      height: 2rem;
      min-width: 60px;
      max-width: 30%;
      margin-left: auto;

      .health-title {
        font-size: 0.7rem;
        text-align: center;
        color: #eef15c;
        text-shadow: 1px 1px 0 #000;
      }

      .health-bar {
        position: relative;
        flex-grow: 1;
        background: #1a1510;
        border: 1px solid #0a0805;
        border-radius: 2px;
        overflow: hidden;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);

        .health-fill {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.2);
        }

        .health-text {
          position: absolute;
          inset: 0;
          margin: 0;
          font-size: 0.65rem;
          text-align: center;
          color: #aaa;
          text-shadow: 1px 1px 0 #000;
        }
      }
    }
  }
</style>
