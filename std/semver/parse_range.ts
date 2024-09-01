import { parseRange as _function_parseRange } from "jsr:@std/semver@1.0.2/parse-range"
/**
 * Parses a range string into a {@linkcode Range} object.
 *
 * @example Usage
 * ```ts
 * import { parseRange } from "@std/semver/parse-range";
 * import { assertEquals } from "@std/assert";
 *
 * const range = parseRange(">=1.0.0 <2.0.0 || >=3.0.0");
 * assertEquals(range, [
 *   [
 *     { operator: ">=", major: 1, minor: 0, patch: 0, prerelease: [], build: [] },
 *     { operator: "<", major: 2, minor: 0, patch: 0, prerelease: [], build: [] },
 *   ],
 *   [
 *     { operator: ">=", major: 3, minor: 0, patch: 0, prerelease: [], build: [] },
 *   ]
 * ]);
 * ```
 *
 * @throws If the input range is invalid.
 * @param value The range set string
 * @return A valid SemVer range
 */
const parseRange = _function_parseRange as typeof _function_parseRange
export { parseRange }
