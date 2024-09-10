import { isGlob as _function_isGlob } from "jsr:@std/path@1.0.4/is-glob"
/**
 * Test whether the given string is a glob.
 *
 * @example Usage
 * ```ts
 * import { isGlob } from "@std/path/is-glob";
 * import { assert } from "@std/assert";
 *
 * assert(!isGlob("foo/bar/../baz"));
 * assert(isGlob("foo/*ar/../baz"));
 * ```
 *
 * @param str String to test.
 * @return `true` if the given string is a glob, otherwise `false`
 */
const isGlob = _function_isGlob as typeof _function_isGlob
export { isGlob }
