/**
 * This module contains a stringifier for XML data.
 * @module
 */
//Imports
import { Stringifier } from "./utils/stringifier.ts"
import type { StringifierOptions, udocument } from "./utils/types.ts"

/**
 * XML stringifier
 *
 * Convert a {@link udocument} into a `string`.
 *
 * {@link StringifierOptions} can be used to customize the stringifier behavior.
 *
 * @example
 * ```ts
 * import { stringify } from "./stringify.ts"
 *
 * console.log(stringify({
 *   root: {
 *     "#comment": "This is a comment",
 *     text: "hello",
 *     array: ["world", "monde", "世界", "🌏"],
 *     number: 42,
 *     boolean: true,
 *     complex: {
 *       "@attribute": "value",
 *       "#text": "content",
 *     },
 *   },
 * }))
 * ```
 */
export function stringify(content: udocument, options?: StringifierOptions): string {
  return new Stringifier(content, options).stringify()
}
