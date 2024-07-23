import { toKebabCase as _function_toKebabCase } from "jsr:@std/text@1.0.0/to-kebab-case"
/**
 * Converts a string into kebab-case.
 *
 * @example Usage
 * ```ts
 * import { toKebabCase } from "@std/text/to-kebab-case";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toKebabCase("deno is awesome"), "deno-is-awesome");
 * ```
 *
 * @param input The string that is going to be converted into kebab-case
 * @return The string as kebab-case
 */
const toKebabCase = _function_toKebabCase
export { toKebabCase }
