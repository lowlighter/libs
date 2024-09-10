import { equals as _function_equals } from "jsr:@std/semver@1.0.3/equals"
/**
 * Returns `true` if both SemVers are equivalent.
 *
 * This is equal to `compare(version1, version2) === 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, equals } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.3");
 *
 * assert(equals(version1, version2));
 * assert(!equals(version1, parse("1.2.4")));
 * ```
 *
 * @param version1 The first SemVer to compare
 * @param version2 The second SemVer to compare
 * @return `true` if `version1` is equal to `version2`, `false` otherwise
 */
const equals = _function_equals as typeof _function_equals
export { equals }
