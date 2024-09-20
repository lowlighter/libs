import type { Prng as _typeAlias_Prng } from "jsr:@std/random@0.1.0/integer-between"
/**
 * A pseudo-random number generator implementing the same contract as
 * `Math.random`, i.e. taking zero arguments and returning a random number in
 * the range `[0, 1)`. The behavior of a function that accepts a `Prng` an
 * option may be customized by passing a `Prng` with different behavior from
 * `Math.random`, for example it may be seeded.
 *
 * @experimental
 */
type Prng = _typeAlias_Prng
export type { Prng }

import type { RandomOptions as _typeAlias_RandomOptions } from "jsr:@std/random@0.1.0/integer-between"
/**
 * Options for random number generation.
 *
 * @experimental
 */
type RandomOptions = _typeAlias_RandomOptions
export type { RandomOptions }

import { randomIntegerBetween as _function_randomIntegerBetween } from "jsr:@std/random@0.1.0/integer-between"
/**
 * Generates a random integer between the provided minimum and maximum values.
 *
 * The number is in the range `[min, max]`, i.e. both `min` and `max` are included.
 *
 * @experimental
 * @param min The minimum value (inclusive)
 * @param max The maximum value (inclusive)
 * @param options The options for the random number generator
 * @return A random integer between the provided minimum and maximum values
 *
 * @example Usage
 * ```ts no-assert
 * import { randomIntegerBetween } from "@std/random";
 *
 * randomIntegerBetween(1, 10); // 7
 * randomIntegerBetween(1, 10); // 9
 * randomIntegerBetween(1, 10); // 2
 * ```
 */
const randomIntegerBetween = _function_randomIntegerBetween as typeof _function_randomIntegerBetween
export { randomIntegerBetween }
