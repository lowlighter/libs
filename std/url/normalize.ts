import { normalize as _function_normalize } from "jsr:@std/url@0.225.0/normalize"
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
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(normalize("https:///deno.land///std//assert//.//mod.ts").href, "https://deno.land/std/assert/mod.ts");
 * assertEquals(normalize("https://deno.land/std/assert/../async/retry.ts").href, "https://deno.land/std/async/retry.ts");
 * ```
 *
 * @deprecated Use
 * {@linkcode https://jsr.io/@std/path/doc/posix/~/normalize | @std/path/posix/normalize}
 * instead (examples included). `@std/url` will be removed in the future.
 */
const normalize = _function_normalize as typeof _function_normalize
export { normalize }
