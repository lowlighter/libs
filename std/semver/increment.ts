import type { IncrementOptions as _interface_IncrementOptions } from "jsr:@std/semver@1.0.0/increment"
/**
 * Options for {@linkcode increment}.
 */
interface IncrementOptions extends _interface_IncrementOptions {}
export type { IncrementOptions }

import { increment as _function_increment } from "jsr:@std/semver@1.0.0/increment"
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
const increment = _function_increment
export { increment }
