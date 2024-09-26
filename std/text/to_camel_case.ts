import { toCamelCase as _function_toCamelCase } from "jsr:@std/text@1.0.7/to-camel-case"
/**
 * Converts a string into camelCase.
 *
 * @example Usage
 * ```ts
 * import { toCamelCase } from "@std/text/to-camel-case";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toCamelCase("deno is awesome"),"denoIsAwesome");
 * ```
 *
 * @param input The string that is going to be converted into camelCase
 * @return The string as camelCase
 */
const toCamelCase = _function_toCamelCase as typeof _function_toCamelCase
export { toCamelCase }
