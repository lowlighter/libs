/** A colour in hex or rgb(a) format. */
export type Color = `#${string}` | `rgb(${string})` | `rgba(${string})`

/** Mix a hex/rgb colour toward white (ratio > 0) or black (ratio < 0). */
export function shade(color: Color, ratio: number): string {
  const rgb = toRgb(color)
  if (!rgb)
    return color
  const modify = (component: number) => Math.round(((ratio < 0 ? 0 : 255) - component) * Math.abs(ratio) + component)
  return `rgb(${modify(rgb[0])},${modify(rgb[1])},${modify(rgb[2])})`
}

/** Convert a hex/rgb colour to an RGB array. */
export function toRgb(color: Color): [number, number, number] | null {
  if (color.startsWith("#")) {
    let hex = color.slice(1)
    if (hex.length === 3)
      hex = hex.split("").map((byte) => `${byte}${byte}`).join("")
    const value = Number.parseInt(hex, 16)
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
  }
  const match = color.match(/rgba?\(([^)]+)\)/)
  if (match)
    return match[1].split(",").slice(0, 3).map((component) => Number.parseInt(component, 10)) as [number, number, number]
  return null
}
