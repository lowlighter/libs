/**
 * The Semantic Version parser.
 *
 * Adapted directly from {@link https://github.com/npm/node-semver | semver}.
 *
 * ```ts
 * import {
 *   parse,
 *   parseRange,
 *   greaterThan,
 *   lessThan,
 *   format
 * } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const semver = parse("1.2.3");
 * assertEquals(semver, {
 *   major: 1,
 *   minor: 2,
 *   patch: 3,
 *   prerelease: [],
 *   build: []
 * });
 *
 * assertEquals(format(semver), "1.2.3");
 *
 * const range = parseRange("1.x || >=2.5.0 || 5.0.0 - 7.2.3");
 *
 * const s0 = parse("1.2.3");
 * const s1 = parse("9.8.7");
 *
 * assertEquals(greaterThan(s0, s1), false);
 * assertEquals(lessThan(s0, s1), true);
 * ```
 *
 * ## Versions
 *
 * A "version" is described by the `v2.0.0` specification found at
 * <https://semver.org>.
 *
 * A leading `"="` or `"v"` character is stripped off and ignored.
 *
 * ## Format
 *
 * Semantic versions can be formatted as strings, by default they
 * are formatted as `full`. Below is a diagram showing the various
 * formatting options.
 *
 * ```
 *           full
 *        ┌───┴───┐
 *     release    │
 *    ┌───┴───┐   │
 * primary    │   │
 *  ┌─┴─┐     │   │
 *  1.2.3-pre.1+b.1
 *  │ │ │ └─┬─┘ └┬┘
 *  │ │ │   │    └── build
 *  │ │ │   └─────── pre
 *  │ │ └─────────── patch
 *  │ └───────────── minor
 *  └─────────────── major
 * ```
 *
 * ## Ranges
 *
 * A version {@linkcode Range} is a set of {@linkcode Comparator}s which specify
 * versions that satisfy the range.
 *
 * A {@linkcode Comparator} is composed of an {@linkcode Operator} and a
 * {@link SemVer}. The set of primitive `operators` is:
 *
 * - `<` Less than
 * - `<=` Less than or equal to
 * - `>` Greater than
 * - `>=` Greater than or equal to
 * - `=` Equal. If no operator is specified, then equality is assumed, so this
 *   operator is optional, but MAY be included.
 *
 * For example, the comparator `>=1.2.7` would match the versions `1.2.7`, `1.2.8`,
 * `2.5.3`, and `1.3.9`, but not the versions `1.2.6` or `1.1.0`.
 *
 * Comparators can be joined by whitespace to form a `comparator set`, which is
 * satisfied by the **intersection** of all of the comparators it includes.
 *
 * A range is composed of one or more comparator sets, joined by `||`. A version
 * matches a range if and only if every comparator in at least one of the
 * `||`-separated comparator sets is satisfied by the version.
 *
 * For example, the range `>=1.2.7 <1.3.0` would match the versions `1.2.7`,
 * `1.2.8`, and `1.2.99`, but not the versions `1.2.6`, `1.3.0`, or `1.1.0`.
 *
 * The range `1.2.7 || >=1.2.9 <2.0.0` would match the versions `1.2.7`, `1.2.9`,
 * and `1.4.6`, but not the versions `1.2.8` or `2.0.0`.
 *
 * ### Prerelease Tags
 *
 * If a version has a prerelease tag (for example, `1.2.3-alpha.3`) then it will
 * only be allowed to satisfy comparator sets if at least one comparator with the
 * same `[major, minor, patch]` tuple also has a prerelease tag.
 *
 * For example, the range `>1.2.3-alpha.3` would be allowed to match the version
 * `1.2.3-alpha.7`, but it would _not_ be satisfied by `3.4.5-alpha.9`, even though
 * `3.4.5-alpha.9` is technically "greater than" `1.2.3-alpha.3` according to the
 * SemVer sort rules. The version range only accepts prerelease tags on the `1.2.3`
 * version. The version `3.4.5` _would_ satisfy the range, because it does not have
 * a prerelease flag, and `3.4.5` is greater than `1.2.3-alpha.7`.
 *
 * The purpose for this behavior is twofold. First, prerelease versions frequently
 * are updated very quickly, and contain many breaking changes that are (by the
 * author"s design) not yet fit for public consumption. Therefore, by default, they
 * are excluded from range matching semantics.
 *
 * Second, a user who has opted into using a prerelease version has clearly
 * indicated the intent to use _that specific_ set of alpha/beta/rc versions. By
 * including a prerelease tag in the range, the user is indicating that they are
 * aware of the risk. However, it is still not appropriate to assume that they have
 * opted into taking a similar risk on the _next_ set of prerelease versions.
 *
 * #### Prerelease Identifiers
 *
 * The method {@linkcode increment} takes an additional `identifier` string
 * argument that will append the value of the string as a prerelease identifier:
 *
 * ```ts
 * import { increment, parse } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(increment(parse("1.2.3"), "prerelease", { prerelease: "alpha" }), parse("1.2.4-alpha.0"));
 * ```
 *
 * ### Build Metadata
 *
 * Build metadata is `.` delimited alpha-numeric string.
 * When parsing a version it is retained on the `build: string[]` field
 * of the SemVer instance. When incrementing there is an additional parameter that
 * can set the build metadata on the SemVer instance.
 *
 * ### Advanced Range Syntax
 *
 * Advanced range syntax desugars to primitive comparators in deterministic ways.
 *
 * Advanced ranges may be combined in the same way as primitive comparators using
 * white space or `||`.
 *
 * #### Hyphen Ranges `X.Y.Z - A.B.C`
 *
 * Specifies an inclusive set.
 *
 * - `1.2.3 - 2.3.4` := `>=1.2.3 <=2.3.4`
 *
 * If a partial version is provided as the first version in the inclusive range,
 * then the missing pieces are replaced with zeroes.
 *
 * - `1.2 - 2.3.4` := `>=1.2.0 <=2.3.4`
 *
 * If a partial version is provided as the second version in the inclusive range,
 * then all versions that start with the supplied parts of the tuple are accepted,
 * but nothing that would be greater than the provided tuple parts.
 *
 * - `1.2.3 - 2.3` := `>=1.2.3 <2.4.0`
 * - `1.2.3 - 2` := `>=1.2.3 <3.0.0`
 *
 * #### X-Ranges `1.2.x` `1.X` `1.2.*` `*`
 *
 * Any of `X`, `x`, or `*` may be used to "stand in" for one of the numeric values
 * in the `[major, minor, patch]` tuple.
 *
 * - `*` := `>=0.0.0` (Any version satisfies)
 * - `1.x` := `>=1.0.0 <2.0.0` (Matching major version)
 * - `1.2.x` := `>=1.2.0 <1.3.0` (Matching major and minor versions)
 *
 * A partial version range is treated as an X-Range, so the special character is in
 * fact optional.
 *
 * - `""` (empty string) := `*` := `>=0.0.0`
 * - `1` := `1.x.x` := `>=1.0.0 <2.0.0`
 * - `1.2` := `1.2.x` := `>=1.2.0 <1.3.0`
 *
 * #### Tilde Ranges `~1.2.3` `~1.2` `~1`
 *
 * Allows patch-level changes if a minor version is specified on the comparator.
 * Allows minor-level changes if not.
 *
 * - `~1.2.3` := `>=1.2.3 <1.(2+1).0` := `>=1.2.3 <1.3.0`
 * - `~1.2` := `>=1.2.0 <1.(2+1).0` := `>=1.2.0 <1.3.0` (Same as `1.2.x`)
 * - `~1` := `>=1.0.0 <(1+1).0.0` := `>=1.0.0 <2.0.0` (Same as `1.x`)
 * - `~0.2.3` := `>=0.2.3 <0.(2+1).0` := `>=0.2.3 <0.3.0`
 * - `~0.2` := `>=0.2.0 <0.(2+1).0` := `>=0.2.0 <0.3.0` (Same as `0.2.x`)
 * - `~0` := `>=0.0.0 <(0+1).0.0` := `>=0.0.0 <1.0.0` (Same as `0.x`)
 * - `~1.2.3-beta.2` := `>=1.2.3-beta.2 <1.3.0` Note that prereleases in the
 *   `1.2.3` version will be allowed, if they are greater than or equal to
 *   `beta.2`. So, `1.2.3-beta.4` would be allowed, but `1.2.4-beta.2` would not,
 *   because it is a prerelease of a different `[major, minor, patch]` tuple.
 *
 * #### Caret Ranges `^1.2.3` `^0.2.5` `^0.0.4`
 *
 * Allows changes that do not modify the left-most non-zero element in the
 * `[major, minor, patch]` tuple. In other words, this allows patch and minor
 * updates for versions `1.0.0` and above, patch updates for versions
 * `0.X >=0.1.0`, and _no_ updates for versions `0.0.X`.
 *
 * Many authors treat a `0.x` version as if the `x` were the major
 * "breaking-change" indicator.
 *
 * Caret ranges are ideal when an author may make breaking changes between `0.2.4`
 * and `0.3.0` releases, which is a common practice. However, it presumes that
 * there will _not_ be breaking changes between `0.2.4` and `0.2.5`. It allows for
 * changes that are presumed to be additive (but non-breaking), according to
 * commonly observed practices.
 *
 * - `^1.2.3` := `>=1.2.3 <2.0.0`
 * - `^0.2.3` := `>=0.2.3 <0.3.0`
 * - `^0.0.3` := `>=0.0.3 <0.0.4`
 * - `^1.2.3-beta.2` := `>=1.2.3-beta.2 <2.0.0` Note that prereleases in the
 *   `1.2.3` version will be allowed, if they are greater than or equal to
 *   `beta.2`. So, `1.2.3-beta.4` would be allowed, but `1.2.4-beta.2` would not,
 *   because it is a prerelease of a different `[major, minor, patch]` tuple.
 * - `^0.0.3-beta` := `>=0.0.3-beta <0.0.4` Note that prereleases in the `0.0.3`
 *   version _only_ will be allowed, if they are greater than or equal to `beta`.
 *   So, `0.0.3-pr.2` would be allowed.
 *
 * When parsing caret ranges, a missing `patch` value desugars to the number `0`,
 * but will allow flexibility within that value, even if the major and minor
 * versions are both `0`.
 *
 * - `^1.2.x` := `>=1.2.0 <2.0.0`
 * - `^0.0.x` := `>=0.0.0 <0.1.0`
 * - `^0.0` := `>=0.0.0 <0.1.0`
 *
 * A missing `minor` and `patch` values will desugar to zero, but also allow
 * flexibility within those values, even if the major version is zero.
 *
 * - `^1.x` := `>=1.0.0 <2.0.0`
 * - `^0.x` := `>=0.0.0 <1.0.0`
 *
 * ### Range Grammar
 *
 * Putting all this together, here is a Backus-Naur grammar for ranges, for the
 * benefit of parser authors:
 *
 * ```bnf
 * range-set  ::= range ( logical-or range ) *
 * logical-or ::= ( " " ) * "||" ( " " ) *
 * range      ::= hyphen | simple ( " " simple ) * | ""
 * hyphen     ::= partial " - " partial
 * simple     ::= primitive | partial | tilde | caret
 * primitive  ::= ( "<" | ">" | ">=" | "<=" | "=" ) partial
 * partial    ::= xr ( "." xr ( "." xr qualifier ? )? )?
 * xr         ::= "x" | "X" | "*" | nr
 * nr         ::= "0" | ["1"-"9"] ( ["0"-"9"] ) *
 * tilde      ::= "~" partial
 * caret      ::= "^" partial
 * qualifier  ::= ( "-" pre )? ( "+" build )?
 * pre        ::= parts
 * build      ::= parts
 * parts      ::= part ( "." part ) *
 * part       ::= nr | [-0-9A-Za-z]+
 * ```
 *
 * Note that, since ranges may be non-contiguous, a version might not be greater
 * than a range, less than a range, _or_ satisfy a range! For example, the range
 * `1.2 <1.2.9 || >2.0.0` would have a hole from `1.2.9` until `2.0.0`, so the
 * version `1.2.10` would not be greater than the range (because `2.0.1` satisfies,
 * which is higher), nor less than the range (since `1.2.8` satisfies, which is
 * lower), and it also does not satisfy the range.
 *
 * If you want to know if a version satisfies or does not satisfy a range, use the
 * {@linkcode satisfies} function.
 *
 * @module
 */
import { compare as _function_compare } from "jsr:@std/semver@1.0.3"
/**
 * Compare two SemVers.
 *
 * Returns `0` if `version1` equals `version2`, or `1` if `version1` is greater, or `-1` if `version2` is
 * greater.
 *
 * Sorts in ascending order if passed to {@linkcode Array.sort}.
 *
 * @example Usage
 * ```ts
 * import { parse, compare } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 *
 * assertEquals(compare(version1, version2), -1);
 * assertEquals(compare(version2, version1), 1);
 * assertEquals(compare(version1, version1), 0);
 * ```
 *
 * @param version1 The first SemVer to compare
 * @param version2 The second SemVer to compare
 * @return `1` if `version1` is greater, `0` if equal, or `-1` if `version2` is greater
 */
const compare = _function_compare as typeof _function_compare
export { compare }

import { difference as _function_difference } from "jsr:@std/semver@1.0.3"
/**
 * Returns difference between two SemVers by the release type,
 * or `undefined` if the SemVers are the same.
 *
 * @example Usage
 * ```ts
 * import { parse, difference } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 * const version3 = parse("1.3.0");
 * const version4 = parse("2.0.0");
 *
 * assertEquals(difference(version1, version2), "patch");
 * assertEquals(difference(version1, version3), "minor");
 * assertEquals(difference(version1, version4), "major");
 * assertEquals(difference(version1, version1), undefined);
 * ```
 *
 * @param version1 The first SemVer to compare
 * @param version2 The second SemVer to compare
 * @return The release type difference or `undefined` if the versions are the same
 */
const difference = _function_difference as typeof _function_difference
export { difference }

import { format as _function_format } from "jsr:@std/semver@1.0.3"
/**
 * Format a SemVer object into a string.
 *
 * @example Usage
 * ```ts
 * import { format } from "@std/semver/format";
 * import { assertEquals } from "@std/assert";
 *
 * const semver = {
 *   major: 1,
 *   minor: 2,
 *   patch: 3,
 * };
 * assertEquals(format(semver), "1.2.3");
 * ```
 *
 * @param version The SemVer to format
 * @return The string representation of a semantic version.
 */
const format = _function_format as typeof _function_format
export { format }

import { satisfies as _function_satisfies } from "jsr:@std/semver@1.0.3"
/**
 * Test to see if the SemVer satisfies the range.
 *
 * @example Usage
 * ```ts
 * import { parse, parseRange, satisfies } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version = parse("1.2.3");
 * const range0 = parseRange(">=1.0.0 <2.0.0");
 * const range1 = parseRange(">=1.0.0 <1.3.0");
 * const range2 = parseRange(">=1.0.0 <1.2.3");
 *
 * assert(satisfies(version, range0));
 * assert(satisfies(version, range1));
 * assert(!satisfies(version, range2));
 * ```
 * @param version The version to test
 * @param range The range to check
 * @return true if the version is in the range
 */
const satisfies = _function_satisfies as typeof _function_satisfies
export { satisfies }

import type { IncrementOptions as _interface_IncrementOptions } from "jsr:@std/semver@1.0.3"
/**
 * Options for {@linkcode increment}.
 */
interface IncrementOptions extends _interface_IncrementOptions {}
export type { IncrementOptions }

import { increment as _function_increment } from "jsr:@std/semver@1.0.3"
/**
 * Returns the new SemVer resulting from an increment by release type.
 *
 * `premajor`, `preminor` and `prepatch` will bump the version up to the next version,
 * based on the type, and will also add prerelease metadata.
 *
 * If called from a non-prerelease version, the `prerelease` will work the same as
 * `prepatch`. The patch version is incremented and then is made into a prerelease. If
 * the input version is already a prerelease it will simply increment the prerelease
 * metadata.
 *
 * If a prerelease identifier is specified without a number then a number will be added.
 * For example `pre` will result in `pre.0`. If the existing version already has a
 * prerelease with a number and its the same prerelease identifier then the number
 * will be incremented. If the identifier differs from the new identifier then the new
 * identifier is applied and the number is reset to `0`.
 *
 * If the input version has build metadata it will be preserved on the resulting version
 * unless a new build parameter is specified. Specifying `""` will unset existing build
 * metadata.
 *
 * @example Usage
 * ```ts
 * import { increment, parse } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const version = parse("1.2.3");
 * assertEquals(increment(version, "major"), parse("2.0.0"));
 * assertEquals(increment(version, "minor"), parse("1.3.0"));
 * assertEquals(increment(version, "patch"), parse("1.2.4"));
 * assertEquals(increment(version, "prerelease"), parse("1.2.4-0"));
 *
 * const prerelease = parse("1.2.3-beta.0");
 * assertEquals(increment(prerelease, "prerelease"), parse("1.2.3-beta.1"));
 * ```
 *
 * @param version The version to increment
 * @param release The type of increment to perform
 * @param options Additional options
 * @return The new version
 */
const increment = _function_increment as typeof _function_increment
export { increment }

import { isSemVer as _function_isSemVer } from "jsr:@std/semver@1.0.3"
/**
 * Checks to see if value is a valid SemVer object. It does a check
 * into each field including prerelease and build.
 *
 * Some invalid SemVer sentinels can still return true such as ANY and INVALID.
 * An object which has the same value as a sentinel but isn't reference equal
 * will still fail.
 *
 * Objects which are valid SemVer objects but have _extra_ fields are still
 * considered SemVer objects and this will return true.
 *
 * A type assertion is added to the value.
 *
 * @example Usage
 * ```ts
 * import { isSemVer } from "@std/semver/is-semver";
 * import { assert } from "@std/assert";
 *
 * const value = {
 *   major: 1,
 *   minor: 2,
 *   patch: 3,
 * };
 *
 * assert(isSemVer(value));
 * assert(!isSemVer({ major: 1, minor: 2 }));
 * ```
 *
 * @param value The value to check to see if its a valid SemVer object
 * @return True if value is a valid SemVer otherwise false
 */
const isSemVer = _function_isSemVer as typeof _function_isSemVer
export { isSemVer }

import { maxSatisfying as _function_maxSatisfying } from "jsr:@std/semver@1.0.3"
/**
 * Returns the highest SemVer in the list that satisfies the range, or `undefined`
 * if none of them do.
 *
 * @example Usage
 * ```ts
 * import { parse, parseRange, maxSatisfying } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const versions = ["1.2.3", "1.2.4", "1.3.0", "2.0.0", "2.1.0"].map(parse);
 * const range = parseRange(">=1.0.0 <2.0.0");
 *
 * assertEquals(maxSatisfying(versions, range), parse("1.3.0"));
 * ```
 *
 * @param versions The versions to check.
 * @param range The range of possible versions to compare to.
 * @return The highest version in versions that satisfies the range.
 */
const maxSatisfying = _function_maxSatisfying as typeof _function_maxSatisfying
export { maxSatisfying }

import { minSatisfying as _function_minSatisfying } from "jsr:@std/semver@1.0.3"
/**
 * Returns the lowest SemVer in the list that satisfies the range, or `undefined` if
 * none of them do.
 *
 * @example Usage
 * ```ts
 * import { parse, parseRange, minSatisfying } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const versions = ["0.2.0", "1.2.3", "1.3.0", "2.0.0", "2.1.0"].map(parse);
 * const range = parseRange(">=1.0.0 <2.0.0");
 *
 * assertEquals(minSatisfying(versions, range), parse("1.2.3"));
 * ```
 *
 * @param versions The versions to check.
 * @param range The range of possible versions to compare to.
 * @return The lowest version in versions that satisfies the range.
 */
const minSatisfying = _function_minSatisfying as typeof _function_minSatisfying
export { minSatisfying }

import { parseRange as _function_parseRange } from "jsr:@std/semver@1.0.3"
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

import { parse as _function_parse } from "jsr:@std/semver@1.0.3"
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
 * @param value The version string to parse
 * @return A valid SemVer
 */
const parse = _function_parse as typeof _function_parse
export { parse }

import { rangeIntersects as _function_rangeIntersects } from "jsr:@std/semver@1.0.3"
/**
 * The ranges intersect every range of AND comparators intersects with a least
 * one range of OR ranges.
 *
 * @example Usage
 * ```ts
 * import { parseRange, rangeIntersects } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const range1 = parseRange(">=1.0.0 <2.0.0");
 * const range2 = parseRange(">=1.0.0 <1.2.3");
 * const range3 = parseRange(">=1.2.3 <2.0.0");
 *
 * assert(rangeIntersects(range1, range2));
 * assert(rangeIntersects(range1, range3));
 * assert(!rangeIntersects(range2, range3));
 * ```
 *
 * @param range1 range 0
 * @param range2 range 1
 * @return returns true if the given ranges intersect, false otherwise
 */
const rangeIntersects = _function_rangeIntersects as typeof _function_rangeIntersects
export { rangeIntersects }

import type { ReleaseType as _typeAlias_ReleaseType } from "jsr:@std/semver@1.0.3"
/**
 * The possible release types are used as an operator for the
 * increment function and as a result of the difference function.
 */
type ReleaseType = _typeAlias_ReleaseType
export type { ReleaseType }

import type { Operator as _typeAlias_Operator } from "jsr:@std/semver@1.0.3"
/**
 * SemVer comparison operators.
 */
type Operator = _typeAlias_Operator
export type { Operator }

import type { Comparator as _interface_Comparator } from "jsr:@std/semver@1.0.3"
/**
 * The shape of a valid SemVer comparator.
 *
 * @example Usage
 * ```ts
 * import type { Comparator } from "@std/semver/types";
 *
 * const comparator: Comparator = {
 *   operator: ">",
 *   major: 1,
 *   minor: 2,
 *   patch: 3,
 * }
 * ```
 */
interface Comparator extends _interface_Comparator {}
export type { Comparator }

import type { SemVer as _interface_SemVer } from "jsr:@std/semver@1.0.3"
/**
 * A SemVer object parsed into its constituent parts.
 */
interface SemVer extends _interface_SemVer {}
export type { SemVer }

import type { Range as _typeAlias_Range } from "jsr:@std/semver@1.0.3"
/**
 * A type representing a semantic version range. The ranges consist of
 * a nested array, which represents a set of OR comparisons while the
 * inner array represents AND comparisons.
 */
type Range = _typeAlias_Range
export type { Range }

import { tryParseRange as _function_tryParseRange } from "jsr:@std/semver@1.0.3"
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
 * @param value The range string
 * @return A Range object if valid otherwise `undefined`
 */
const tryParseRange = _function_tryParseRange as typeof _function_tryParseRange
export { tryParseRange }

import { isRange as _function_isRange } from "jsr:@std/semver@1.0.3"
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
 * import { assert } from "@std/assert";
 *
 * const range = [[{ major: 1, minor: 2, patch: 3 }]];
 * assert(isRange(range));
 * assert(!isRange({}));
 * ```
 * @param value The value to check if its a valid Range
 * @return True if its a valid Range otherwise false.
 */
const isRange = _function_isRange as typeof _function_isRange
export { isRange }

import { canParse as _function_canParse } from "jsr:@std/semver@1.0.3"
/**
 * Returns true if the string can be parsed as SemVer.
 *
 * @example Usage
 * ```ts
 * import { canParse } from "@std/semver/can-parse";
 * import { assert, assertFalse } from "@std/assert";
 *
 * assert(canParse("1.2.3"));
 * assertFalse(canParse("invalid"));
 * ```
 *
 * @param value The version string to check
 * @return `true` if the string can be parsed as SemVer, `false` otherwise
 */
const canParse = _function_canParse as typeof _function_canParse
export { canParse }

import { tryParse as _function_tryParse } from "jsr:@std/semver@1.0.3"
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
 * @param value The version string to parse
 * @return A valid SemVer or `undefined`
 */
const tryParse = _function_tryParse as typeof _function_tryParse
export { tryParse }

import { formatRange as _function_formatRange } from "jsr:@std/semver@1.0.3"
/**
 * Formats the SemVerrange into a string.
 *
 * @example Usage
 * ```ts
 * import { formatRange, parseRange } from "@std/semver";
 * import { assertEquals } from "@std/assert";
 *
 * const range = parseRange(">=1.2.3 <1.2.4");
 * assertEquals(formatRange(range), ">=1.2.3 <1.2.4");
 * ```
 *
 * @param range The range to format
 * @return A string representation of the SemVer range
 */
const formatRange = _function_formatRange as typeof _function_formatRange
export { formatRange }

import { equals as _function_equals } from "jsr:@std/semver@1.0.3"
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

import { notEquals as _function_notEquals } from "jsr:@std/semver@1.0.3"
/**
 * Not equal comparison for two SemVers.
 *
 * This is equal to `compare(version1, version2) !== 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, notEquals } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 *
 * assert(notEquals(version1, version2));
 * assert(!notEquals(version1, version1));
 * ```
 *
 * @param version1 The first version to compare
 * @param version2 The second version to compare
 * @return `true` if `version1` is not equal to `version2`, `false` otherwise
 */
const notEquals = _function_notEquals as typeof _function_notEquals
export { notEquals }

import { greaterThan as _function_greaterThan } from "jsr:@std/semver@1.0.3"
/**
 * Greater than comparison for two SemVers.
 *
 * This is equal to `compare(version1, version2) > 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, greaterThan } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 *
 * assert(greaterThan(version2, version1));
 * assert(!greaterThan(version1, version2));
 * assert(!greaterThan(version1, version1));
 * ```
 *
 * @param version1 The first version to compare
 * @param version2 The second version to compare
 * @return `true` if `version1` is greater than `version2`, `false` otherwise
 */
const greaterThan = _function_greaterThan as typeof _function_greaterThan
export { greaterThan }

import { greaterThanRange as _function_greaterThanRange } from "jsr:@std/semver@1.0.3"
/**
 * Check if the SemVer is greater than the range.
 *
 * @example Usage
 * ```ts
 * import { parse, parseRange, greaterThanRange } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 * const range = parseRange(">=1.2.3 <1.2.4");
 *
 * assert(!greaterThanRange(version1, range));
 * assert(greaterThanRange(version2, range));
 * ```
 *
 * @param version The version to check.
 * @param range The range to check against.
 * @return `true` if the semver is greater than the range, `false` otherwise.
 */
const greaterThanRange = _function_greaterThanRange as typeof _function_greaterThanRange
export { greaterThanRange }

import { greaterOrEqual as _function_greaterOrEqual } from "jsr:@std/semver@1.0.3"
/**
 * Greater than or equal to comparison for two SemVers.
 *
 * This is equal to `compare(version1, version2) >= 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, greaterOrEqual } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 *
 * assert(greaterOrEqual(version2, version1));
 * assert(!greaterOrEqual(version1, version2));
 * assert(greaterOrEqual(version1, version1));
 * ```
 *
 * @param version1 The first version to compare
 * @param version2 The second version to compare
 * @return `true` if `version1` is greater than or equal to `version2`, `false` otherwise
 */
const greaterOrEqual = _function_greaterOrEqual as typeof _function_greaterOrEqual
export { greaterOrEqual }

import { lessThan as _function_lessThan } from "jsr:@std/semver@1.0.3"
/**
 * Less than comparison for two SemVers.
 *
 * This is equal to `compare(version1, version2) < 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, lessThan } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 *
 * assert(lessThan(version1, version2));
 * assert(!lessThan(version2, version1));
 * assert(!lessThan(version1, version1));
 * ```
 *
 * @param version1 the first version to compare
 * @param version2 the second version to compare
 * @return `true` if `version1` is less than `version2`, `false` otherwise
 */
const lessThan = _function_lessThan as typeof _function_lessThan
export { lessThan }

import { lessThanRange as _function_lessThanRange } from "jsr:@std/semver@1.0.3"
/**
 * Check if the SemVer is less than the range.
 *
 * @example Usage
 * ```ts
 * import { parse, parseRange, lessThanRange } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.0.0");
 * const range = parseRange(">=1.2.3 <1.2.4");
 *
 * assert(!lessThanRange(version1, range));
 * assert(lessThanRange(version2, range));
 * ```
 *
 * @param version The version to check.
 * @param range The range to check against.
 * @return `true` if the SemVer is less than the range, `false` otherwise.
 */
const lessThanRange = _function_lessThanRange as typeof _function_lessThanRange
export { lessThanRange }

import { lessOrEqual as _function_lessOrEqual } from "jsr:@std/semver@1.0.3"
/**
 * Less than or equal to comparison for two SemVers.
 *
 * This is equal to `compare(version1, version2) <= 0`.
 *
 * @example Usage
 * ```ts
 * import { parse, lessOrEqual } from "@std/semver";
 * import { assert } from "@std/assert";
 *
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 *
 * assert(lessOrEqual(version1, version2));
 * assert(!lessOrEqual(version2, version1));
 * assert(lessOrEqual(version1, version1));
 * ```
 *
 * @param version1 the first version to compare
 * @param version2 the second version to compare
 * @return `true` if `version1` is less than or equal to `version2`, `false` otherwise
 */
const lessOrEqual = _function_lessOrEqual as typeof _function_lessOrEqual
export { lessOrEqual }
