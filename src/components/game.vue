<script setup>
  const sidebarStore = useSidebarStore()
  const { menu, buildSelect, selectedBuilding, selectedCharacter } = storeToRefs(sidebarStore)

  const gameLoop = () => {
    window.requestAnimationFrame(gameLoop)
    usePlayersStore().update()
    useDeliveryStore().update()
    useJobStore().update()
    useMovementStore().update()
  }

  const escapeAction = () => {
    buildSelect.value = null
    selectedBuilding.value = null
    selectedCharacter.value = null
  }

  const escapeMenus = () => {
    menu.value = ''
    escapeAction()
  }

  // add event listner for escape key
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') escapeMenus()
  })
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    escapeAction()
  })

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
