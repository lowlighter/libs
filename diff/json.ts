/**
 * Compute and apply unified patches on any JSON-serializable value.
 *
 * Values are serialized using {@link JSON.stringify} with a two-space indentation, so that the resulting
 * multi-line representation can be diffed line-by-line and parsed back after being patched.
 *
 * @module
 */

// Imports
import { diff as diffText, type DiffOptions } from "./diff.ts"
import { apply as applyText } from "./apply.ts"
export type { DiffOptions }

/**
 * Compute a unified patch between two JSON-serializable values.
 *
 * Both values are serialized to a pretty-printed JSON representation before being diffed, so the resulting
 * patch describes the textual changes between the two objects.
 *
 * ```ts
 * import { diff } from "./json.ts"
 * diff({ name: "foo", version: 1 }, { name: "foo", version: 2 }) // Returns the following unified patch:
 * ```
 * ```diff
 * --- a
 * +++ b
 * \@@ -1,4 +1,4 \@@
 *  {
 *    "name": "foo",
 * -  "version": 1
 * +  "version": 2
 *  }
 * \ No newline at end of file
 * ```
 */
export function diff(a: unknown, b: unknown, options?: DiffOptions): string {
  return diffText(JSON.stringify(a, null, 2), JSON.stringify(b, null, 2), options)
}

/**
 * Apply a unified patch (produced by {@link diff}) back onto a JSON-serializable value.
 *
 * The value is serialized the same way as in {@link diff}, the patch is applied to the resulting text, and the
 * patched text is parsed back into an object. The returned type defaults to the type of the provided value.
 *
 * ```ts
 * import { diff, apply } from "./json.ts"
 * const a = { name: "foo", version: 1 }
 * const b = { name: "foo", version: 2 }
 * const patch = diff(a, b)
 * apply(a, patch) // Returns { name: "foo", version: 2 }
 * ```
 */
export function apply<T>(a: T, patch: string): T {
  return JSON.parse(applyText(JSON.stringify(a, null, 2), patch)) as T
}
