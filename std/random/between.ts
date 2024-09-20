import type { Prng as _typeAlias_Prng } from "jsr:@std/random@0.1.0/between"
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

import type { RandomOptions as _typeAlias_RandomOptions } from "jsr:@std/random@0.1.0/between"
/**
 * Options for random number generation.
 *
 * @experimental
 */
type RandomOptions = _typeAlias_RandomOptions
export type { RandomOptions }

import { randomBetween as _function_randomBetween } from "jsr:@std/random@0.1.0/between"
/**
 * Generates a random number between the provided minimum and maximum values.
 *
 * The number is in the range `[min, max)`, i.e. `min` is included but `max` is excluded.
 *
 * @experimental
 * @param min The minimum value (inclusive)
 * @param max The maximum value (exclusive)
 * @param options The options for the random number generator
 * @return A random number between the provided minimum and maximum values
 *
 * @example Usage
 * ```ts no-assert
 * import { randomBetween } from "@std/random";
 *
 * randomBetween(1, 10); // 6.688009464410508
 * randomBetween(1, 10); // 3.6267118101712006
 * randomBetween(1, 10); // 7.853320239013774
 * ```
 */
const randomBetween = _function_randomBetween as typeof _function_randomBetween
export { randomBetween }
