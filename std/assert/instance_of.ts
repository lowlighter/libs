import type { AnyConstructor as _typeAlias_AnyConstructor } from "jsr:@std/assert@1.0.2/instance-of"
/**
 * Any constructor
 */
type AnyConstructor = _typeAlias_AnyConstructor
export type { AnyConstructor }

import type { GetConstructorType as _typeAlias_GetConstructorType } from "jsr:@std/assert@1.0.2/instance-of"
/**
 * Gets constructor type
 */
type GetConstructorType<T extends AnyConstructor> = _typeAlias_GetConstructorType<T>
export type { GetConstructorType }

import { assertInstanceOf as _function_assertInstanceOf } from "jsr:@std/assert@1.0.2/instance-of"
/**
 * Make an assertion that `obj` is an instance of `type`.
 * If not then throw.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertInstanceOf } from "@std/assert";
 *
 * assertInstanceOf(new Date(), Date); // Doesn't throw
 * assertInstanceOf(new Date(), Number); // Throws
 * ```
 *
 * @template T The expected type of the object.
 * @param actual The object to check.
 * @param expectedType The expected class constructor.
 * @param msg The optional message to display if the assertion fails.
 */
const assertInstanceOf = _function_assertInstanceOf as typeof _function_assertInstanceOf
export { assertInstanceOf }
