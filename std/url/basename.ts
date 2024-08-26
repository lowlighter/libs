import { basename as _function_basename } from "jsr:@std/url@0.225.0/basename"
/**
 * Returns the base name of a URL or URL string, optionally removing a suffix.
 *
 * Trailing `/`s are ignored. If no path is present, the host name is returned.
 * If a suffix is provided, it will be removed from the base name. URL queries
 * and hashes are ignored.
 *
 * @param url The URL from which to extract the base name.
 * @param suffix An optional suffix to remove from the base name.
 * @return The base name of the URL.
 *
 * @example Basic usage
 * ```ts
 * import { basename } from "@std/url/basename";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(basename("https://deno.land/std/assert/mod.ts"), "mod.ts");
 * assertEquals(basename(new URL("https://deno.land/std/assert/mod.ts")), "mod.ts");
 * assertEquals(basename("https://deno.land/std/assert/mod.ts?a=b"), "mod.ts");
 * assertEquals(basename("https://deno.land/std/assert/mod.ts#header"), "mod.ts");
 * assertEquals(basename("https://deno.land/"), "deno.land");
 * ```
 *
 * @example Removing a suffix
 *
 * Defining a suffix will remove it from the base name.
 *
 * ```ts
 * import { basename } from "@std/url/basename";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(basename("https://deno.land/std/assert/mod.ts", ".ts"), "mod");
 * assertEquals(basename(new URL("https://deno.land/std/assert/mod.ts"), ".ts"), "mod");
 * assertEquals(basename("https://deno.land/std/assert/mod.ts?a=b", ".ts"), "mod");
 * assertEquals(basename("https://deno.land/std/assert/mod.ts#header", ".ts"), "mod");
 * ```
 *
 * @deprecated Use
 * {@linkcode https://jsr.io/@std/path/doc/posix/~/basename | @std/path/posix/basename}
 * instead (examples included). `@std/url` will be removed in the future.
 */
const basename = _function_basename as typeof _function_basename
export { basename }
