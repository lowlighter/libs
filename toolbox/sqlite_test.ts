// deno-lint-ignore-file no-external-import
import { DatabaseSync } from "node:sqlite"
import { expect, test } from "@libs/testing"
import { deserialize, serialize } from "./sqlite.ts"

test("`serialize()` and `deserialize()` round-trip mixed records", () => {
  const data = {
    id: 1,
    string: "text",
    number: 42,
    bigint: 42n,
    trueBool: true,
    falseBool: false,
    undefinedValue: undefined,
    nullValue: null,
    object: { nested: [1, 2, 3] },
    symbol: Symbol("secret"),
    fn: () => "ignored",
  }
  // Serialize
  const serialized = serialize(data)
  expect(serialized.string).toBe("text")
  expect(serialized.number).toBe(42)
  expect(serialized.bigint).toBe(42n)
  expect(serialized.trueBool).toBe(1)
  expect(serialized.falseBool).toBe(0)
  expect(serialized.undefinedValue).toBeNull()
  expect(serialized.object).toBeInstanceOf(Uint8Array)
  expect(serialized.nullValue).toBeInstanceOf(Uint8Array)
  expect(serialized).not.toHaveProperty("symbol")
  expect(serialized).not.toHaveProperty("fn")
  using database = new DatabaseSync(":memory:")
  database.exec("CREATE TABLE test (id INTEGER PRIMARY KEY, string TEXT, number INTEGER, bigint INTEGER, trueBool INTEGER, falseBool INTEGER, undefinedValue BLOB, nullValue BLOB, object BLOB)")
  database.prepare("INSERT INTO test (id, string, number, bigint, trueBool, falseBool, undefinedValue, nullValue, object) VALUES (@id, @string, @number, @bigint, @trueBool, @falseBool, @undefinedValue, @nullValue, @object)").run(serialized)
  // Deserialize
  const row = database.prepare("SELECT * FROM test WHERE id = ?").get(1)
  const deserialized = deserialize(row!, { booleans: ["trueBool", "falseBool"], optional: ["undefinedValue"] })
  expect(deserialized.string).toBe("text")
  expect(deserialized.number).toBe(42)
  expect(deserialized.bigint).toBe(42)
  expect(deserialized.trueBool).toBe(true)
  expect(deserialized.falseBool).toBe(false)
  expect(deserialized.undefinedValue).toBeUndefined()
  expect(deserialized.nullValue).toBeNull()
  expect(deserialized.object).toEqual({ nested: [1, 2, 3] })
})
