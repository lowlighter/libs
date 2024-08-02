import { toConstantCase as _function_toConstantCase } from "jsr:@std/text@1.0.2/to-constant-case"
/**
 * Converts a string into CONSTANT_CASE (also known as SCREAMING_SNAKE_CASE).
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @example Usage
 * ```ts
 * import { toConstantCase } from "@std/text/to-constant-case";
 * import { assertEquals } from "@std/assert/equals";
 *
 * assertEquals(toConstantCase("deno is awesome"), "DENO_IS_AWESOME");
 * ```
 *
 * @param input The string that is going to be converted into CONSTANT_CASE
 * @return The string as CONSTANT_CASE
 *
 * @experimental
 */
const toConstantCase = _function_toConstantCase
export { toConstantCase }
