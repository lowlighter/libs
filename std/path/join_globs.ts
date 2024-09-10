import type { GlobOptions as _interface_GlobOptions } from "jsr:@std/path@1.0.4/join-globs"
/**
 * Options for {@linkcode globToRegExp}, {@linkcode joinGlobs},
 * {@linkcode normalizeGlob} and {@linkcode expandGlob}.
 */
interface GlobOptions extends _interface_GlobOptions {}
export type { GlobOptions }

import { joinGlobs as _function_joinGlobs } from "jsr:@std/path@1.0.4/join-globs"
/**
 * Joins a sequence of globs, then normalizes the resulting glob.
 *
 * Behaves like {@linkcode https://jsr.io/@std/path/doc/~/join | join()}, but
 * doesn't collapse `**\/..` when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { joinGlobs } from "@std/path/join-globs";
 * import { assertEquals } from "@std/assert";
 *
 * if (Deno.build.os === "windows") {
 *   assertEquals(joinGlobs(["foo", "bar", "..", "baz"]), "foo\\baz");
 *   assertEquals(joinGlobs(["foo", "**", "bar", "..", "baz"], { globstar: true }), "foo\\**\\baz");
 * } else {
 *   assertEquals(joinGlobs(["foo", "bar", "..", "baz"]), "foo/baz");
 *   assertEquals(joinGlobs(["foo", "**", "bar", "..", "baz"], { globstar: true }), "foo/**\/baz");
 * }
 * ```
 *
 * @param globs Globs to be joined and normalized.
 * @param options Glob options.
 * @return The joined and normalized glob string.
 */
const joinGlobs = _function_joinGlobs as typeof _function_joinGlobs
export { joinGlobs }
