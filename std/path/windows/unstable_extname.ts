import { extname as _function_extname } from "jsr:@std/path@1.0.6/windows/unstable-extname"
/**
 * Return the extension of the `path` with leading period.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { extname } from "@std/path/windows/unstable-extname";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(extname("file.ts"), ".ts");
 * assertEquals(extname(new URL("file:///C:/foo/bar/baz.ext")), ".ext");
 * ```
 *
 * @param path The path to get the extension from.
 * @return The extension of the `path`.
 */
const extname = _function_extname as typeof _function_extname
export { extname }
