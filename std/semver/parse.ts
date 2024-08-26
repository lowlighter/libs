import { parse as _function_parse } from "jsr:@std/semver@1.0.1/parse"
/**
 * Attempt to parse a string as a semantic version, returning a SemVer object.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@std/semver/parse";
 * import { assertEquals } from "@std/assert";
 *
 * const version = parse("1.2.3");
 * assertEquals(version, {
 *   major: 1,
 *   minor: 2,
 *   patch: 3,
 *   prerelease: [],
 *   build: [],
 * });
 * ```
 *
 * @throws If the input string is invalid.
 * @param version The version string to parse
 * @return A valid SemVer
 */
const parse = _function_parse as typeof _function_parse
export { parse }
