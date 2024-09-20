/**
 * Utilities for generating random numbers.
 *
 * ```ts
 * import { randomIntegerBetween } from "@std/random";
 * import { randomSeeded } from "@std/random";
 * import { assertEquals } from "@std/assert";
 *
 * const prng = randomSeeded(1n);
 *
 * assertEquals(randomIntegerBetween(1, 10, { prng }), 3);
 * ```
 *
 * @experimental
 * @module
 */
import type { Prng as _typeAlias_Prng } from "jsr:@std/random@0.1.0"
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

import type { RandomOptions as _typeAlias_RandomOptions } from "jsr:@std/random@0.1.0"
/**
 * Options for random number generation.
 *
 * @experimental
 */
type RandomOptions = _typeAlias_RandomOptions
export type { RandomOptions }

import { randomBetween as _function_randomBetween } from "jsr:@std/random@0.1.0"
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

import { randomIntegerBetween as _function_randomIntegerBetween } from "jsr:@std/random@0.1.0"
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

import type { SampleOptions as _typeAlias_SampleOptions } from "jsr:@std/random@0.1.0"
/**
 * Options for {@linkcode sample}.
 *
 * @experimental
 */
type SampleOptions = _typeAlias_SampleOptions
export type { SampleOptions }

import { sample as _function_sample } from "jsr:@std/random@0.1.0"
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

import { randomSeeded as _function_randomSeeded } from "jsr:@std/random@0.1.0"
/**
 * Creates a pseudo-random number generator that generates random numbers in
 * the range `[0, 1)`, based on the given seed. The algorithm used for
 * generation is {@link https://www.pcg-random.org/download.html | PCG32}.
 *
 * @experimental
 * @param seed The seed used to initialize the random number generator's state.
 * @return A pseudo-random number generator function, which will generate
 * different random numbers on each call.
 *
 * @example Usage
 * ```ts
 * import { randomSeeded } from "@std/random";
 * import { assertEquals } from "@std/assert";
 *
 * const prng = randomSeeded(1n);
 *
 * assertEquals(prng(), 0.20176767697557807);
 * assertEquals(prng(), 0.4911644416861236);
 * assertEquals(prng(), 0.7924694607499987);
 * ```
 */
const randomSeeded = _function_randomSeeded as typeof _function_randomSeeded
export { randomSeeded }

import { shuffle as _function_shuffle } from "jsr:@std/random@0.1.0"
/**
 * Shuffles the provided array, returning a copy and without modifying the original array.
 *
 * @experimental
 * @template T The type of the items in the array
 * @param items The items to shuffle
 * @param options The options for the random number generator
 * @return A shuffled copy of the provided items
 *
 * @example Usage
 * ```ts no-assert
 * import { shuffle } from "@std/random";
 *
 * const items = [1, 2, 3, 4, 5];
 *
 * shuffle(items); // [2, 5, 1, 4, 3]
 * shuffle(items); // [3, 4, 5, 1, 2]
 * shuffle(items); // [5, 2, 4, 3, 1]
 *
 * items; // [1, 2, 3, 4, 5] (original array is unchanged)
 * ```
 */
const shuffle = _function_shuffle as typeof _function_shuffle
export { shuffle }
