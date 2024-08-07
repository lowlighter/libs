import { equals as _function_equals } from "jsr:@std/semver@1.0.0/equals"
/**
 * Returns `true` if both SemVers are equivalent.
 *
 * This is equal to `compare(s0, s1) === 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, equals } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const s0 = parse("1.2.3");
 * const s1 = parse("1.2.3");
 *
 * assert(equals(s0, s1));
 * assert(!equals(s0, parse("1.2.4")));
 * ```
 *
 * @param s0 The first SemVer to compare
 * @param s1 The second SemVer to compare
 * @return `true` if `s0` is equal to `s1`, `false` otherwise
 */
const equals = _function_equals
export { equals }
