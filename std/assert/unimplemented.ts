import { unimplemented as _function_unimplemented } from "jsr:@std/assert@1.0.3/unimplemented"
/**
 * Use this to stub out methods that will throw when invoked.
 *
 * @example Usage
 * ```ts no-eval
 * import { unimplemented } from "@std/assert";
 *
 * unimplemented(); // Throws
 * ```
 *
 * @param msg Optional message to include in the error.
 * @return Never returns, always throws.
 */
const unimplemented = _function_unimplemented as typeof _function_unimplemented
export { unimplemented }
