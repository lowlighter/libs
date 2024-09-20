import { normalize as _function_normalize } from "jsr:@std/path@1.0.6/unstable-normalize"
/**
 * Normalize the path, resolving `'..'` and `'.'` segments.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { normalize } from "@std/path/unstable-normalize";
 * import { assertEquals } from "@std/assert";
 *
 * if (Deno.build.os === "windows") {
 *   assertEquals(normalize("C:\\foo\\bar\\..\\baz\\quux"), "C:\\foo\\baz\\quux");
 *   assertEquals(normalize(new URL("file:///C:/foo/bar/../baz/quux")), "C:\\foo\\baz\\quux");
 * } else {
 *   assertEquals(normalize("/foo/bar/../baz/quux"), "/foo/baz/quux");
 *   assertEquals(normalize(new URL("file:///foo/bar/../baz/quux")), "/foo/baz/quux");
 * }
 * ```
 *
 * @param path Path to be normalized. Path can be a string or a file URL object.
 * @return The normalized path.
 */
const normalize = _function_normalize as typeof _function_normalize
export { normalize }
