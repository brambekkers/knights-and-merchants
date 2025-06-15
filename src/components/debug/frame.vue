<script setup lang="ts">
  const { position } = storeToRefs(useBuildStore())
  const { players } = storeToRefs(usePlayersStore())
  const { showMovementArea, showGrid, showBlocking, showCoordinates } = storeToRefs(useDebugStore())
  const { movementSpeed } = storeToRefs(useMovementStore())
  const hideFrame = ref(false)

  const options = ref([
    { key: 'showGrid', label: 'Show grid', value: showGrid },
    { key: 'showBlocking', label: 'Show blocking layer', value: showBlocking },
    { key: 'showMovementArea', label: 'Show movement area', value: showMovementArea },
    { key: 'showCoordinates', label: 'Show coordinates', value: showCoordinates }
  ])

  const printPlayer = () => {
    console.log('Player:', usePlayersStore().players)
  }

  const addServant = () => {
    const characters = players.value[0].characters
    characters.push({
      id: `character-${characters.length}`,
      type: 'servant',
      x: 4,
      y: 3,
      state: 'idle'
    })
  }
</script>

<template>
  <div
    v-if="!hideFrame"
    class="frame">
    <div class="frame-header">
      <h2>Debug</h2>
      <button
        class="frame-close"
        @click="hideFrame = !hideFrame">
        x
      </button>
    </div>
    <div class="frame-content">
      <div
        class="grid-position"
        v-if="position">
        y: {{ position.y }}, x: {{ position?.x }}
      </div>

      <!-- grid -->
      <div
        class="option"
        v-for="option in options"
        :key="option.key">
        <h4>{{ option?.label }}</h4>
        <input
          type="checkbox"
          v-model="option.value" />
      </div>
      <hr />
      <div class="slider">
        <h4>Movement speed</h4>

        <input
          type="range"
          v-model.number="movementSpeed"
          min="0"
          max="5"
          step="1" />
      </div>

      <button @click="addServant">Add servant</button>
      <button @click="printPlayer">Print players</button>
    </div>
  </div>
</template>

<style scoped>
  .frame {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 1000;

    border: solid 1px #ccc;
    padding: 10px;
    background-color: #f9f9f9;

    .frame-header {
      margin-bottom: 10px;
      position: relative;

      .frame-close {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 1.2rem;
      }
    }

    .frame-content {
      display: flex;
      flex-direction: column;

      button {
        margin-top: 10px;
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #0056b3;
        }
      }
      .grid-position {
        margin-bottom: 10px;
        font-size: 0.9rem;
        color: #555;
        font-weight: 600;
        text-align: center;
        background-color: #ccc;
        padding: 0.5rem 0;
      }
      .option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.3rem;
        gap: 1rem;
      }

      .slider {
        display: flex;
        flex-direction: column;
        margin-bottom: 0.5rem;

        input[type='range'] {
          width: 100%;
        }
      }

      hr {
        margin: 0.5rem 0;
        border: none;
        border-top: 1px solid #ccc;
      }

      h4 {
        margin-bottom: 5px;
        font-weight: 600;
        font-size: small;
      }
    }
  }
</style>
