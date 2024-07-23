import { satisfies as _function_satisfies } from "jsr:@std/semver@0.224.3/satisfies"
/**
 * Test to see if the version satisfies the range.
 *
 * @example Usage
 * ```ts
 * import { parse, parseRange, satisfies } from "@std/semver";
 * import { assert, assertFalse } from "@std/assert";
 *
 * const version = parse("1.2.3");
 * const range0 = parseRange(">=1.0.0 <2.0.0");
 * const range1 = parseRange(">=1.0.0 <1.3.0");
 * const range2 = parseRange(">=1.0.0 <1.2.3");
 *
 * assert(satisfies(version, range0));
 * assert(satisfies(version, range1));
 * assertFalse(satisfies(version, range2));
 * ```
 * @param version The version to test
 * @param range The range to check
 * @return true if the version is in the range
 */
const satisfies = _function_satisfies
export { satisfies }
