import type { Prng as _typeAlias_Prng } from "jsr:@std/random@0.1.0/shuffle"
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

import type { RandomOptions as _typeAlias_RandomOptions } from "jsr:@std/random@0.1.0/shuffle"
/**
 * Options for random number generation.
 *
 * @experimental
 */
type RandomOptions = _typeAlias_RandomOptions
export type { RandomOptions }

import { shuffle as _function_shuffle } from "jsr:@std/random@0.1.0/shuffle"
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
