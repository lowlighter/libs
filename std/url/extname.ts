import { extname as _function_extname } from "jsr:@std/url@0.224.1/extname"
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
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * assertEquals(extname("https://deno.land/std/path/mod.ts"), ".ts");
 * assertEquals(extname("https://deno.land/std/path/mod"), "");
 * assertEquals(extname("https://deno.land/std/path/mod.ts?a=b"), ".ts");
 * assertEquals(extname("https://deno.land/"), "");
 * ```
 */
const extname = _function_extname
export { extname }
