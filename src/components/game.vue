<script setup>
  const gameLoop = () => {
    window.requestAnimationFrame(gameLoop)
    useJobStore().update()
    useMovementStore().update()
  }

  onMounted(() => {
    gameLoop()
  })
</script>

<template>
  <div id="game-container">
    <DebugFrame />
    <GameSidebar />
    <GameWorld />
  </div>
</template>

<style>
  #game-container {
    display: flex;
    height: 100vh;
    width: 100vw;
    max-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
  }
</style>
