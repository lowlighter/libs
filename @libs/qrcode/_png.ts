/**
 * Dependency-free PNG encoding (and decoding, for testing) for QR Code output.
 *
 * The encoder writes an 8-bit RGBA image using uncompressed (stored) DEFLATE blocks,
 * which lets it produce a valid PNG stream without relying on any compression library or platform-specific API.
 */

/** Red, green, blue and alpha channels of a color. */
export type rgba = [number, number, number, number]

/** Named colors supported for PNG output (arbitrary CSS colors cannot be resolved without a rendering engine). */
const COLORS = {
  transparent: "#00000000",
  black: "#000000",
  silver: "#c0c0c0",
  gray: "#808080",
  grey: "#808080",
  white: "#ffffff",
  maroon: "#800000",
  red: "#ff0000",
  purple: "#800080",
  fuchsia: "#ff00ff",
  magenta: "#ff00ff",
  green: "#008000",
  lime: "#00ff00",
  olive: "#808000",
  yellow: "#ffff00",
  navy: "#000080",
  blue: "#0000ff",
  teal: "#008080",
  aqua: "#00ffff",
  cyan: "#00ffff",
  orange: "#ffa500",
} as Record<string, string>

/**
 * Parses a color into its red, green, blue and alpha channels for PNG output.
 * Supports hexadecimal notations (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`) and a set of named colors.
 */
export function color(value: string): rgba {
  let hex = (COLORS[value.toLowerCase()] ?? value).replace(/^#/, "")
  if (!/^(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex)) {
    throw new TypeError(`Unsupported color for png output: "${value}" (use a hexadecimal value such as "#000000" or a supported named color)`)
  }
  if (hex.length <= 4) {
    hex = [...hex].map((char) => char + char).join("")
  }
  const channels = hex.match(/../g)!.map((byte) => parseInt(byte, 16))
  return [channels[0], channels[1], channels[2], channels[3] ?? 0xFF]
}

/** Precomputed CRC-32 lookup table (IEEE 802.3 polynomial), used for PNG chunk checksums. */
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let i = 0; i < 8; i++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
  }
  return c >>> 0
})

/** Computes the CRC-32 checksum of the given bytes. */
function crc32(bytes: Uint8Array): number {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8)
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

/** Computes the Adler-32 checksum of the given bytes. */
function adler32(bytes: Uint8Array): number {
  let a = 1
  let b = 0
  for (let i = 0; i < bytes.length;) {
    const end = Math.min(i + 5552, bytes.length)
    for (; i < end; i++) {
      a += bytes[i]
      b += a
    }
    a %= 65521
    b %= 65521
  }
  return ((b << 16) | a) >>> 0
}

/** Wraps the given bytes in a zlib stream using uncompressed (stored) DEFLATE blocks, avoiding any compression dependency. */
function zlib(bytes: Uint8Array): Uint8Array {
  const blocks = Math.ceil(bytes.length / 0xFFFF) || 1
  const result = new Uint8Array(2 + bytes.length + blocks * 5 + 4)
  let offset = 0
  result[offset++] = 0x78 // CMF: DEFLATE compression with a 32K window
  result[offset++] = 0x01 // FLG: no preset dictionary (0x7801 is a multiple of 31, as required)
  for (let i = 0; i < bytes.length || offset === 2; i += 0xFFFF) {
    const length = Math.min(0xFFFF, bytes.length - i)
    result[offset++] = i + length >= bytes.length ? 1 : 0 // BFINAL on the last block, BTYPE = 00 (stored)
    result[offset++] = length & 0xFF
    result[offset++] = (length >>> 8) & 0xFF
    result[offset++] = ~length & 0xFF
    result[offset++] = (~length >>> 8) & 0xFF
    result.set(bytes.subarray(i, i + length), offset)
    offset += length
  }
  const adler = adler32(bytes)
  result[offset++] = (adler >>> 24) & 0xFF
  result[offset++] = (adler >>> 16) & 0xFF
  result[offset++] = (adler >>> 8) & 0xFF
  result[offset] = adler & 0xFF
  return result
}

/** Builds a PNG chunk (4-byte length, 4-byte type, data and 4-byte CRC-32) from the given type and data. */
function chunk(type: string, data: Uint8Array): Uint8Array {
  const result = new Uint8Array(12 + data.length)
  const view = new DataView(result.buffer)
  view.setUint32(0, data.length)
  for (let i = 0; i < 4; i++) {
    result[4 + i] = type.charCodeAt(i)
  }
  result.set(data, 8)
  view.setUint32(8 + data.length, crc32(result.subarray(4, 8 + data.length)))
  return result
}

/** PNG file signature. */
export const signature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]

/** Encodes a QR Code matrix into a PNG image (8-bit RGBA, uncompressed) and returns its raw bytes. */
export function png({ get, size, light, dark, scale }: { get: (x: number, y: number) => boolean; size: number; light: string; dark: string; scale: number }): Uint8Array {
  const on = color(dark)
  const off = color(light)
  const dimension = size * scale
  const stride = dimension * 4 + 1
  const raw = new Uint8Array(stride * dimension)
  for (let y = 0; y < size; y++) {
    // Render a single module row into a scanline, then duplicate it `scale` times vertically
    const scanline = new Uint8Array(stride)
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = get(x, y) ? on : off
      for (let s = 0; s < scale; s++) {
        const offset = 1 + (x * scale + s) * 4
        scanline[offset] = r
        scanline[offset + 1] = g
        scanline[offset + 2] = b
        scanline[offset + 3] = a
      }
    }
    for (let s = 0; s < scale; s++) {
      raw.set(scanline, (y * scale + s) * stride)
    }
  }

  // IHDR: width, height, bit depth (8), color type (6 = RGBA), compression (0), filter (0), interlace (0)
  const ihdr = new Uint8Array(13)
  const header = new DataView(ihdr.buffer)
  header.setUint32(0, dimension)
  header.setUint32(4, dimension)
  ihdr[8] = 8
  ihdr[9] = 6

  const chunks = [new Uint8Array(signature), chunk("IHDR", ihdr), chunk("IDAT", zlib(raw)), chunk("IEND", new Uint8Array(0))]
  const result = new Uint8Array(chunks.reduce((sum, part) => sum + part.length, 0))
  let offset = 0
  for (const part of chunks) {
    result.set(part, offset)
    offset += part.length
  }
  return result
}

/** Decodes a PNG produced into its dimensions and RGBA pixels. */
export async function decode(png: Uint8Array): Promise<{ width: number; height: number; colorType: number; bitDepth: number; pixel: (x: number, y: number) => number[] }> {
  if (!signature.every((byte, i) => png[i] === byte)) {
    throw new TypeError("Invalid PNG signature")
  }
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength)
  let offset = 8
  let width = 0
  let height = 0
  let colorType = -1
  let bitDepth = -1
  const idat = [] as Uint8Array[]
  while (offset < png.length) {
    const length = view.getUint32(offset)
    const type = String.fromCharCode(...png.subarray(offset + 4, offset + 8))
    if (type === "IHDR") {
      width = view.getUint32(offset + 8)
      height = view.getUint32(offset + 12)
      bitDepth = png[offset + 16]
      colorType = png[offset + 17]
    }
    if (type === "IDAT") {
      idat.push(png.slice(offset + 8, offset + 8 + length))
    }
    offset += 12 + length
  }
  const compressed = new Uint8Array(idat.reduce((sum, part) => sum + part.length, 0))
  idat.reduce((at, part) => (compressed.set(part, at), at + part.length), 0)
  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate"))
  const raw = new Uint8Array(await new Response(stream).arrayBuffer())
  const stride = width * 4 + 1
  const pixel = (x: number, y: number) => [...raw.subarray(y * stride + 1 + x * 4, y * stride + 1 + x * 4 + 4)]
  return { width, height, colorType, bitDepth, pixel }
}
