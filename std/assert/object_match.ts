import { assertObjectMatch as _function_assertObjectMatch } from "jsr:@std/assert@1.0.2/object-match"
/**
 * Make an assertion that `expected` object is a subset of `actual` object,
 * deeply. If not, then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertObjectMatch } from "@std/assert";
 *
 * assertObjectMatch({ foo: "bar" }, { foo: "bar" }); // Doesn't throw
 * assertObjectMatch({ foo: "bar" }, { foo: "baz" }); // Throws
 * ```
 *
 * @example Usage with nested objects
 * ```ts no-eval
 * import { assertObjectMatch } from "@std/assert";
 *
 * assertObjectMatch({ foo: { bar: 3, baz: 4 } }, { foo: { bar: 3 } }); // Doesn't throw
 * assertObjectMatch({ foo: { bar: 3 } }, { foo: { bar: 3, baz: 4 } }); // Throws
 * ```
 *
 * @param actual The actual value to be matched.
 * @param expected The expected value to match.
 * @param msg The optional message to display if the assertion fails.
 */
const assertObjectMatch = _function_assertObjectMatch as typeof _function_assertObjectMatch
export { assertObjectMatch }
