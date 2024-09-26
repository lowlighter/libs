import { AssertionError as _class_AssertionError } from "jsr:@std/assert@1.0.6/assertion-error"
/**
 * Error thrown when an assertion fails.
 *
 * @example Usage
 * ```ts ignore
 * import { AssertionError } from "@std/assert";
 *
 * try {
 *   throw new AssertionError("foo", { cause: "bar" });
 * } catch (error) {
 *   if (error instanceof AssertionError) {
 *     error.message === "foo"; // true
 *     error.cause === "bar"; // true
 *   }
 * }
 * ```
 */
class AssertionError extends _class_AssertionError {}
export { AssertionError }
