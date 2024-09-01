import type { Falsy as _typeAlias_Falsy } from "jsr:@std/assert@1.0.3/false"
/**
 * Assertion condition for {@linkcode assertFalse}.
 */
type Falsy = _typeAlias_Falsy
export type { Falsy }

import { assertFalse as _function_assertFalse } from "jsr:@std/assert@1.0.3/false"
/**
 * Make an assertion, error will be thrown if `expr` have truthy value.
 *
 * @example Usage
 * ```ts no-eval
 * import { assertFalse } from "@std/assert";
 *
 * assertFalse(false); // Doesn't throw
 * assertFalse(true); // Throws
 * ```
 *
 * @param expr The expression to test.
 * @param msg The optional message to display if the assertion fails.
 */
const assertFalse = _function_assertFalse as typeof _function_assertFalse
export { assertFalse }
