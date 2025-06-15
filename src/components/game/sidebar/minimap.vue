<template>
  <div id="minimap">
    <img src="@/assets/ui/minimapFrame.png" />
  </div>
</template>

<style scoped>
  #minimap {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: black;
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
