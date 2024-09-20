import { toSnakeCase as _function_toSnakeCase } from "jsr:@std/text@1.0.6/to-snake-case"
/**
 * Converts a string into snake_case.
 *
 * @example Usage
 * ```ts
 * import { toSnakeCase } from "@std/text/to-snake-case";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toSnakeCase("deno is awesome"), "deno_is_awesome");
 * ```
 *
 * @param input The string that is going to be converted into snake_case
 * @return The string as snake_case
 */
const toSnakeCase = _function_toSnakeCase as typeof _function_toSnakeCase
export { toSnakeCase }
