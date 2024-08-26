import { resolve as _function_resolve } from "jsr:@std/path@1.0.2/windows/resolve"
/**
 * Resolves path segments into a `path`.
 *
 * @example Usage
 * ```ts
 * import { resolve } from "@std/path/windows/resolve";
 * import { assertEquals } from "@std/assert";
 *
 * const resolved = resolve("C:\\foo\\bar", "..\\baz");
 * assertEquals(resolved, "C:\\foo\\baz");
 * ```
 *
 * @param pathSegments The path segments to process to path
 * @return The resolved path
 */
const resolve = _function_resolve as typeof _function_resolve
export { resolve }
