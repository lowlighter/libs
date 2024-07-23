import { toNamespacedPath as _function_toNamespacedPath } from "jsr:@std/path@1.0.1/posix/to-namespaced-path"
/**
 * Converts a path to a namespaced path. This function returns the path as is on posix.
 *
 * @example Usage
 * ```ts
 * import { toNamespacedPath } from "@std/path/posix/to-namespaced-path";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toNamespacedPath("/home/foo"), "/home/foo");
 * ```
 *
 * @param path The path.
 * @return The namespaced path.
 */
const toNamespacedPath = _function_toNamespacedPath
export { toNamespacedPath }
