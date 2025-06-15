<script setup lang="ts"></script>

<template>
  <div id="sidebar-container">
    <div id="left">
      <GameSidebarMinimap />
      <GameSidebarLogo />
      <GameSidebarActions />
    </div>
    <div id="right" />
  </div>
</template>

<style scoped>
  #sidebar-container {
    min-width: 300px;
    height: 100vh;
    background-color: #8b7d5a;

    display: flex;

    #right {
      width: 2rem;
      background-color: grey;
      background-image: url('@/assets/ui/side.png');
      background-repeat: repeat-y;
      background-size: 100%;
    }

    #left {
      max-width: 300px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
