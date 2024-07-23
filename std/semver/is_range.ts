import { isRange as _function_isRange } from "jsr:@std/semver@0.224.3/is-range"
/**
 * Does a deep check on the object to determine if its a valid range.
 *
 * Objects with extra fields are still considered valid if they have at
 * least the correct fields.
 *
 * Adds a type assertion if true.
 *
 * @example Usage
 * ```ts
 * import { isRange } from "@std/semver/is-range";
 * import { assert, assertFalse } from "@std/assert";
 *
 * const range = [[{ major: 1, minor: 2, patch: 3 }]];
 * assert(isRange(range));
 * assertFalse(isRange({}));
 * ```
 * @param value The value to check if its a valid Range
 * @return True if its a valid Range otherwise false.
 */
const isRange = _function_isRange
export { isRange }
