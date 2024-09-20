import type { GlobOptions as _interface_GlobOptions } from "jsr:@std/path@1.0.6/windows/join-globs"
/**
 * Options for {@linkcode globToRegExp}, {@linkcode joinGlobs},
 * {@linkcode normalizeGlob} and {@linkcode expandGlob}.
 */
interface GlobOptions extends _interface_GlobOptions {}
export type { GlobOptions }

import { joinGlobs as _function_joinGlobs } from "jsr:@std/path@1.0.6/windows/join-globs"
/**
 * Like join(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 *
 * ```ts
 * import { joinGlobs } from "@std/path/windows/join-globs";
 * import { assertEquals } from "@std/assert";
 *
 * const joined = joinGlobs(["foo", "**", "bar"], { globstar: true });
 * assertEquals(joined, "foo\\**\\bar");
 * ```
 *
 * @param globs The globs to join.
 * @param options The options for glob pattern.
 * @return The joined glob pattern.
 */
const joinGlobs = _function_joinGlobs as typeof _function_joinGlobs
export { joinGlobs }
