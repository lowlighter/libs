import { common as _function_common } from "jsr:@std/path@1.0.2/windows/common"
/**
 * Determines the common path from a set of paths for Windows systems.
 *
 * @example Usage
 * ```ts
 * import { common } from "@std/path/windows/common";
 * import { assertEquals } from "@std/assert";
 *
 * const path = common([
 *   "C:\\foo\\bar",
 *   "C:\\foo\\baz",
 * ]);
 * assertEquals(path, "C:\\foo\\");
 * ```
 *
 * @param paths The paths to compare.
 * @return The common path.
 */
const common = _function_common as typeof _function_common
export { common }
