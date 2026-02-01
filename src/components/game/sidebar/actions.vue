<script setup lang="ts">
  const { menu, selectedBuilding, selectedCharacter } = storeToRefs(useSidebarStore())
  const { deselectBuilding, deselectCharacter } = useSidebarStore()

  const switchMenu = (newMenu: 'build' | 'stats' | 'ratios' | 'menu') => {
    if (selectedBuilding.value) {
      deselectBuilding()
    }
    if (selectedCharacter.value) {
      deselectCharacter()
    }
    menu.value = newMenu
  }
</script>

<template>
  <div id="actions">
    <div id="main-actions">
      <button>
        <img
          src="@/assets/ui/buttons/build.png"
          @click="switchMenu('build')" />
      </button>
      <button>
        <img
          src="@/assets/ui/buttons/ratios.png"
          @click="switchMenu('ratios')" />
      </button>
      <button>
        <img
          src="@/assets/ui/buttons/stats.png"
          @click="switchMenu('stats')" />
      </button>
      <button>
        <img
          src="@/assets/ui/buttons/menu.png"
          @click="switchMenu('menu')" />
      </button>
    </div>
    <section
      class="menu"
      v-if="menu">
      <GameSidebarMenusBuild v-if="menu === 'build'" />
      <GameSidebarMenusBuildingInfo v-if="menu === 'building'" />
      <GameSidebarMenusCharacterInfo v-if="menu === 'character'" />
    </section>
  </div>
</template>

<style scoped>
  #actions {
    background-image: url('@/assets/ui/sidebarBg2.png');
    background-repeat: repeat-y;
    background-size: 100%;
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    padding-right: 13%;

    #main-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.8rem;

      button {
        width: 100%;
        img {
          width: 100%;
          height: 100%;
          transition: filter 0.1s ease;
        }
      }

      button:hover {
        img {
          filter: brightness(0.6);
        }
      }
    }

    .menu {
      flex-grow: 1;
      padding: 0.8rem;
    }
  }
</style>
