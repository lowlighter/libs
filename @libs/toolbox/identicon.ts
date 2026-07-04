/**
 * A deterministic identicon as an `svg+xml` data URL.
 *
 * A mirror-symmetric pixel grid with a seeded hue to generate  a simple recognisable default avatar.
 */
export function identicon(seed: string, { size = 5 } = {}): string {
  if ((!Number.isInteger(size)) || (size <= 0))
    throw new RangeError(`Invalid identicon size: ${size}`)
  // FNV-1a 32-bit hash of the seed
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  h >>>= 0
  const hue = h % 360
  const fg = `hsl(${hue} 58% 62%)`
  const bg = `hsl(${hue} 26% 18%)`
  // Seed an LCG from the hash
  let r = h || 1
  const next = () => (r = (Math.imul(r, 1103515245) + 12345) >>> 0)
  const cells: string[] = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < Math.ceil(size / 2); x++) {
      if (next() & 0x10000) {
        cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`)
        if (x < Math.floor(size / 2))
          cells.push(`<rect x="${size - 1 - x}" y="${y}" width="1" height="1"/>`)
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" ` +
    `shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="${bg}"/>` +
    `<g fill="${fg}">${cells.join("")}</g></svg>`
  return `data:image/svg+xml;base64,${btoa(svg)}`
}
