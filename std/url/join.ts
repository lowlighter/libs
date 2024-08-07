import { join as _function_join } from "jsr:@std/url@0.224.1/join"
/**
 * Joins a base URL or URL string, and a sequence of path segments together,
 * then normalizes the resulting URL.
 *
 * @param url Base URL to be joined with the paths and normalized.
 * @param paths Array of path segments to be joined to the base URL.
 * @return A complete URL containing the base URL joined with the paths.
 *
 * @example Usage
 *
 * ```ts
 * import { join } from "@std/url/join";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * assertEquals(join("https://deno.land/", "std", "path", "mod.ts").href, "https://deno.land/std/path/mod.ts");
 * assertEquals(join("https://deno.land", "//std", "path/", "/mod.ts").href, "https://deno.land/std/path/mod.ts");
 * ```
 */
const join = _function_join
export { join }
