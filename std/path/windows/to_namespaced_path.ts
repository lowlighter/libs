import { toNamespacedPath as _function_toNamespacedPath } from "jsr:@std/path@1.0.1/windows/to-namespaced-path"
/**
 * Resolves path to a namespace path
 *
 * @example Usage
 * ```ts
 * import { toNamespacedPath } from "@std/path/windows/to-namespaced-path";
 * import { assertEquals } from "@std/assert";
 *
 * const namespaced = toNamespacedPath("C:\\foo\\bar");
 * assertEquals(namespaced, "\\\\?\\C:\\foo\\bar");
 * ```
 *
 * @param path The path to resolve to namespaced path
 * @return The resolved namespaced path
 */
const toNamespacedPath = _function_toNamespacedPath
export { toNamespacedPath }
