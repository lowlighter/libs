import type { Prng as _typeAlias_Prng } from "jsr:@std/random@0.1.0/sample"
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

import type { RandomOptions as _typeAlias_RandomOptions } from "jsr:@std/random@0.1.0/sample"
/**
 * Options for random number generation.
 *
 * @experimental
 */
type RandomOptions = _typeAlias_RandomOptions
export type { RandomOptions }

import type { SampleOptions as _typeAlias_SampleOptions } from "jsr:@std/random@0.1.0/sample"
/**
 * Options for {@linkcode sample}.
 *
 * @experimental
 */
type SampleOptions = _typeAlias_SampleOptions
export type { SampleOptions }

import { sample as _function_sample } from "jsr:@std/random@0.1.0/sample"
/**
 * Returns a random element from the given array.
 *
 * @experimental
 * @template T The type of the elements in the array.
 * @template O The type of the accumulator.
 *
 * @param array The array to sample from.
 * @param options Options modifying the sampling behavior.
 *
 * @return A random element from the given array, or `undefined` if the array
 * is empty.
 *
 * @example Basic usage
 * ```ts
 * import { sample } from "@std/random/sample";
 * import { assertArrayIncludes } from "@std/assert";
 *
 * const numbers = [1, 2, 3, 4];
 * const sampled = sample(numbers);
 *
 * assertArrayIncludes(numbers, [sampled]);
 * ```
 *
 * @example Using `weights` option
 * ```ts no-assert
 * import { sample } from "@std/random/sample";
 *
 * const values = ["a", "b", "c"];
 * const weights = [5, 3, 2];
 * const result = sample(values, { weights });
 * // gives "a" 50% of the time, "b" 30% of the time, and "c" 20% of the time
 * ```
 */
const sample = _function_sample as typeof _function_sample
export { sample }
