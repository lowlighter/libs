import { tryParseRange as _function_tryParseRange } from "jsr:@std/semver@1.0.0/try-parse-range"
/**
 * Parses the given range string and returns a Range object. If the range string
 * is invalid, `undefined` is returned.
 *
 * @example Usage
 * ```ts
 * import { tryParseRange } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(tryParseRange(">=1.2.3 <1.2.4"), [
 *  [
 *    { operator: ">=", major: 1, minor: 2, patch: 3, prerelease: [], build: [] },
 *    { operator: "<", major: 1, minor: 2, patch: 4, prerelease: [], build: [] },
 *  ],
 * ]);
 * ```
 *
 * @param range The range string
 * @return A Range object if valid otherwise `undefined`
 */
const tryParseRange = _function_tryParseRange
export { tryParseRange }
