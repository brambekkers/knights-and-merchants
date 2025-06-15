<script setup lang="ts">
  const { showMovementArea } = storeToRefs(useDebugStore())

  const x = defineModel<number>('x', { default: 0 })
  const y = defineModel<number>('y', { default: 0 })
  defineProps<{
    arrivedState: { top: boolean; bottom: boolean; left: boolean; right: boolean }
  }>()

  const opacity = computed(() => (showMovementArea.value ? 0.3 : 0))

  const rightMove = useTemplateRef<HTMLButtonElement>('right-move')
  const isRightHovered = useElementHover(rightMove)
  const leftMove = useTemplateRef<HTMLButtonElement>('left-move')
  const isLeftHovered = useElementHover(leftMove)
  const topMove = useTemplateRef<HTMLButtonElement>('top-move')
  const isTopHovered = useElementHover(topMove)
  const bottomMove = useTemplateRef<HTMLButtonElement>('bottom-move')
  const isBottomHovered = useElementHover(bottomMove)

  const movementSpeed = 200

  const moveRight = () => (x.value += movementSpeed)
  const moveLeft = () => (x.value -= movementSpeed)
  const moveUp = () => (y.value -= movementSpeed)
  const moveDown = () => (y.value += movementSpeed)

  let interval: NodeJS.Timeout | null = null

  const move = (direction: 'right' | 'left' | 'up' | 'down') => {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    if (direction === 'right') {
      interval = setInterval(moveRight, 100)
    } else if (direction === 'left') {
      interval = setInterval(moveLeft, 100)
    } else if (direction === 'up') {
      interval = setInterval(moveUp, 100)
    } else if (direction === 'down') {
      interval = setInterval(moveDown, 100)
    }
  }

  watch([isRightHovered, isLeftHovered, isTopHovered, isBottomHovered], ([right, left, top, bottom]) => {
    if (!right && !left && !top && !bottom && interval) {
      clearInterval(interval)
      interval = null
      return
    }
    if (right) {
      move('right')
    } else if (left) {
      move('left')
    } else if (top) {
      move('up')
    } else if (bottom) {
      move('down')
    }
  })

  onMounted(() => {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'd') {
        move('right')
      } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        moveLeft()
      } else if (event.key === 'ArrowUp' || event.key === 'w') {
        moveUp()
      } else if (event.key === 'ArrowDown' || event.key === 's') {
        moveDown()
      }
    })

    document.addEventListener('keyup', () => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    })
  })

  onUnmounted(() => {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    document.removeEventListener('keydown', () => {})
    document.removeEventListener('keyup', () => {})
  })
</script>

<template>
  <div id="movement">
    <div
      v-if="!arrivedState.top"
      id="top-move"
      ref="top-move" />
    <div
      v-if="!arrivedState.bottom"
      id="bottom-move"
      ref="bottom-move" />
    <div
      v-if="!arrivedState.left"
      id="left-move"
      ref="left-move" />
    <div
      v-if="!arrivedState.right"
      id="right-move"
      ref="right-move" />
  </div>
</template>

<style scoped>
  #movement {
    position: absolute;
    inset: 0;
    pointer-events: none;

    #top-move,
    #bottom-move,
    #left-move,
    #right-move {
      position: fixed;
      opacity: v-bind(opacity);
      transition: opacity 0.3s ease-in-out;
      background-color: blue;
      pointer-events: auto;
    }

    #top-move {
      top: 0;
      left: 300px; /* Adjusted to avoid overlap with sidebar */
      right: 0;
      height: 2rem;
    }

    #bottom-move {
      bottom: 0;
      left: 300px; /* Adjusted to avoid overlap with sidebar */
      right: 0;
      height: 2rem;
    }
    #left-move {
      top: 0;
      left: 0;
      bottom: 0;
      width: 2rem;
      margin-left: 300px; /* Adjusted to avoid overlap with sidebar */
    }

    #right-move {
      top: 0;
      right: 0;
      bottom: 0;
      width: 2rem;
    }
  }
</style>
