<script setup lang="ts">
const props = defineProps<{
  buildingType: string
  progress: number // 0-100
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isLoaded = ref(false)

// Image sources based on building type
const basePath = computed(() => `/assets/building/${props.buildingType}/`)
const frameSrc = computed(() => `${basePath.value}frame.png`)
const frameMapSrc = computed(() => `${basePath.value}frame_map.png`)
const fullSrc = computed(() => `${basePath.value}full.png`)
const fullMapSrc = computed(() => `${basePath.value}full_map.png`)

// Load an image and return a promise
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Extract unique colors from mask and sort them by hue for reveal order
const extractMaskColors = (ctx: CanvasRenderingContext2D, width: number, height: number): number[][] => {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const colorSet = new Map<string, number[]>()

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]

    // Skip transparent and pure black pixels
    if (a < 128 || (r === 0 && g === 0 && b === 0)) continue

    const key = `${r},${g},${b}`
    if (!colorSet.has(key)) {
      colorSet.set(key, [r, g, b])
    }
  }

  // Convert to array and sort by hue
  const colors = Array.from(colorSet.values())
  return colors.sort((a, b) => {
    const hueA = rgbToHue(a[0], a[1], a[2])
    const hueB = rgbToHue(b[0], b[1], b[2])
    return hueA - hueB
  })
}

// Convert RGB to hue (0-360)
const rgbToHue = (r: number, g: number, b: number): number => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0

  if (max !== min) {
    const d = max - min
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  return h * 360
}

// Check if a color matches any in the allowed list (with tolerance)
const colorMatches = (r: number, g: number, b: number, allowedColors: number[][]): boolean => {
  const tolerance = 10
  for (const [ar, ag, ab] of allowedColors) {
    if (
      Math.abs(r - ar) <= tolerance &&
      Math.abs(g - ag) <= tolerance &&
      Math.abs(b - ab) <= tolerance
    ) {
      return true
    }
  }
  return false
}

// Render the construction state
const render = async () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  try {
    // Load all images
    const [frameImg, frameMapImg, fullImg, fullMapImg] = await Promise.all([
      loadImage(frameSrc.value),
      loadImage(frameMapSrc.value),
      loadImage(fullSrc.value),
      loadImage(fullMapSrc.value)
    ])

    // Set canvas size to match full image
    canvas.width = fullImg.width
    canvas.height = fullImg.height

    // Create offscreen canvases for processing
    const offscreen = document.createElement('canvas')
    offscreen.width = canvas.width
    offscreen.height = canvas.height
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true })!

    // Clear main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const progress = props.progress

    if (progress < 50) {
      // Phase 1: Building frame (0-50%)
      const phaseProgress = progress / 50 // 0-1 within this phase

      // Draw frame mask to extract colors
      offCtx.clearRect(0, 0, canvas.width, canvas.height)
      offCtx.drawImage(frameMapImg, 0, 0)
      const maskColors = extractMaskColors(offCtx, canvas.width, canvas.height)

      // Determine how many colors to show based on progress
      const colorsToShow = Math.ceil(maskColors.length * phaseProgress)
      const allowedColors = maskColors.slice(0, colorsToShow)

      if (allowedColors.length > 0) {
        // Get mask data
        const maskData = offCtx.getImageData(0, 0, canvas.width, canvas.height)

        // Draw frame image
        offCtx.clearRect(0, 0, canvas.width, canvas.height)
        offCtx.drawImage(frameImg, 0, 0)
        const frameData = offCtx.getImageData(0, 0, canvas.width, canvas.height)

        // Apply mask
        for (let i = 0; i < frameData.data.length; i += 4) {
          const mr = maskData.data[i]
          const mg = maskData.data[i + 1]
          const mb = maskData.data[i + 2]

          if (!colorMatches(mr, mg, mb, allowedColors)) {
            frameData.data[i + 3] = 0 // Make transparent
          }
        }

        ctx.putImageData(frameData, 0, 0)
      }
    } else {
      // First draw complete frame
      ctx.drawImage(frameImg, 0, 0)

      // Phase 2: Full building (50-100%)
      const phaseProgress = (progress - 50) / 50 // 0-1 within this phase

      // Draw full mask to extract colors
      offCtx.clearRect(0, 0, canvas.width, canvas.height)
      offCtx.drawImage(fullMapImg, 0, 0)
      const maskColors = extractMaskColors(offCtx, canvas.width, canvas.height)

      // Determine how many colors to show based on progress
      const colorsToShow = Math.ceil(maskColors.length * phaseProgress)
      const allowedColors = maskColors.slice(0, colorsToShow)

      if (allowedColors.length > 0) {
        // Get mask data
        const maskData = offCtx.getImageData(0, 0, canvas.width, canvas.height)

        // Draw full image
        offCtx.clearRect(0, 0, canvas.width, canvas.height)
        offCtx.drawImage(fullImg, 0, 0)
        const fullData = offCtx.getImageData(0, 0, canvas.width, canvas.height)

        // Apply mask
        for (let i = 0; i < fullData.data.length; i += 4) {
          const mr = maskData.data[i]
          const mg = maskData.data[i + 1]
          const mb = maskData.data[i + 2]

          if (!colorMatches(mr, mg, mb, allowedColors)) {
            fullData.data[i + 3] = 0 // Make transparent
          }
        }

        // Draw masked full building on top of frame
        offCtx.clearRect(0, 0, canvas.width, canvas.height)
        offCtx.putImageData(fullData, 0, 0)
        ctx.drawImage(offscreen, 0, 0)
      }
    }

    isLoaded.value = true
  } catch (error) {
    console.error('Failed to render construction:', error)
  }
}

// Re-render when progress changes
watch(() => props.progress, render, { immediate: true })

onMounted(render)
</script>

<template>
  <canvas
    ref="canvasRef"
    class="construction-canvas"
    :class="{ loaded: isLoaded }" />
</template>

<style scoped>
.construction-canvas {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.construction-canvas.loaded {
  opacity: 1;
}
</style>
