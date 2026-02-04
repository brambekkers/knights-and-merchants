<script setup lang="ts">
  const props = defineProps<{
    character: Character
    isSelected: boolean
  }>()

  const emit = defineEmits<{
    click: []
  }>()

  const { cellSize } = useMapStore()
  const cellSizePx = cellSize + 'px'

  // Animation state
  const direction = ref<'up' | 'down' | 'left' | 'right' | 'upLeft' | 'upRight' | 'downLeft' | 'downRight'>('down')
  const currentFrame = ref(1)
  const totalFrames = 8
  const frameInterval = 100 // ms between frames

  // Track previous position to calculate direction
  const prevX = ref(props.character.x)
  const prevY = ref(props.character.y)

  // Animation loop
  let animationTimer: ReturnType<typeof setInterval> | null = null
  let movementTimeout: ReturnType<typeof setTimeout> | null = null
  const movementStopDelay = 150 // Stop animation if no movement for this many ms

  const startAnimation = () => {
    if (animationTimer) return
    animationTimer = setInterval(() => {
      currentFrame.value = (currentFrame.value % totalFrames) + 1
    }, frameInterval)
  }

  const stopAnimation = () => {
    if (animationTimer) {
      clearInterval(animationTimer)
      animationTimer = null
      currentFrame.value = 1
    }
    if (movementTimeout) {
      clearTimeout(movementTimeout)
      movementTimeout = null
    }
  }

  // Reset the movement timeout - stops animation if no movement detected
  const resetMovementTimeout = () => {
    if (movementTimeout) {
      clearTimeout(movementTimeout)
    }
    movementTimeout = setTimeout(() => {
      // No movement detected for a while, stop animation
      if (animationTimer) {
        clearInterval(animationTimer)
        animationTimer = null
        // Keep current frame instead of resetting to 1 (looks more natural)
      }
    }, movementStopDelay)
  }

  // Calculate direction from position delta
  const calculateDirection = (dx: number, dy: number) => {
    if (dx === 0 && dy === 0) return direction.value

    // Determine primary direction based on delta
    if (dx > 0 && dy === 0) return 'right'
    if (dx < 0 && dy === 0) return 'left'
    if (dx === 0 && dy > 0) return 'down'
    if (dx === 0 && dy < 0) return 'up'
    if (dx > 0 && dy > 0) return 'downRight'
    if (dx < 0 && dy > 0) return 'downLeft'
    if (dx > 0 && dy < 0) return 'upRight'
    if (dx < 0 && dy < 0) return 'upLeft'

    return direction.value
  }

  // Watch for position changes
  watch(
    () => [props.character.x, props.character.y],
    ([newX, newY]) => {
      const dx = newX - prevX.value
      const dy = newY - prevY.value

      if (dx !== 0 || dy !== 0) {
        direction.value = calculateDirection(dx, dy)
        startAnimation()
        resetMovementTimeout()
      }

      prevX.value = newX
      prevY.value = newY
    }
  )

  // Watch for state changes (idle = stop animation)
  watch(
    () => props.character.state,
    (newState) => {
      if (newState === 'idle') {
        stopAnimation()
      }
    }
  )

  // Start animation if character is already busy
  onMounted(() => {
    if (props.character.state === 'busy') {
      startAnimation()
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    stopAnimation()
  })

  // Computed sprite path
  const spriteSrc = computed(() => {
    return `/assets/characters/servant/${direction.value}${currentFrame.value}.png`
  })

  // Position styling
  const containerStyle = computed(() => ({
    top: props.character.y * cellSize + 'px',
    left: props.character.x * cellSize + 'px'
  }))

  // Visibility (defaults to true if undefined)
  const isVisible = computed(() => props.character.visible !== false)
</script>

<template>
  <div
    v-show="isVisible"
    class="servant-container"
    :class="{ selected: isSelected }"
    :style="containerStyle"
    @click="emit('click')">
    <img :src="spriteSrc" :alt="character.type" />
  </div>
</template>

<style scoped>
  .servant-container {
    position: absolute;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    width: v-bind(cellSizePx);
    height: v-bind(cellSizePx);
    cursor: pointer;
    transition: transform 0.1s ease;

    &:hover {
      transform: scale(1.1);
    }

    &.selected {
      transform: scale(1.15);
    }

    img {
      position: absolute;
      height: 2.5rem;
      inset: 0;
      margin: auto;
    }
  }
</style>
