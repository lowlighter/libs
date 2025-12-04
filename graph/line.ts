// Imports
import { type data, type datalist, graph, type options } from "./_graph.ts"
export type { data, datalist, options }

/**
 * Renders a line graph.
 *
 * ```ts
 * line({
 *   A: {
 *     data: [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 3, y: 4 }],
 *   },
 *   B: {
 *     data: [{ x: 0.5, y: 1.5, text: "B0" }, { x: 2.5, y: 2, text: "B1" }],
 *   },
 * })
 * ```
 */
export function line(datalist: datalist, options?: options): string {
  return graph("line", datalist, options)
}
