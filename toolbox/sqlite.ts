// deno-lint-ignore-file no-external-import
import type { SQLInputValue } from "node:sqlite"
import * as v8 from "node:v8"

/** Serializes a record into a format suitable for database insertion. */
export function serialize(record: Record<string, unknown>): Record<string, SQLInputValue> {
  const serialized = {} as Record<string, SQLInputValue>
  for (const [key, value] of Object.entries(record)) {
    switch (typeof value) {
      case "undefined":
        serialized[key] = null
        continue
      case "boolean":
        serialized[key] = value ? 1 : 0
        continue
      case "symbol":
      case "function":
        continue
      case "object":
        serialized[key] = v8.serialize(value)
        continue
      case "number":
      case "string":
      case "bigint":
        serialized[key] = value
    }
  }
  return serialized
}

/** Deserializes a database record into a JavaScript object. */
export function deserialize<T = Record<string, unknown>>(record: Record<string, SQLInputValue>, options?: DeserializeOptions): T {
  const deserialized = {} as Record<string, unknown>
  for (const [key, value] of Object.entries(record)) {
    if (value instanceof Uint8Array) {
      deserialized[key] = v8.deserialize(value)
      continue
    }
    if (options?.booleans?.includes(key)) {
      deserialized[key] = Boolean(value)
      continue
    }
    if (options?.optional?.includes(key)) {
      deserialized[key] = value === null ? undefined : value
      continue
    }
    deserialized[key] = value
  }
  return deserialized as T
}

/** Options for deserialization. */
type DeserializeOptions = {
  /** List of keys that should be deserialized as booleans. */
  booleans: string[]
  /** List of keys that should be deserialized as optional values (i.e., `undefined` if `null`). */
  optional?: string[]
}
