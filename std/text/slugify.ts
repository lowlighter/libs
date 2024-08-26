import { slugify as _function_slugify } from "jsr:@std/text@1.0.3/slugify"
/**
 * **UNSTABLE**: New API, yet to be vetted.
 *
 * Converts a string into {@link https://en.wikipedia.org/wiki/Clean_URL#Slug a slug}.
 *
 * @example Usage
 * ```ts
 * import { slugify } from "@std/text/slugify";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(slugify("hello world"), "hello-world");
 * assertEquals(slugify("déjà vu"), "deja-vu");
 * ```
 *
 * @param input The string that is going to be converted into a slug
 * @return The string as a slug
 *
 * @experimental
 */
const slugify = _function_slugify as typeof _function_slugify
export { slugify }
