import type { GlobOptions as _interface_GlobOptions } from "jsr:@std/path@1.0.2/posix/normalize-glob"
/**
 * Options for {@linkcode globToRegExp}, {@linkcode joinGlobs},
 * {@linkcode normalizeGlob} and {@linkcode expandGlob}.
 */
interface GlobOptions extends _interface_GlobOptions {}
export type { GlobOptions }

import { normalizeGlob as _function_normalizeGlob } from "jsr:@std/path@1.0.2/posix/normalize-glob"
/**
 * Like normalize(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { normalizeGlob } from "@std/path/posix/normalize-glob";
 * import { assertEquals } from "@std/assert";
 *
 * const path = normalizeGlob("foo/bar/../*", { globstar: true });
 * assertEquals(path, "foo/*");
 * ```
 *
 * @param glob The glob to normalize.
 * @param options The options to use.
 * @return The normalized path.
 */
const normalizeGlob = _function_normalizeGlob
export { normalizeGlob }
