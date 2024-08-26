import { ascend as _function_ascend } from "jsr:@std/data-structures@1.0.1/comparators"
/**
 * Compare two values in ascending order using JavaScript's built in comparison
 * operators.
 *
 * @example Comparing numbers
 * ```ts
 * import { ascend } from "@std/data-structures";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(ascend(1, 2), -1);
 * assertEquals(ascend(2, 1), 1);
 * assertEquals(ascend(1, 1), 0);
 * ```
 *
 * @template T The type of the values being compared.
 * @param a The left comparison value.
 * @param b The right comparison value.
 * @return -1 if `a` is less than `b`, 0 if `a` is equal to `b`, and 1 if `a` is greater than `b`.
 */
const ascend = _function_ascend as typeof _function_ascend
export { ascend }

import { descend as _function_descend } from "jsr:@std/data-structures@1.0.1/comparators"
/**
 * Compare two values in descending order using JavaScript's built in comparison
 * operators.
 *
 * @example Comparing numbers
 * ```ts
 * import { descend } from "@std/data-structures";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(descend(1, 2), 1);
 * assertEquals(descend(2, 1), -1);
 * assertEquals(descend(1, 1), 0);
 * ```
 *
 * @template T The type of the values being compared.
 * @param a The left comparison value.
 * @param b The right comparison value.
 * @return -1 if `a` is greater than `b`, 0 if `a` is equal to `b`, and 1 if `a` is less than `b`.
 */
const descend = _function_descend as typeof _function_descend
export { descend }
