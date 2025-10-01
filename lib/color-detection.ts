export interface RGB {
  r: number
  g: number
  b: number
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
}

export function getColorName(r: number, g: number, b: number): string {
  // Define common color ranges
  const colors = [
    { name: "Red", range: { r: [180, 255], g: [0, 100], b: [0, 100] } },
    { name: "Pink", range: { r: [200, 255], g: [100, 200], b: [150, 255] } },
    { name: "Orange", range: { r: [200, 255], g: [100, 180], b: [0, 100] } },
    { name: "Yellow", range: { r: [200, 255], g: [200, 255], b: [0, 150] } },
    { name: "Green", range: { r: [0, 150], g: [150, 255], b: [0, 150] } },
    { name: "Blue", range: { r: [0, 150], g: [100, 200], b: [180, 255] } },
    { name: "Purple", range: { r: [100, 200], g: [0, 150], b: [150, 255] } },
    { name: "Brown", range: { r: [100, 180], g: [50, 120], b: [0, 80] } },
    { name: "White", range: { r: [200, 255], g: [200, 255], b: [200, 255] } },
    { name: "Gray", range: { r: [100, 200], g: [100, 200], b: [100, 200] } },
    { name: "Black", range: { r: [0, 80], g: [0, 80], b: [0, 80] } },
  ]

  // Check if color matches any defined range
  for (const color of colors) {
    const { range } = color
    if (
      r >= range.r[0] &&
      r <= range.r[1] &&
      g >= range.g[0] &&
      g <= range.g[1] &&
      b >= range.b[0] &&
      b <= range.b[1]
    ) {
      return color.name
    }
  }

  // Fallback to basic color detection
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min

  if (diff < 30) {
    if (max > 200) return "White"
    if (max < 80) return "Black"
    return "Gray"
  }

  if (r === max) {
    if (g > b) return "Orange"
    return "Red"
  }
  if (g === max) return "Green"
  return "Blue"
}

export async function detectDominantColor(file: File): Promise<{ color: string; hex: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      reject(new Error("Could not get canvas context"))
      return
    }

    img.onload = () => {
      // Resize for faster processing
      const maxSize = 200
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data

      // Count color frequencies
      const colorMap: { [key: string]: number } = {}
      const step = 4 // Sample every 4th pixel for speed

      for (let i = 0; i < data.length; i += step * 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]

        // Skip transparent pixels
        if (a < 125) continue

        // Round to nearest 10 to group similar colors
        const rRounded = Math.round(r / 10) * 10
        const gRounded = Math.round(g / 10) * 10
        const bRounded = Math.round(b / 10) * 10

        const key = `${rRounded},${gRounded},${bRounded}`
        colorMap[key] = (colorMap[key] || 0) + 1
      }

      // Find most common color
      let maxCount = 0
      let dominantColor = "128,128,128"

      for (const [color, count] of Object.entries(colorMap)) {
        if (count > maxCount) {
          maxCount = count
          dominantColor = color
        }
      }

      const [r, g, b] = dominantColor.split(",").map(Number)
      const colorName = getColorName(r, g, b)
      const hex = rgbToHex(r, g, b)

      resolve({ color: colorName, hex })
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = URL.createObjectURL(file)
  })
}
