import { resolve as _function_resolve } from "jsr:@std/path@1.0.6/posix/resolve"
/**
 * Resolves path segments into a `path`.
 *
 * @example Usage
 * ```ts
 * import { resolve } from "@std/path/posix/resolve";
 * import { assertEquals } from "@std/assert";
 *
 * const path = resolve("/foo", "bar", "baz/asdf", "quux", "..");
 * assertEquals(path, "/foo/bar/baz/asdf");
 * ```
 *
 * @param pathSegments The path segments to resolve.
 * @return The resolved path.
 */
const resolve = _function_resolve as typeof _function_resolve
export { resolve }
