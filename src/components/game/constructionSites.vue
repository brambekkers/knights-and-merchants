<script setup lang="ts">
const { constructionSites } = storeToRefs(useConstructionStore())
const { cellSize } = useMapStore()

const cellSizePx = cellSize + 'px'
const top = (y: number) => y * cellSize + 'px'
const left = (x: number) => x * cellSize + 'px'

const getStatusClass = (status: string) => {
  return {
    'status-planned': status === 'planned',
    'status-waiting': status === 'waiting-builder',
    'status-progress': status === 'in-progress'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'road': return '🛤️'
    case 'field': return '🌾'
    case 'vines': return '🍇'
    case 'building': return '🏗️'
    default: return '⚒️'
  }
}
</script>

<template>
  <div id="construction-sites">
    <div
      v-for="site in constructionSites"
      :key="site.id"
      class="construction-marker"
      :class="[`type-${site.type}`, getStatusClass(site.status)]"
      :style="{
        top: top(site.y),
        left: left(site.x),
        width: cellSizePx,
        height: cellSizePx
      }">
      <div class="marker-content">
        <span class="type-icon">{{ getTypeIcon(site.type) }}</span>
        <div
          v-if="site.status === 'in-progress'"
          class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${site.progress}%` }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#construction-sites {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10;
}

.construction-marker {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
  background: rgba(255, 255, 200, 0.4);
}

.construction-marker.status-planned {
  border-color: rgba(100, 100, 100, 0.6);
  background: rgba(200, 200, 200, 0.3);
}

.construction-marker.status-waiting {
  border-color: rgba(255, 165, 0, 0.8);
  background: rgba(255, 200, 100, 0.4);
  animation: pulse 1.5s ease-in-out infinite;
}

.construction-marker.status-progress {
  border-color: rgba(0, 150, 0, 0.8);
  background: rgba(100, 255, 100, 0.3);
}

.construction-marker.type-building {
  /* Buildings are rendered separately, just show small indicator */
  background: transparent;
  border: none;
}

.marker-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.type-icon {
  font-size: 12px;
  text-shadow: 0 0 2px white;
}

.type-building .type-icon {
  display: none;
}

.progress-bar {
  width: 80%;
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s ease;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>
