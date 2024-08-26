import { parse as _function_parse } from "jsr:@std/dotenv@0.225.0/parse"
/**
 * Parse `.env` file output in an object.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@std/dotenv/parse";
 * import { assertEquals } from "@std/assert";
 *
 * const env = parse("GREETING=hello world");
 * assertEquals(env, { GREETING: "hello world" });
 * ```
 *
 * @param text The text to parse.
 * @return The parsed object.
 */
const parse = _function_parse as typeof _function_parse
export { parse }
