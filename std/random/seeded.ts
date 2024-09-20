import { randomSeeded as _function_randomSeeded } from "jsr:@std/random@0.1.0/seeded"
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
