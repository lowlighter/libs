// Imports
import { type data, type datalist, graph, type options } from "./_graph.ts"
export type { data, datalist, options }

/**
 * Renders a time-based graph.
 *
 * ```ts
 * time({
 *   A: {
 *     data: [{ x: new Date("2000"), y: 1 }, { x: new Date("2010"), y: 2 }, { x: new Date("2020"), y: 1 }, { x: new Date("2030"), y: 4 }],
 *   },
 *   B: {
 *     data: [{ x: new Date("2005"), y: 1.5, text: "B0" }, { x: new Date("2025"), y: 2, text: "B1" }],
 *   },
 * })
 * ```
 */
export function time(datalist: datalist, options?: options): string {
  return graph("time", datalist, options)
}
