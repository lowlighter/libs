import { dirname as _function_dirname } from "jsr:@std/url@0.225.1/dirname"
/**
 * Returns the directory path URL of a URL or URL string.
 *
 * The directory path is the portion of a URL up to but excluding the final path
 * segment. URL queries and hashes are ignored.
 *
 * @param url URL to extract the directory from.
 * @return The directory path URL of the URL.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@std/url/dirname";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(dirname("https://deno.land/std/path/mod.ts"), new URL("https://deno.land/std/path"));
 * assertEquals(dirname(new URL("https://deno.land/std/path/mod.ts")), new URL("https://deno.land/std/path"));
 * ```
 *
 * @deprecated Use
 * {@linkcode https://jsr.io/@std/path/doc/~/dirname | @std/path/dirname}
 * instead. `@std/url` will be removed in the future.
 */
const dirname = _function_dirname as typeof _function_dirname
export { dirname }
