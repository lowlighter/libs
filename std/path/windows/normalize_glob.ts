import type { GlobOptions as _interface_GlobOptions } from "jsr:@std/path@1.0.2/windows/normalize-glob"
/**
 * Options for {@linkcode globToRegExp}, {@linkcode joinGlobs},
 * {@linkcode normalizeGlob} and {@linkcode expandGlob}.
 */
interface GlobOptions extends _interface_GlobOptions {}
export type { GlobOptions }

import { normalizeGlob as _function_normalizeGlob } from "jsr:@std/path@1.0.2/windows/normalize-glob"
/**
 * Like normalize(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { normalizeGlob } from "@std/path/windows/normalize-glob";
 * import { assertEquals } from "@std/assert";
 *
 * const normalized = normalizeGlob("**\\foo\\..\\bar", { globstar: true });
 * assertEquals(normalized, "**\\bar");
 * ```
 *
 * @param glob The glob pattern to normalize.
 * @param options The options for glob pattern.
 * @return The normalized glob pattern.
 */
const normalizeGlob = _function_normalizeGlob
export { normalizeGlob }
