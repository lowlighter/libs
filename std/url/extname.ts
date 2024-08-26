import { extname as _function_extname } from "jsr:@std/url@0.225.0/extname"
/**
 * Returns the file extension of a given URL or string with leading period.
 *
 * The extension is sourced from the path portion of the URL. If there is no
 * extension, an empty string is returned. URL queries and hashes are ignored.
 *
 * @param url The URL from which to extract the extension.
 * @return The extension of the URL.
 *
 * @example Usage
 * ```ts
 * import { extname } from "@std/url/extname";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(extname("https://deno.land/std/path/mod.ts"), ".ts");
 * assertEquals(extname("https://deno.land/std/path/mod"), "");
 * assertEquals(extname("https://deno.land/std/path/mod.ts?a=b"), ".ts");
 * assertEquals(extname("https://deno.land/"), "");
 * ```
 *
 * @deprecated Use
 * {@linkcode https://jsr.io/@std/path/doc/posix/~/extname | @std/path/posix/extname}
 * instead (examples included). `@std/url` will be removed in the future.
 */
const extname = _function_extname as typeof _function_extname
export { extname }
