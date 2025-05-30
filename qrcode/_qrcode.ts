// deno-lint-ignore-file single-var-declarator no-console
/**
 * QR Code generator library.
 *
 * The following code has been ported and rewritten by Simon Lecoq from Nayuki's original work at:
 * https://github.com/nayuki/QR-Code-generator/blob/master/typescript-javascript/qrcodegen.ts
 *
 * Significant changes includes:
 * - Edited to be usable as a proper EcmaScript module
 * - A single exported `qrcode()` function that can be used to generate QR Code in different formats:
 *   - `svg`: Returns a SVG image string
 *   - `console`: Prints the QR Code to the console
 *   - `array`: Returns an array of booleans
 * - Some suggestions from Nayuki such as converting some function to lookup tables were applied
 * - Lot of code has moved or has been rewritten to match lowlighter's coding style
 * - Original comments were kept
 * - Assertions were removed as only high-level generation is exposed
 *
 * ```
 * Copyright (c) Simon Lecoq <@lowlighter>. (MIT License)
 * https://github.com/lowlighter/libs/blob/main/LICENSE
 * ```
 * ```
 * Copyright (c) Project Nayuki. (MIT License)
 * https://www.nayuki.io/page/qr-code-generator-library
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 * ```
 *
 * @module
 */

/** Text encoder */
const encoder = new TextEncoder()

/**
 * Generate a QR Code from specified content and output it as a SVG string.
 *
 * Border, colors and ECL can be customized using {@link options}.
 *
 * ```ts
 * import { qrcode } from "jsr:@libs/qrcode"
 * const svg = qrcode("https://example.com", { output: "svg" })
 * console.assert(svg.includes("</svg>"))
 * ```
 */
export function qrcode(content: string | URL, options: { output: "svg" } & Pick<options, "border" | "light" | "dark" | "ecl">): string
/**
 * Generate a QR Code from specified content and output it to the console.
 *
 * Colors and ECL can be customized using {@link options}.
 * Note that custom colors must be supported by terminal ({@link https://developer.mozilla.org/en-US/docs/Web/API/console#styling_console_output | %c} directive is used to style the output).
 *
 * ```ts
 * import { qrcode } from "./mod.ts"
 * qrcode("https://example.com", { output: "console" })
 *
 * // QR Code will be prined in the console similar to this fashion
 * // ██████  ████    ██████
 * // ██  ██    ████  ██  ██
 * // ██████  ██      ██████
 * //           ██
 * // ██    ██  ██  ██  ██
 * //   ████  ██  ██  ██  ██
 * //           ████  ████
 * // ██████  ██      ██
 * // ██  ██    ██  ██    ██
 * // ██████  ████    ████
 *
 * ```
 */
export function qrcode(content: string | URL | Uint8Array, options: { output: "console" } & Pick<options, "light" | "dark" | "ecl">): void
/**
 * Generate a QR Code from specified content and output it as an array of booleans.
 *
 * Returned array is indexed by using `[y][x]` and the boolean `true` is used to represent a dark square.
 *
 * ```ts
 * import { qrcode } from "./mod.ts"
 * const array = qrcode("https://example.com")
 * console.assert(Array.isArray(array))
 * ```
 */
export function qrcode(content: string | URL | Uint8Array, options?: { output?: "array" } & Pick<options, "ecl">): boolean[][]

/**
 * Generate a QR Code from specified content.
 *
 * Content may either be:
 * - A `string` (not necessarily a URL-like, any text can be used)
 * - A `URL` object (in which case {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/href | URL.href} will be used as content)
 *
 * Output can be set to either `"svg"`, `"console"` or `"array"` and can be customized using supported {@link options}.
 *
 * ```ts
 * import { qrcode } from "jsr:@libs/qrcode"
 * const svg = qrcode("https://example.com", { output: "svg" })
 * console.assert(svg.includes("</svg>"))
 * ```
 *
 * @author Simon Lecoq (lowlighter)
 * @author Nayuki
 * @license MIT
 */
export function qrcode(content: string | URL | Uint8Array, options?: { output?: string } & options) {
  return QrCode.from(content, options)
}

/** QR code options. */
export type options = {
  /**
   * Border size (applies for `svg` outputs).
   */
  border?: number
  /**
   * Color for light squares (applies for `svg` and `console` outputs).
   *
   * Can be any valid CSS color value.
   * If `output` is set to `"console"`, the color must be supported by the terminal.
   */
  light?: string
  /**
   * Color for dark squares (applies for `svg` and `console` outputs).
   *
   * Can be any valid CSS color value.
   * If `output` is set to `"console"`, the color must be supported by the terminal.
   */
  dark?: string
  /**
   * The error correction level in a QR Code symbol.
   *
   * The QR Code can tolerate about:
   * - LOW: 7% erroneous codewords
   * - MEDIUM: 15% erroneous codewords
   * - QUARTILE: 25% erroneous codewords
   * - HIGH: 30% erroneous codewords
   */
  ecl?: "LOW" | "MEDIUM" | "QUARTILE" | "HIGH"
}

/**
 * A QR Code symbol, which is a type of two-dimension barcode.
 * Invented by Denso Wave and described in the ISO/IEC 18004 standard.
 *
 * The class covers the QR Code Model 2 specification, supporting:
 * - All versions (sizes) from 1 to 40
 * - All 4 error correction levels
 * - Numeric, Alphanumeric and Bytes character encoding modes (only Kanji is not supported)
 */
class QrCode {
  /**
   * Returns a QR Code representing the given Unicode text string at the given error correction level.
   * As a conservative upper bound, this function is guaranteed to succeed for strings that have 738 or fewer Unicode code points (not UTF-16 code units) if the low error correction level is used.
   * The smallest possible QR Code version is automatically chosen for the output.
   * The ECC level of the result may be higher than the ecl argument if it can be done without increasing the version.
   */
  static from(content: string | URL | Uint8Array, { output = "array", border = 2, light = "white", dark = "black", ecl = "MEDIUM" }: { output?: string } & options = {}) {
    border = Math.max(0, border)
    const qr = QrCode.#encode(Segment.from(content instanceof URL ? content.href : content), { ecl })
    const size = qr.size + border * 2
    switch (output) {
      case "svg": {
        const paths = [] as string[]
        for (let y = 0; y < qr.size; y++) {
          for (let x = 0; x < qr.size; x++) {
            if (qr.get({ x, y })) {
              paths.push(`M${x + border * 2},${y + border * 2}h1v1h-1z`)
            }
          }
        }
        return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${size} ${size}" stroke="none"><rect width="100%" height="100%" fill="${light}"/><path d="${paths.join(" ")}" fill="${dark}"/></svg>`
      }
      case "console": {
        for (let y = 0; y < size; y++) {
          const line = "%c\u2588\u2588".repeat(size)
          const colors = [] as string[]
          for (let x = 0; x < size; x++) {
            colors.push(`color: ${qr.get({ x: x - border, y: y - border }) ? dark : light}`)
          }
          console.log(line, ...colors)
        }
        return
      }
      default: {
        const data = [] as boolean[][]
        for (let y = 0; y < size; y++) {
          data[y] = new Array(size).fill(false)
          for (let x = 0; x < size; x++) {
            data[y][x] = qr.get({ x: x - border, y: y - border })
          }
        }
        return data
      }
    }
  }

  /**
   * Returns a QR Code representing the given segments with the given encoding parameters.
   * The smallest possible QR Code version within the given range is automatically chosen for the output.
   * Iff boostEcl is true, then the ECC level of the result may be higher than the ecl argument if it can be done without increasing the version.
   * The mask number is either between 0 to 7 (inclusive) to force that mask, or -1 to automatically choose an appropriate mask (which may be slow).
   * This function allows the user to create a custom sequence of segments that switches between modes (such as alphanumeric and byte) to encode text in less space.
   */
  static #encode(segments: Readonly<Segment[]>, { ecl }: { ecl: keyof typeof QrCode.ERROR_CORRECTION_LEVEL }) {
    // Find the minimal version number to use
    const ECL = QrCode.ERROR_CORRECTION_LEVEL[ecl]
    let version = 1
    let databits = 0
    for (;; version++) {
      const capacity = 8 * (Math.floor(QrCode.#DATA_BITS[version] / 8) - ECL.ECC_PER_BLOCK[version] * ECL.ECC_BLOCKS[version])
      let used = 0
      for (const segment of segments) {
        const width = segment.width(version)
        if (segment.length >= (1 << width)) {
          used = Infinity
        }
        used += 4 + width + segment.data.length
      }
      if (used <= capacity) {
        databits = used
        break
      }
      if (version >= QrCode.#VERSION_MAX) {
        throw new RangeError("Data too long")
      }
    }

    // Increase the error correction level while the data still fits in the current version number
    for (const level of ["MEDIUM", "QUARTILE", "HIGH"] as const) {
      const ECL = QrCode.ERROR_CORRECTION_LEVEL[level]
      if (databits <= 8 * (Math.floor(QrCode.#DATA_BITS[version] / 8) - ECL.ECC_PER_BLOCK[version] * ECL.ECC_BLOCKS[version])) {
        ecl = level
      }
    }

    // Concatenate all segments to create the data bit string
    const bits = [] as number[]
    for (const segment of segments) {
      append({ bits, length: 4, value: segment.mode.id })
      append({ bits, length: segment.width(version), value: segment.length })
      bits.push(...segment.data)
    }

    // Add terminator and pad up to a byte if applicable
    const capacity = 8 * (Math.floor(QrCode.#DATA_BITS[version] / 8) - ECL.ECC_PER_BLOCK[version] * ECL.ECC_BLOCKS[version])
    append({ bits, length: Math.min(4, capacity - bits.length), value: 0 })
    append({ bits, length: (8 - bits.length % 8) % 8, value: 0 })

    // Pad with alternating bytes until data capacity is reached
    for (let padding = 0xEC; bits.length < capacity; padding ^= 0xEC ^ 0x11) {
      append({ bits, length: 8, value: padding })
    }

    // Pack bits into bytes in big endian
    const data = [] as number[]
    while (data.length * 8 < bits.length) {
      data.push(0)
    }
    bits.forEach((b, i) => data[i >>> 3] |= b << (7 - (i & 7)))

    // Create the QR Code object
    const mode = ["", "numeric", "alphanumeric", "", "bytes"][segments[0]?.mode.id] ?? ""
    const length = segments.reduce((sum, segment) => sum + segment.length, 0)
    return new QrCode({ version, ecl, data, mode, length, databits })
  }

  /** Constructor. */
  private constructor({ version, ecl, data, mode, length, databits }: { version: number; ecl: keyof typeof QrCode.ERROR_CORRECTION_LEVEL; data: Readonly<number[]>; mode: string; length: number; databits: number }) {
    this.version = version
    this.size = this.version * 4 + 17
    this.ecl = ecl
    this.mode = mode
    this.length = length
    this.databits = databits
    this.#ecl = QrCode.ERROR_CORRECTION_LEVEL[ecl]
    this.#modules = new Array(this.size).fill(null).map(() => new Array(this.size).fill(false)) as boolean[][]
    this.#functions = new Array(this.size).fill(null).map(() => new Array(this.size).fill(false)) as boolean[][]
    this.#drawPatterns()
    this.#drawData(this.#interleave(data))
    let mask = 0
    let min = Infinity
    for (let i = 0; i < 8; i++) {
      this.#mask({ mask: i })
      this.#drawFormat({ mask: i })
      const penalty = this.#penalty()
      if (penalty < min) {
        mask = i
        min = penalty
      }
      this.#mask({ mask: i })
    }
    this.mask = mask
    this.#mask(this)
    this.#drawFormat(this)
    this.#functions.length = 0
  }

  /** Sets the color of a module and marks it as a function module. */
  #set({ x, y, color }: { x: number; y: number; color: boolean }) {
    this.#modules[y][x] = color
    this.#functions[y][x] = true
  }

  /**
   * Returns the color of the module (pixel) at the given coordinates, which is false for light or true for dark.
   * The top left corner has the coordinates (x=0, y=0).
   * If the given coordinates are out of bounds, then false (light) is returned.
   */
  get({ x, y }: { x: number; y: number }) {
    return (0 <= x) && (x < this.size) && (0 <= y) && (y < this.size) && (this.#modules[y][x])
  }

  /** Describes how a segment's data bits are interpreted. */
  readonly mode

  /** Number of characters count. */
  readonly length

  /** Number of data bits. */
  readonly databits

  /**
   * The version number of this QR Code, which is between 1 and 40 (inclusive).
   * This determines the size of this barcode.
   */
  readonly version

  /**
   * The width and height of this QR Code, measured in modules, between 21 and 177 (inclusive).
   * This is equal to version * 4 + 17.
   */
  readonly size

  /** The error correction level used in this QR Code. */
  readonly ecl

  /** The error correction level used in this QR Code. */
  readonly #ecl

  /**
   * The index of the mask pattern used in this QR Code, which is between 0 and 7 (inclusive).
   * Even if a QR Code is created with automatic masking requested (mask = -1),
   * the resulting object still has a mask value between 0 and 7.
   */
  readonly mask

  /** The modules of this QR Code (false = light, true = dark). */
  readonly #modules

  /** Indicates function modules that are not subjected to masking. */
  readonly #functions

  /** Reads this object's version field, and draws and marks all function modules. */
  #drawPatterns() {
    // Draw horizontal and vertical timing patterns
    for (let i = 0; i < this.size; i++) {
      this.#set({ x: 6, y: i, color: !(i % 2) })
      this.#set({ x: i, y: 6, color: !(i % 2) })
    }

    // Draw 3 finder patterns (all corners except bottom right)
    this.#drawFinder({ x: 3, y: 3 })
    this.#drawFinder({ x: this.size - 4, y: 3 })
    this.#drawFinder({ x: 3, y: this.size - 4 })

    // Draw alignment patterns (except on the three finder corners)
    const alignments = QrCode.#ALIGNEMENTS[this.version]
    for (let i = 0; i < alignments.length; i++) {
      for (let j = 0; j < alignments.length; j++) {
        if (!(((i === 0) && (j === 0)) || ((i === 0) && (j === alignments.length - 1)) || ((i === alignments.length - 1) && (j === 0)))) {
          this.#drawAlignment({ x: alignments[i], y: alignments[j] })
        }
      }
    }

    // Draw configuration data
    this.#drawFormat()
    this.#drawVersion()
  }

  /** Draws a 9*9 finder pattern including the border separator with the center module at (x, y). */
  #drawFinder({ x: ox, y: oy }: { x: number; y: number }) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy))
        const x = ox + dx
        const y = oy + dy
        if ((0 <= x) && (x < this.size) && (0 <= y) && (y < this.size)) {
          this.#set({ x: x, y: y, color: (d !== 2) && (d !== 4) })
        }
      }
    }
  }

  /** Draws a 5*5 alignment pattern with the center module at (x, y). */
  #drawAlignment({ x, y }: { x: number; y: number }) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        this.#set({ x: x + dx, y: y + dy, color: Math.max(Math.abs(dx), Math.abs(dy)) !== 1 })
      }
    }
  }

  /** Draws two copies of the format bits (with its own error correction code) based on the given mask and this object's error correction level field. */
  #drawFormat({ mask = 0 } = {}) {
    // Calculate error correction code and pack bits
    const data = this.#ecl.format << 3 | mask
    let rem = data
    for (let i = 0; i < 10; i++) {
      rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
    }
    const bits = (data << 10 | rem) ^ 0x5412

    // Draw first copy
    for (let i = 0; i <= 5; i++) {
      this.#set({ x: 8, y: i, color: bit(bits, i) })
    }
    this.#set({ x: 8, y: 7, color: bit(bits, 6) })
    this.#set({ x: 8, y: 8, color: bit(bits, 7) })
    this.#set({ x: 7, y: 8, color: bit(bits, 8) })
    for (let i = 9; i < 15; i++) {
      this.#set({ x: 14 - i, y: 8, color: bit(bits, i) })
    }

    // Draw second copy
    for (let i = 0; i < 8; i++) {
      this.#set({ x: this.size - 1 - i, y: 8, color: bit(bits, i) })
    }
    for (let i = 8; i < 15; i++) {
      this.#set({ x: 8, y: this.size - 15 + i, color: bit(bits, i) })
    }
    this.#set({ x: 8, y: this.size - 8, color: true })
  }

  /** Draws two copies of the version bits (with its own error correction code) based on this object's version field, iff 7 <= version <= 40. */
  #drawVersion() {
    if (this.version < 7) {
      return
    }

    // Calculate error correction code and pack bits
    let rem = this.version
    for (let i = 0; i < 12; i++) {
      rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25)
    }
    const bits = this.version << 12 | rem

    // Draw copies
    for (let i = 0; i < 18; i++) {
      const color = bit(bits, i)
      const a = this.size - 11 + i % 3
      const b = Math.floor(i / 3)
      this.#set({ x: a, y: b, color })
      this.#set({ x: b, y: a, color })
    }
  }

  /**
   * Returns a new byte string representing the given data with the appropriate error correction codewords appended to it, based on this object's version and error correction level.
   */
  #interleave(data: Readonly<number[]>) {
    // Calculate parameter numbers
    const ecc = { blocks: this.#ecl.ECC_BLOCKS[this.version], length: this.#ecl.ECC_PER_BLOCK[this.version] }
    const codewords = Math.floor(QrCode.#DATA_BITS[this.version] / 8)
    const short = { blocks: ecc.blocks - codewords % ecc.blocks, length: Math.floor(codewords / ecc.blocks) }

    // Split data into blocks and append ECC to each block
    const blocks = [] as number[][]
    const divisor = divisorReedSolomon(ecc.length)
    for (let i = 0, k = 0; i < ecc.blocks; i++) {
      const block = data.slice(k, k + short.length - ecc.length + (i < short.blocks ? 0 : 1))
      k += block.length
      const remainder = remainderReedSolomon(block, divisor)
      if (i < short.blocks) {
        block.push(0)
      }
      blocks.push(block.concat(remainder))
    }

    // Interleave (not concatenate) the bytes from every block into a single sequence
    const result = [] as number[]
    for (let i = 0; i < blocks[0].length; i++) {
      blocks.forEach((block, j) => {
        if ((i !== short.length - ecc.length) || (j >= short.blocks)) {
          result.push(block[i])
        }
      })
    }
    return result
  }

  /**
   * Draws the given sequence of 8-bit codewords (data and error correction) onto the entire data area of this QR Code.
   * Function modules need to be marked off before this is called.
   */
  #drawData(data: Readonly<number[]>) {
    for (let i = 0, h = this.size - 1; h >= 1; h -= 2) {
      if (h === 6) {
        h = 5
      }
      for (let v = 0; v < this.size; v++) {
        for (let j = 0; j < 2; j++) {
          const x = h - j
          const y = !((h + 1) & 2) ? this.size - 1 - v : v
          if ((!this.#functions[y][x]) && (i < data.length * 8)) {
            this.#modules[y][x] = bit(data[i >>> 3], 7 - (i & 7))
            i++
          }
        }
      }
    }
  }

  /**
   * XORs the codeword modules in this QR Code with the given mask pattern.
   * The function modules must be marked and the codeword bits must be drawn before masking. Due to the arithmetic of XOR, calling applyMask() with the same mask value a second time will undo the mask.
   * A final well-formed QR Code needs exactly one (not zero, two, etc.) mask applied.
   */
  #mask({ mask }: { mask: number }) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let invert = false
        switch (mask) {
          case 0:
            invert = !((x + y) % 2)
            break
          case 1:
            invert = !(y % 2)
            break
          case 2:
            invert = !(x % 3)
            break
          case 3:
            invert = !((x + y) % 3)
            break
          case 4:
            invert = !((Math.floor(x / 3) + Math.floor(y / 2)) % 2)
            break
          case 5:
            invert = !(x * y % 2 + x * y % 3)
            break
          case 6:
            invert = !((x * y % 2 + x * y % 3) % 2)
            break
          case 7:
            invert = !(((x + y) % 2 + x * y % 3) % 2)
            break
        }
        if (invert && (!this.#functions[y][x])) {
          this.#modules[y][x] = !this.#modules[y][x]
        }
      }
    }
  }

  /**
   * Calculates and returns the penalty score based on state of this QR Code's current modules.
   * This is used by the automatic mask choice algorithm to find the mask pattern that yields the lowest score.
   */
  #penalty() {
    let result = 0

    // Adjacent modules in row having same color, and finder-like patterns
    for (let y = 0; y < this.size; y++) {
      let color = false
      let xy = 0
      const history = [0, 0, 0, 0, 0, 0, 0]
      for (let x = 0; x < this.size; x++) {
        if (this.#modules[y][x] === color) {
          xy++
          if (xy === 5) {
            result += QrCode.#PENALTY[0]
          } else if (xy > 5) {
            result++
          }
        } else {
          this.#penaltyRegister({ xy, history })
          if (!color) {
            result += this.#penaltyPatterns({ history }) * QrCode.#PENALTY[2]
          }
          color = this.#modules[y][x]
          xy = 1
        }
      }
      result += this.#penaltyCount({ xy, color, history }) * QrCode.#PENALTY[2]
    }

    // Adjacent modules in column having same color, and finder-like patterns
    for (let x = 0; x < this.size; x++) {
      let color = false
      let xy = 0
      const history = [0, 0, 0, 0, 0, 0, 0]
      for (let y = 0; y < this.size; y++) {
        if (this.#modules[y][x] === color) {
          xy++
          if (xy === 5) {
            result += QrCode.#PENALTY[0]
          } else if (xy > 5) {
            result++
          }
        } else {
          this.#penaltyRegister({ xy, history })
          if (!color) {
            result += this.#penaltyPatterns({ history }) * QrCode.#PENALTY[2]
          }
          color = this.#modules[y][x]
          xy = 1
        }
      }
      result += this.#penaltyCount({ xy, color, history }) * QrCode.#PENALTY[2]
    }

    // 2*2 blocks of modules having same color
    for (let y = 0; y < this.size - 1; y++) {
      for (let x = 0; x < this.size - 1; x++) {
        const color = this.#modules[y][x]
        if ((color === this.#modules[y][x + 1]) && (color === this.#modules[y + 1][x]) && (color === this.#modules[y + 1][x + 1])) {
          result += QrCode.#PENALTY[1]
        }
      }
    }

    // Balance of dark and light modules
    let dark = 0
    for (const row of this.#modules) {
      dark = row.reduce((sum, color) => sum + (color ? 1 : 0), dark)
    }
    const total = this.size * this.size
    const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1
    result += k * QrCode.#PENALTY[3]
    return result
  }

  /** Can only be called immediately after a light run is added, and returns either 0, 1, or 2. */
  #penaltyPatterns({ history }: { history: number[] }) {
    const n = history[1]
    const core = (n > 0) && (history[2] === n) && (history[3] === n * 3) && (history[4] === n) && (history[5] === n)
    return ((core && (history[0] >= n * 4) && (history[6] >= n)) ? 1 : 0) + ((core && (history[6] >= n * 4) && (history[0] >= n)) ? 1 : 0)
  }

  /** Must be called at the end of a line (row or column) of modules. */
  #penaltyCount({ xy, color, history }: { xy: number; color: boolean; history: number[] }) {
    if (color) {
      this.#penaltyRegister({ xy, history })
      xy = 0
    }
    xy += this.size
    this.#penaltyRegister({ xy, history })
    return this.#penaltyPatterns({ history })
  }

  /** Pushes the given value to the front and drops the last value. */
  #penaltyRegister({ xy, history }: { xy: number; history: number[] }) {
    if (history[0] === 0) {
      xy += this.size
    }
    history.pop()
    history.unshift(xy)
  }

  /** The minimum version number supported in the QR Code Model 2 standard. */
  static readonly #VERSION_MIN = 1

  /** The maximum version number supported in the QR Code Model 2 standard. */
  static readonly #VERSION_MAX = 40

  /**
   * The error correction level in a QR Code symbol.
   *
   * The QR Code can tolerate about:
   * - LOW: 7% erroneous codewords
   * - MEDIUM: 15% erroneous codewords
   * - QUARTILE: 25% erroneous codewords
   * - HIGH: 30% erroneous codewords
   */
  static readonly ERROR_CORRECTION_LEVEL = {
    LOW: {
      ECC_PER_BLOCK: [NaN, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
      ECC_BLOCKS: [NaN, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],

      format: 1,
    },
    MEDIUM: {
      ECC_PER_BLOCK: [NaN, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
      ECC_BLOCKS: [NaN, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
      format: 0,
    },
    QUARTILE: {
      ECC_PER_BLOCK: [NaN, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
      ECC_BLOCKS: [NaN, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
      format: 3,
    },
    HIGH: {
      ECC_PER_BLOCK: [NaN, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
      ECC_BLOCKS: [NaN, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
      format: 2,
    },
  }

  /**
   * Returns an ascending list of positions of alignment patterns for this version number.
   * Each position is in the range [0,177), and are used on both the x and y axes.
   */
  static readonly #ALIGNEMENTS = [
    [],
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170],
  ]

  /**
   * Number of data bits that can be stored in a QR Code of the given version number, after all function modules are excluded.
   * This includes remainder bits, so it might not be a multiple of 8.
   */
  static readonly #DATA_BITS = [
    NaN,
    208,
    359,
    567,
    807,
    1079,
    1383,
    1568,
    1936,
    2336,
    2768,
    3232,
    3728,
    4256,
    4651,
    5243,
    5867,
    6523,
    7211,
    7931,
    8683,
    9252,
    10068,
    10916,
    11796,
    12708,
    13652,
    14628,
    15371,
    16411,
    17483,
    18587,
    19723,
    20891,
    22091,
    23008,
    24272,
    25568,
    26896,
    28256,
    29648,
  ]

  /** For use in penalty score, when evaluating which mask is best. */
  static readonly #PENALTY = [3, 3, 40, 10]
}

/**
 * A segment of character/binary/control data in a QR Code symbol.
 * This segment class imposes no length restrictions, but QR Codes have restrictions.
 * Even in the most favorable conditions, a QR Code can only hold 7089 characters of data.
 * Any segment longer than this is meaningless for the purpose of generating QR Codes.
 */
class Segment {
  /** Returns a segment representing the given string of decimal digits encoded in numeric mode. */
  static #numeric(content: string) {
    const bits = [] as number[]
    for (let i = 0; i < content.length;) {
      const n = Math.min(content.length - i, 3)
      append({ bits, length: n * 3 + 1, value: parseInt(content.substring(i, i + n), 10) })
      i += n
    }
    return new Segment({ mode: { id: 0x1, widths: [10, 12, 14] }, length: content.length, bits })
  }

  /**
   * Returns a segment representing the given text string encoded in alphanumeric mode.
   * The characters allowed are: 0 to 9, A to Z (uppercase only), space, dollar, percent, asterisk, plus, hyphen, period, slash, colon.
   */
  static #alphanumeric(content: string) {
    const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:"
    const bits = [] as number[]
    let i
    for (i = 0; i + 2 <= content.length; i += 2) {
      append({ bits, length: 11, value: charset.indexOf(content.charAt(i)) * 45 + charset.indexOf(content.charAt(i + 1)) })
    }
    if (i < content.length) {
      append({ bits, length: 6, value: charset.indexOf(content.charAt(i)) })
    }
    return new Segment({ mode: { id: 0x2, widths: [9, 11, 13] }, length: content.length, bits })
  }

  /**
   * Returns a segment representing the string data encoded in byte mode.
   * Any text string can be converted to UTF-8 bytes and encoded as a byte mode segment.
   */
  static #utfbytes(content: string) {
    return this.#bytes(encoder.encode(content))
  }

  /**
   * Returns a segment representing the given binary data encoded in byte mode.
   */
  static #bytes(content: Uint8Array) {
    const bits = [] as number[]
    for (const byte of content) {
      append({ bits, length: 8, value: byte })
    }
    return new Segment({ mode: { id: 0x4, widths: [8, 16, 16] }, length: content.length, bits })
  }

  /**
   * Returns a new mutable list of zero or more segments to represent the given Unicode text string.
   * The result may use various segment modes and switch modes to optimize the length of the bit stream.
   */
  static from(content: string | Uint8Array) {
    if (content instanceof Uint8Array) {
      return [Segment.#bytes(content)]
    }
    switch (true) {
      case !content.length:
        return []
      case /^[0-9]*$/.test(content):
        return [Segment.#numeric(content)]
      case /^[A-Z0-9 $%*+.\/:-]*$/.test(content):
        return [Segment.#alphanumeric(content)]
      default:
        return [Segment.#utfbytes(content)]
    }
  }

  /** Constructor. */
  constructor({ mode, length, bits }: { mode: { id: number; widths: [number, number, number] }; length: number; bits: number[] }) {
    this.mode = mode
    this.length = length
    this.#bits = bits.slice()
  }

  /** The mode indicator of this segment. */
  readonly mode

  /**
   * The length of this segment's unencoded data. Measured in characters for numeric/alphanumeric/kanji mode, bytes for byte mode, and 0 for ECI mode.
   * Always zero or positive.
   * Not the same as the data's bit length.
   */
  readonly length

  /** The data bits of this segment. */
  readonly #bits

  /** Get a new copy of the data bits of this segment. */
  get data() {
    return this.#bits.slice()
  }

  /**
   * Returns the bit width of the character count field for a segment in this mode in a QR Code at the given version number.
   * The result is in the range [0, 16].
   */
  width(version: number) {
    return this.mode.widths[Math.floor((version + 7) / 17)]
  }
}

/**
 * Returns a Reed-Solomon ECC generator polynomial for the given degree.
 */
function divisorReedSolomon(degree: number) {
  const result = [...new Array(degree - 1).fill(0), 1]
  for (let i = 0, root = 1; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = productReedSolomon(result[j], root)
      if (j + 1 < result.length) {
        result[j] ^= result[j + 1]
      }
    }
    root = productReedSolomon(root, 0x02)
  }
  return result
}

/**
 * Returns the Reed-Solomon error correction codeword for the given data and divisor polynomials.
 */
function remainderReedSolomon(data: Readonly<number[]>, divisor: Readonly<number[]>) {
  const result = divisor.map((_) => 0)
  for (const n of data) {
    const factor = n ^ result.shift()!
    result.push(0)
    divisor.forEach((coefficient, i) => result[i] ^= productReedSolomon(coefficient, factor))
  }
  return result
}

/**
 * Returns the product of the two given field elements modulo GF(2^8/0x11D).
 * The arguments and result are unsigned 8-bit integers.
 */
function productReedSolomon(a: number, b: number) {
  let r = 0
  for (let i = 7; i >= 0; i--) {
    r = (r << 1) ^ ((r >>> 7) * 0x11D)
    r ^= ((b >>> i) & 1) * a
  }
  return r
}

/**
 * Returns true iff the i'th bit of x is set to 1.
 */
function bit(x: number, i: number): boolean {
  return ((x >>> i) & 1) > 0
}

/**
 * Appends the given number of low-order bits of the given value to the given buffer.
 * Requires 0 <= len <= 31 and 0 <= val < 2^len.
 */
function append({ bits, length, value }: { bits: number[]; length: number; value: number }) {
  for (let i = length - 1; i >= 0; i--) {
    bits.push((value >>> i) & 1)
  }
}
