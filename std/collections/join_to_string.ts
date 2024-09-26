import type { JoinToStringOptions as _typeAlias_JoinToStringOptions } from "jsr:@std/collections@1.0.7/join-to-string"
/**
 * Options for {@linkcode joinToString}.
 */
type JoinToStringOptions = _typeAlias_JoinToStringOptions
export type { JoinToStringOptions }

import { joinToString as _function_joinToString } from "jsr:@std/collections@1.0.7/join-to-string"
/**
 * Transforms the elements in the given array to strings using the given
 * selector. Joins the produced strings into one using the given `separator`
 * and applying the given `prefix` and `suffix` to the whole string afterwards.
 *
 * If the array could be huge, you can specify a non-negative value of `limit`,
 * in which case only the first `limit` elements will be appended, followed by
 * the `truncated` string.
 *
 * @template T The type of the elements in the input array.
 *
 * @param array The array to join elements from.
 * @param selector The function to transform elements to strings.
 * @param options The options to configure the joining.
 *
 * @return The resulting string.
 *
 * @example Usage with options
 * ```ts
 * import { joinToString } from "@std/collections/join-to-string";
 * import { assertEquals } from "@std/assert";
 *
 * const users = [
 *   { name: "Kim" },
 *   { name: "Anna" },
 *   { name: "Tim" },
 * ];
 *
 * const message = joinToString(users, (user) => user.name, {
 *   suffix: " are winners",
 *   prefix: "result: ",
 *   separator: " and ",
 *   limit: 1,
 *   truncated: "others",
 * });
 *
 * assertEquals(message, "result: Kim and others are winners");
 * ```
 */
const joinToString = _function_joinToString as typeof _function_joinToString
export { joinToString }
