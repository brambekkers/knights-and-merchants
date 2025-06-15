<script setup lang="ts">
  const { menu } = storeToRefs(useSidebarStore())
</script>

<template>
  <div id="actions">
    <div id="main-actions">
      <button>
        <img
          src="@/assets/ui/buttons/build.png"
          @click="menu = 'build'" />
      </button>
      <button>
        <img
          src="@/assets/ui/buttons/ratios.png"
          @click="menu = 'ratios'" />
      </button>
      <button>
        <img
          src="@/assets/ui/buttons/stats.png"
          @click="menu = 'stats'" />
      </button>
      <button>
        <img
          src="@/assets/ui/buttons/menu.png"
          @click="menu = 'menu'" />
      </button>
    </div>
    <section
      class="menu"
      v-if="menu">
      <GameSidebarMenusBuild v-if="menu === 'build'" />
    </section>
  </div>
</template>

<style scoped>
  #actions {
    background-image: url('@/assets/ui/sidebarBg1.png');
    background-repeat: repeat-y;
    background-size: 100%;
    flex-grow: 1;

    display: flex;
    flex-direction: column;

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
