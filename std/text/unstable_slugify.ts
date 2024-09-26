import { slugify as _function_slugify } from "jsr:@std/text@1.0.7/unstable-slugify"
/**
 * Converts a string into a {@link https://en.wikipedia.org/wiki/Clean_URL#Slug | slug}.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { slugify } from "@std/text/unstable-slugify";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(slugify("hello world"), "hello-world");
 * assertEquals(slugify("déjà vu"), "deja-vu");
 * ```
 *
 * @param input The string that is going to be converted into a slug
 * @return The string as a slug
 */
const slugify = _function_slugify as typeof _function_slugify
export { slugify }
