/**
 * @module
 *
 * This module provides a vendor-specific implementation of sortable UUID v8,
 * described in the table below:
 *
 * | Field         | Width (bits) | Description                        |
 * | ------------- | ------------ | ---------------------------------- |
 * | unix_ts_ms    | 48           | Unix timestamp in milliseconds     |
 * | version       | 4            | The four-bit version number (1000) |
 * | resource_type | 12           | Resource type identifier           |
 * | variant       | 2            | The two-bit variant field (10)     |
 * | rand_bits     | 62           | Randomly generated bits            |
 *
 * Properties:
 * - Lexicographically sortable based on the timestamp component.
 * - Contains a 12-bit resource type identifier
 *   - Can be used to resolve the corresponding resource reviver from a UUID
 */

/** The nil UUID. */
export const nil = "00000000-0000-0000-0000-000000000000"

/** Generate options. */
export type GenerateOptions = {
  /** Unix timestamp in milliseconds (defaults to the current time). */
  timestamp?: number | bigint
  /** Randomly generated bits (defaults to a random 62-bit value, but can be overridden to have fixed value). */
  bits?: number | bigint
}

/** Generate a new UUID v8, masking integer inputs to their field widths. */
export function generate(type: number, { timestamp = Date.now(), bits = random() } = {} as GenerateOptions): string {
  const time = (BigInt(timestamp) & ((1n << 48n) - 1n)).toString(16).padStart(12, "0")
  const tail = ((BigInt(bits) & ((1n << 62n) - 1n)) | (2n << 62n)).toString(16)
  const resource = (BigInt(type) & ((1n << 12n) - 1n)).toString(16).padStart(3, "0")
  return `${time.slice(0, 8)}-${time.slice(8)}-8${resource}-${tail.slice(0, 4)}-${tail.slice(4)}`
}

/** Resolve a UUID v8 to its resource mapping. */
export function resolve<T extends Record<number, unknown>>(models: T, uuid: string): T[keyof T] {
  if ((uuid.length !== 36) || (!/^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)))
    throw new SyntaxError(`Unsupported UUID format: "${uuid}"`)
  const type = Number.parseInt(uuid.slice(15, 18), 16)
  if (!Object.hasOwn(models, type))
    throw new RangeError(`No mapping found for resource type ${type}`)
  return models[type] as T[keyof T]
}

/** Generate a cryptographically random 62-bit value. */
function random() {
  return new DataView(crypto.getRandomValues(new Uint8Array(8)).buffer).getBigUint64(0) & ((1n << 62n) - 1n)
}

/** UUID namespace. */
export const uuid = { nil, generate, resolve }
