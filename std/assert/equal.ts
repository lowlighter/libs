import { equal as _function_equal } from "jsr:@std/assert@1.0.5/equal"
/**
 * Deep equality comparison used in assertions
 *
 * @param c The actual value
 * @param d The expected value
 * @return `true` if the values are deeply equal, `false` otherwise
 *
 * @example Usage
 * ```ts
 * import { equal } from "@std/assert";
 *
 * equal({ foo: "bar" }, { foo: "bar" }); // Returns `true`
 * equal({ foo: "bar" }, { foo: "baz" }); // Returns `false
 * ```
 */
const equal = _function_equal as typeof _function_equal
export { equal }
