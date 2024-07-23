import { MAX as _variable_MAX } from "jsr:@std/semver@0.224.3/constants"
/**
 * MAX is a sentinel value used by some range calculations.
 * It is equivalent to `∞.∞.∞`.
 */
const MAX = _variable_MAX
export { MAX }

import { MIN as _variable_MIN } from "jsr:@std/semver@0.224.3/constants"
/**
 * The minimum valid SemVer object. Equivalent to `0.0.0`.
 */
const MIN = _variable_MIN
export { MIN }

import { INVALID as _variable_INVALID } from "jsr:@std/semver@0.224.3/constants"
/**
 * A sentinel value used to denote an invalid SemVer object
 * which may be the result of impossible ranges or comparator operations.
 * @example ```ts
 * import { equals } from "@std/semver/equals";
 * import { parse } from "@std/semver/parse";
 * import { INVALID } from "@std/semver/constants"
 * equals(parse("1.2.3"), INVALID);
 * ```
 */
const INVALID = _variable_INVALID
export { INVALID }

import { ANY as _variable_ANY } from "jsr:@std/semver@0.224.3/constants"
/**
 * ANY is a sentinel value used by some range calculations. It is not a valid
 * SemVer object and should not be used directly.
 * @example ```ts
 * import { equals } from "@std/semver/equals";
 * import { parse } from "@std/semver/parse";
 * import { ANY } from "@std/semver/constants"
 * equals(parse("1.2.3"), ANY); // false
 * ```
 */
const ANY = _variable_ANY
export { ANY }

import { ALL as _variable_ALL } from "jsr:@std/semver@0.224.3/constants"
/**
 * A comparator which will span all valid semantic versions
 */
const ALL = _variable_ALL
export { ALL }

import { NONE as _variable_NONE } from "jsr:@std/semver@0.224.3/constants"
/**
 * A comparator which will not span any semantic versions
 */
const NONE = _variable_NONE
export { NONE }
