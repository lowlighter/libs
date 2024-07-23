import { normalize as _function_normalize } from "jsr:@std/url@0.224.1/normalize"
/**
 * Normalizes the URL or URL string, resolving `..` and `.` segments. Multiple
 * sequential `/`s are resolved into a single `/`.
 *
 * @param url URL to be normalized.
 * @return Normalized URL.
 *
 * @example Usage
 *
 * ```ts
 * import { normalize } from "@std/url/normalize";
 * import { assertEquals } from "@std/assert/assert-equals";
 *
 * assertEquals(normalize("https:///deno.land///std//assert//.//mod.ts").href, "https://deno.land/std/assert/mod.ts");
 * assertEquals(normalize("https://deno.land/std/assert/../async/retry.ts").href, "https://deno.land/std/async/retry.ts");
 * ```
 */
const normalize = _function_normalize
export { normalize }
