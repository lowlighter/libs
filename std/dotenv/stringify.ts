import { stringify as _function_stringify } from "jsr:@std/dotenv@0.225.0/stringify"
/**
 * Stringify an object into a valid `.env` file format.
 *
 * @example Usage
 * ```ts
 * import { stringify } from "@std/dotenv/stringify";
 * import { assertEquals } from "@std/assert";
 *
 * const object = { GREETING: "hello world" };
 * assertEquals(stringify(object), "GREETING='hello world'");
 * ```
 *
 * @param object object to be stringified
 * @return string of object
 */
const stringify = _function_stringify
export { stringify }
