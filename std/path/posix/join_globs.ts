import type { GlobOptions as _interface_GlobOptions } from "jsr:@std/path@1.0.3/posix/join-globs"
/**
 * Options for {@linkcode globToRegExp}, {@linkcode joinGlobs},
 * {@linkcode normalizeGlob} and {@linkcode expandGlob}.
 */
interface GlobOptions extends _interface_GlobOptions {}
export type { GlobOptions }

import { joinGlobs as _function_joinGlobs } from "jsr:@std/path@1.0.3/posix/join-globs"
/**
 * Like join(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { joinGlobs } from "@std/path/posix/join-globs";
 * import { assertEquals } from "@std/assert";
 *
 * const path = joinGlobs(["foo", "bar", "**"], { globstar: true });
 * assertEquals(path, "foo/bar/**");
 * ```
 *
 * @param globs The globs to join.
 * @param options The options to use.
 * @return The joined path.
 */
const joinGlobs = _function_joinGlobs as typeof _function_joinGlobs
export { joinGlobs }
