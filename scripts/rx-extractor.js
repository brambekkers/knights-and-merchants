/**
 * Knights and Merchants RX File Extractor
 *
 * RX File Format:
 * - Count (4 bytes LE): Number of sprites
 * - Flags (Count bytes): 1 byte per sprite (1 = exists, 0 = empty)
 * - For each sprite where flag = 1:
 *   - Width (4 bytes LE)
 *   - Height (4 bytes LE)
 *   - Pivot X (4 bytes LE)
 *   - Pivot Y (4 bytes LE)
 *   - Pixel data (Width * Height bytes): 8-bit palette indices
 *
 * Usage:
 *   node rx-extractor.js <input.rx> [output-dir] [--json] [--png]
 */

const fs = require('fs')
const path = require('path')

// Default KaM palette (approximation based on common game palettes)
// This is a placeholder - for accurate colors, you need the actual game palette
const DEFAULT_PALETTE = generateDefaultPalette()

function generateDefaultPalette() {
  const palette = []
  // Generate a reasonable default palette
  // Index 0 is typically transparent
  palette.push([0, 0, 0, 0]) // Transparent

  // Grayscale ramp (indices 1-31)
  for (let i = 1; i < 32; i++) {
    const v = Math.round((i / 31) * 255)
    palette.push([v, v, v, 255])
  }

  // Color ramps - approximate the KaM palette
  // Browns/terrain (32-63)
  for (let i = 0; i < 32; i++) {
    const r = Math.round(139 + (i / 31) * 80)
    const g = Math.round(90 + (i / 31) * 60)
    const b = Math.round(43 + (i / 31) * 40)
    palette.push([Math.min(r, 255), Math.min(g, 255), Math.min(b, 255), 255])
  }

  // Greens (64-95)
  for (let i = 0; i < 32; i++) {
    const r = Math.round(34 + (i / 31) * 60)
    const g = Math.round(139 + (i / 31) * 80)
    const b = Math.round(34 + (i / 31) * 40)
    palette.push([Math.min(r, 255), Math.min(g, 255), Math.min(b, 255), 255])
  }

  // Blues (96-127)
  for (let i = 0; i < 32; i++) {
    const r = Math.round(30 + (i / 31) * 50)
    const g = Math.round(60 + (i / 31) * 80)
    const b = Math.round(139 + (i / 31) * 100)
    palette.push([Math.min(r, 255), Math.min(g, 255), Math.min(b, 255), 255])
  }

  // Reds/oranges (128-159)
  for (let i = 0; i < 32; i++) {
    const r = Math.round(180 + (i / 31) * 75)
    const g = Math.round(60 + (i / 31) * 80)
    const b = Math.round(30 + (i / 31) * 40)
    palette.push([Math.min(r, 255), Math.min(g, 255), Math.min(b, 255), 255])
  }

  // Yellows (160-191)
  for (let i = 0; i < 32; i++) {
    const r = Math.round(200 + (i / 31) * 55)
    const g = Math.round(180 + (i / 31) * 60)
    const b = Math.round(60 + (i / 31) * 40)
    palette.push([Math.min(r, 255), Math.min(g, 255), Math.min(b, 255), 255])
  }

  // Light colors (192-223)
  for (let i = 0; i < 32; i++) {
    const v = Math.round(180 + (i / 31) * 75)
    palette.push([Math.min(v, 255), Math.min(v, 255), Math.min(v - 20, 255), 255])
  }

  // Dark colors (224-255)
  for (let i = 0; i < 32; i++) {
    const v = Math.round(20 + (i / 31) * 100)
    palette.push([v, v, v + 10, 255])
  }

  return palette
}

/**
 * Load palette from a BBM file (KaM palette format)
 */
function loadBBMPalette(filePath) {
  const buffer = fs.readFileSync(filePath)
  const palette = []

  // BBM header is 48 bytes, then 256 RGB triplets
  const offset = 48
  for (let i = 0; i < 256; i++) {
    const r = buffer[offset + i * 3]
    const g = buffer[offset + i * 3 + 1]
    const b = buffer[offset + i * 3 + 2]
    // Index 0 is transparent in KaM
    const a = i === 0 ? 0 : 255
    palette.push([r, g, b, a])
  }

  return palette
}

/**
 * Parse an RX file and extract sprite data
 */
function parseRXFile(filePath) {
  const buffer = fs.readFileSync(filePath)
  let offset = 0

  // Read sprite count (4 bytes LE)
  const count = buffer.readUInt32LE(offset)
  offset += 4

  console.log(`Sprite count: ${count}`)

  // Read flags (1 byte per sprite)
  const flags = []
  for (let i = 0; i < count; i++) {
    flags.push(buffer[offset + i])
  }
  offset += count

  console.log(`Valid sprites: ${flags.filter((f) => f === 1).length}`)

  // Read sprite data
  const sprites = []
  for (let i = 0; i < count; i++) {
    if (flags[i] !== 1) {
      sprites.push(null)
      continue
    }

    // Read dimensions and pivot
    const width = buffer.readInt32LE(offset)
    offset += 4
    const height = buffer.readInt32LE(offset)
    offset += 4
    const pivotX = buffer.readInt32LE(offset)
    offset += 4
    const pivotY = buffer.readInt32LE(offset)
    offset += 4

    // Read pixel data
    const pixelCount = width * height
    const pixels = Buffer.alloc(pixelCount)
    buffer.copy(pixels, 0, offset, offset + pixelCount)
    offset += pixelCount

    sprites.push({
      index: i + 1, // 1-indexed
      width,
      height,
      pivotX,
      pivotY,
      pixels
    })
  }

  return { count, sprites }
}

/**
 * Convert paletted sprite to RGBA buffer
 */
function spriteToRGBA(sprite, palette) {
  const { width, height, pixels } = sprite
  const rgba = Buffer.alloc(width * height * 4)

  for (let i = 0; i < pixels.length; i++) {
    const colorIndex = pixels[i]
    const [r, g, b, a] = palette[colorIndex] || [255, 0, 255, 255] // Magenta for missing colors
    rgba[i * 4] = r
    rgba[i * 4 + 1] = g
    rgba[i * 4 + 2] = b
    rgba[i * 4 + 3] = a
  }

  return rgba
}

/**
 * Write sprite as PNG using pure Node.js (simple uncompressed PNG)
 */
function writePNG(filePath, width, height, rgbaData) {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

  // Helper to create PNG chunk
  function createChunk(type, data) {
    const length = Buffer.alloc(4)
    length.writeUInt32BE(data.length)

    const typeBuffer = Buffer.from(type)
    const crcData = Buffer.concat([typeBuffer, data])

    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(crcData))

    return Buffer.concat([length, typeBuffer, data, crc])
  }

  // CRC32 calculation
  function crc32(buffer) {
    let crc = 0xffffffff
    const table = []

    for (let i = 0; i < 256; i++) {
      let c = i
      for (let j = 0; j < 8; j++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      }
      table[i] = c
    }

    for (let i = 0; i < buffer.length; i++) {
      crc = table[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8)
    }

    return (crc ^ 0xffffffff) >>> 0
  }

  // IHDR chunk
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type (RGBA)
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  // IDAT chunk - raw image data with filter bytes
  const rawData = Buffer.alloc(height + width * height * 4)
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 4 + 1)] = 0 // filter type: none
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4
      const dstIdx = y * (width * 4 + 1) + 1 + x * 4
      rawData[dstIdx] = rgbaData[srcIdx]
      rawData[dstIdx + 1] = rgbaData[srcIdx + 1]
      rawData[dstIdx + 2] = rgbaData[srcIdx + 2]
      rawData[dstIdx + 3] = rgbaData[srcIdx + 3]
    }
  }

  // Compress with zlib
  const zlib = require('zlib')
  const compressed = zlib.deflateSync(rawData)

  // IEND chunk
  const iend = Buffer.alloc(0)

  // Combine all chunks
  const png = Buffer.concat([
    signature,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', compressed),
    createChunk('IEND', iend)
  ])

  fs.writeFileSync(filePath, png)
}

/**
 * Main extraction function
 */
function extractRX(inputPath, outputDir, options = {}) {
  const { exportJson = false, exportPng = true, paletteFile = null } = options

  // Load palette
  let palette = DEFAULT_PALETTE
  if (paletteFile && fs.existsSync(paletteFile)) {
    console.log(`Loading palette from: ${paletteFile}`)
    palette = loadBBMPalette(paletteFile)
  } else {
    console.log('Using default palette (colors may not be accurate)')
  }

  // Parse RX file
  console.log(`\nParsing: ${inputPath}`)
  const { count, sprites } = parseRXFile(inputPath)

  // Create output directory
  const baseName = path.basename(inputPath, '.rx')
  const outDir = outputDir || path.join(path.dirname(inputPath), `${baseName}_extracted`)
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  // Export metadata
  if (exportJson) {
    const metadata = {
      source: inputPath,
      spriteCount: count,
      sprites: sprites
        .filter((s) => s !== null)
        .map((s) => ({
          index: s.index,
          width: s.width,
          height: s.height,
          pivotX: s.pivotX,
          pivotY: s.pivotY
        }))
    }
    const jsonPath = path.join(outDir, `${baseName}.json`)
    fs.writeFileSync(jsonPath, JSON.stringify(metadata, null, 2))
    console.log(`Metadata saved to: ${jsonPath}`)
  }

  // Export sprites as PNG
  if (exportPng) {
    let exported = 0
    for (const sprite of sprites) {
      if (!sprite) continue
      if (sprite.width <= 0 || sprite.height <= 0) continue

      const rgbaData = spriteToRGBA(sprite, palette)
      const pngPath = path.join(outDir, `sprite_${String(sprite.index).padStart(4, '0')}.png`)

      try {
        writePNG(pngPath, sprite.width, sprite.height, rgbaData)
        exported++
      } catch (err) {
        console.error(`Failed to export sprite ${sprite.index}: ${err.message}`)
      }
    }
    console.log(`Exported ${exported} sprites to: ${outDir}`)
  }

  return { count, validSprites: sprites.filter((s) => s !== null).length }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Knights and Merchants RX File Extractor

Usage:
  node rx-extractor.js <input.rx> [output-dir] [options]

Options:
  --json          Export metadata as JSON
  --png           Export sprites as PNG (default: true)
  --no-png        Skip PNG export
  --palette <file> Use custom BBM palette file

Examples:
  node rx-extractor.js gui.rx
  node rx-extractor.js gui.rx ./output --json
  node rx-extractor.js houses.rx ./houses --palette pal0.bbm
    `)
    process.exit(0)
  }

  const inputPath = args[0]
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found: ${inputPath}`)
    process.exit(1)
  }

  let outputDir = null
  const options = {
    exportJson: false,
    exportPng: true,
    paletteFile: null
  }

  for (let i = 1; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--json') {
      options.exportJson = true
    } else if (arg === '--png') {
      options.exportPng = true
    } else if (arg === '--no-png') {
      options.exportPng = false
    } else if (arg === '--palette' && args[i + 1]) {
      options.paletteFile = args[++i]
    } else if (!arg.startsWith('--')) {
      outputDir = arg
    }
  }

  try {
    extractRX(inputPath, outputDir, options)
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

module.exports = { parseRXFile, extractRX, loadBBMPalette, spriteToRGBA }
