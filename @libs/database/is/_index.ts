// Imports
import { Type } from "../database.ts"

/** Build canonical index expressions for a complete set of equivalent column arrangements. */
export function expressions(tuples: readonly (readonly string[])[], type: Type): string[] {
  const orders = permutations(tuples)
  const columns = tuples[0].map((column) => `"${column.replaceAll('"', '""')}"`)
  const moving = columns.map((_, index) => index).filter((index) => orders.some((order) => order[index] !== index))
  // A single swapped pair has compact, familiar conflict-target expressions
  if (moving.length === 2) {
    const pair = moving.map((index) => columns[index]).join(", ")
    const functions = type === Type.SQLite ? ["min", "max"] : ["LEAST", "GREATEST"]
    return columns.map((column, index) => {
      const position = moving.indexOf(index)
      if (position < 0)
        return column
      const expression = `${functions[position]}(${pair})`
      return type === Type.SQLite ? expression : `(${expression})`
    })
  }
  // Select the lexicographically smallest tuple, preserving every value and its multiplicity
  const rows = orders.map((order) => `(${moving.map((index) => columns[order[index]]).join(", ")})`)
  const conditions = rows.slice(0, -1).map((row, index) => rows.filter((_, other) => other !== index).map((other) => `${row} <= ${other}`).join(" AND "))
  return columns.map((column, index) => {
    if (!moving.includes(index))
      return column
    const cases = conditions.map((condition, position) => `WHEN ${condition} THEN ${columns[orders[position][index]]}`).join(" ")
    return `(CASE ${cases} ELSE ${columns[orders.at(-1)![index]]} END)`
  })
}

/** Validate permutations and closure so equivalent rows always select the same canonical tuple. */
function permutations(tuples: readonly (readonly string[])[]): number[][] {
  const columns = tuples[0]
  if ((tuples.length < 2) || (!columns.length) || (new Set(columns).size !== columns.length))
    throw new TypeError(`Equivalent indexes require at least two distinct, non-empty column tuples: ${JSON.stringify(tuples)}`)
  const orders = tuples.map((tuple) => {
    if ((tuple.length !== columns.length) || (new Set(tuple).size !== columns.length) || tuple.some((column) => !columns.includes(column)))
      throw new TypeError(`Equivalent tuple ${JSON.stringify(tuple)} must be a permutation of ${JSON.stringify(columns)}`)
    return tuple.map((column) => columns.indexOf(column))
  })
  const keys = new Set(orders.map((order) => order.join(",")))
  if (keys.size !== orders.length)
    throw new TypeError(`Equivalent index tuples must be distinct: ${JSON.stringify(tuples)}`)
  for (const first of orders) {
    for (const second of orders) {
      const order = second.map((index) => first[index])
      if (!keys.has(order.join(",")))
        throw new TypeError(`Equivalent index tuples are missing implied arrangement ${JSON.stringify(order.map((index) => columns[index]))}`)
    }
  }
  return orders
}
