import { toPascalCase as _function_toPascalCase } from "jsr:@std/text@1.0.2/to-pascal-case"
/**
 * Converts a string into PascalCase.
 *
 * @example Usage
 * ```ts
 * import { toPascalCase } from "@std/text/to-pascal-case";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(toPascalCase("deno is awesome"), "DenoIsAwesome");
 * ```
 *
 * @param input The string that is going to be converted into PascalCase
 * @return The string as PascalCase
 */
const toPascalCase = _function_toPascalCase
export { toPascalCase }
