import type { GenericFunction as _typeAlias_GenericFunction } from "jsr:@std/log@0.224.8/warn"
/**
 * Any function that can be called with any arguments and return any value.
 */
type GenericFunction = _typeAlias_GenericFunction
export type { GenericFunction }

import { warn as _function_warn } from "jsr:@std/log@0.224.8/warn"
/** UNDOCUMENTED */
const warn = _function_warn as typeof _function_warn
export { warn }
