import { aggregateGroups as _function_aggregateGroups } from "jsr:@std/collections@1.0.6/aggregate-groups"
/**
 * Applies the given aggregator to each group in the given grouping, returning the
 * results together with the respective group keys
 *
 * @template T Type of the values in the input record.
 * @template A Type of the accumulator value, which will match the returned
 * record's values.
 *
 * @param record The grouping to aggregate.
 * @param aggregator The function to apply to each group.
 *
 * @return A record with the same keys as the input record, but with the values
 * being the result of applying the aggregator to each group.
 *
 * @example Basic usage
 * ```ts
 * import { aggregateGroups } from "@std/collections/aggregate-groups";
 * import { assertEquals } from "@std/assert";
 *
 * const foodProperties = {
 *   Curry: ["spicy", "vegan"],
 *   Omelette: ["creamy", "vegetarian"],
 * };
 *
 * const descriptions = aggregateGroups(
 *   foodProperties,
 *   (current, key, first, acc) => {
 *     return first
 *       ? `${key} is ${current}`
 *       : `${acc} and ${current}`;
 *   },
 * );
 *
 * assertEquals(descriptions, {
 *   Curry: "Curry is spicy and vegan",
 *   Omelette: "Omelette is creamy and vegetarian",
 * });
 * ```
 */
const aggregateGroups = _function_aggregateGroups as typeof _function_aggregateGroups
export { aggregateGroups }
