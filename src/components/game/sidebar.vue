<script setup lang="ts"></script>

<template>
  <div id="sidebar-container">
    <GameSidebarMinimap />
    <GameSidebarLogo />
    <GameSidebarActions />
  </div>
</template>

<style scoped>
  #sidebar-container {
    height: 100vh;
    min-width: 300px;
    background-color: #8b7d5a;

    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
