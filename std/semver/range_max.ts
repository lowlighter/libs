import { rangeMax as _function_rangeMax } from "jsr:@std/semver@0.224.3/range-max"
/**
 * The maximum valid SemVer for a given range or INVALID
 *
 * @example Usage
 * ```ts
 * import { parseRange } from "@std/semver/parse-range";
 * import { rangeMax } from "@std/semver/range-max";
 * import { equals } from "@std/semver/equals";
 * import { assert } from "@std/assert/assert";
 *
 * assert(equals(rangeMax(parseRange(">1.0.0 <=2.0.0")), { major: 2, minor: 0, patch: 0 }));
 * ```
 *
 * @param range The range to calculate the max for
 * @return A valid SemVer or INVALID
 *
 * @deprecated This will be removed in 1.0.0. Use {@linkcode greaterThanRange} or
 * {@linkcode lessThanRange} for comparing ranges and SemVers. The maximum
 * version of a range is often not well defined, and therefore this API
 * shouldn't be used. See
 * {@link https://github.com/denoland/deno_std/issues/4365} for details.
 */
const rangeMax = _function_rangeMax
export { rangeMax }
