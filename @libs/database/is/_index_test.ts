// Imports
import { expect } from "@libs/testing"
import { Database, Type } from "../database.ts"
import { expressions } from "./_index.ts"

for (const type of [Type.SQLite, Type.PostgreSQL]) {
  Deno.test(`${Type[type]} canonical pair expressions preserve fixed columns and quote identifiers`, () => {
    const tuples = [["scope", 'a"id', "b"], ["scope", "b", 'a"id']]
    const pair = type === Type.SQLite ? ['min("a""id", "b")', 'max("a""id", "b")'] : ['(LEAST("a""id", "b"))', '(GREATEST("a""id", "b"))']
    expect(expressions(tuples, type)).toEqual(['"scope"', ...pair])
  })
  Deno.test(`${Type[type]} canonical rotations use lexicographic comparisons`, () => {
    const tuples = [["scope", "a", "b", "c"], ["scope", "b", "c", "a"], ["scope", "c", "a", "b"]]
    const result = expressions(tuples, type)
    expect(result[0]).toBe('"scope"')
    expect(result[1]).toBe('(CASE WHEN ("a", "b", "c") <= ("b", "c", "a") AND ("a", "b", "c") <= ("c", "a", "b") THEN "a" WHEN ("b", "c", "a") <= ("a", "b", "c") AND ("b", "c", "a") <= ("c", "a", "b") THEN "b" ELSE "c" END)')
    expect(result).toHaveLength(4)
  })
}

for (const tuples of [[], [["a"]], [[], []], [["a", "a"], ["a", "a"]], [["a", "b"], ["b"]], [["a", "b"], ["b", "b"]], [["a", "b"], ["b", "c"]], [["a", "b"], ["a", "b"]], [["a", "b", "c"], ["b", "c", "a"]]]) {
  Deno.test(`canonical indexes reject invalid arrangements ${JSON.stringify(tuples)}`, () => {
    expect(() => expressions(tuples, Type.SQLite)).toThrow(TypeError)
  })
}

Deno.test("canonical tuples retain middle values, multiplicity, and selected symmetry", async () => {
  await using database = new Database()
  const rotations = [["a", "b", "c"], ["b", "c", "a"], ["c", "a", "b"]]
  const permutations = [...rotations, ["a", "c", "b"], ["c", "b", "a"], ["b", "a", "c"]]
  for (const tuples of [rotations, permutations]) {
    const statement = database.prepare(`SELECT ${expressions(tuples, Type.SQLite).map((expression, index) => `${expression} AS value${index}`).join(", ")} FROM (SELECT ? AS a, ? AS b, ? AS c)`)
    for (const values of [[1, 2, 4], [1, 3, 4], [1, 1, 4], [1, 4, 4], [4, 4, 4]]) {
      const expected = await statement.run(...values)
      expect(Object.values(expected[0])).toEqual(values)
      for (const tuple of tuples)
        expect(await statement.run(...tuple.map((column) => values[rotations[0].indexOf(column)]))).toEqual(expected)
    }
    const reversed = (await statement.run(1, 4, 2))[0]
    expect(Object.values(reversed)).toEqual(tuples === rotations ? [1, 4, 2] : [1, 2, 4])
  }
})

Deno.test("canonical tuples support correlated swaps beyond two columns", async () => {
  await using database = new Database()
  const tuples = [["a", "b", "c", "d"], ["b", "a", "d", "c"]]
  const statement = database.prepare(`SELECT ${expressions(tuples, Type.SQLite).map((expression, index) => `${expression} AS value${index}`).join(", ")} FROM (SELECT ? AS a, ? AS b, ? AS c, ? AS d)`)
  expect(await statement.run(1, 2, 3, 4)).toEqual(await statement.run(2, 1, 4, 3))
  expect(await statement.run(1, 2, 3, 4)).not.toEqual(await statement.run(2, 1, 3, 4))
  expect(await statement.run(1, 1, 4, 3)).toEqual(await statement.run(1, 1, 3, 4))
})
