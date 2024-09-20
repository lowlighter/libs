import { toNamespacedPath as _function_toNamespacedPath } from "jsr:@std/path@1.0.6/to-namespaced-path"
/**
 * Resolves path to a namespace path.  This is a no-op on
 * non-windows systems.
 *
 * @example Usage
 * ```ts
 * import { toNamespacedPath } from "@std/path/to-namespaced-path";
 * import { assertEquals } from "@std/assert";
 *
 * if (Deno.build.os === "windows") {
 *   assertEquals(toNamespacedPath("C:\\foo\\bar"), "\\\\?\\C:\\foo\\bar");
 * } else {
 *   assertEquals(toNamespacedPath("/foo/bar"), "/foo/bar");
 * }
 * ```
 *
 * @param path Path to resolve to namespace.
 * @return The resolved namespace path.
 */
const toNamespacedPath = _function_toNamespacedPath as typeof _function_toNamespacedPath
export { toNamespacedPath }
