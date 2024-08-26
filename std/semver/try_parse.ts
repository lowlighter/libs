import { tryParse as _function_tryParse } from "jsr:@std/semver@1.0.1/try-parse"
/**
 * Returns the parsed SemVer, or `undefined` if it's not valid.
 *
 * @example Usage
 * ```ts
 * import { tryParse } from "@std/semver/try-parse";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(tryParse("1.2.3"), { major: 1, minor: 2, patch: 3, prerelease: [], build: [] });
 * assertEquals(tryParse("1.2.3-alpha"), { major: 1, minor: 2, patch: 3, prerelease: ["alpha"], build: [] });
 * assertEquals(tryParse("1.2.3+build"), { major: 1, minor: 2, patch: 3, prerelease: [], build: ["build"] });
 * assertEquals(tryParse("1.2.3-alpha.1+build.1"), { major: 1, minor: 2, patch: 3, prerelease: ["alpha", 1], build: ["build", "1"] });
 * assertEquals(tryParse(" invalid "), undefined);
 * ```
 *
 * @param version The version string to parse
 * @return A valid SemVer or `undefined`
 */
const tryParse = _function_tryParse as typeof _function_tryParse
export { tryParse }
