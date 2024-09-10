import { assertNever as _function_assertNever } from "jsr:@std/assert@1.0.4/never"
/**
 * Make an assertion that `x` is of type `never`.
 * If not then throw.
 *
 * @experimental
 * @example Exhaustivenss check
 * ```ts
 * import { assertNever } from "@std/assert/never";
 *
 * type Kinds = "A" | "B";
 *
 * function handleKind(kind: Kinds) {
 *   switch (kind) {
 *     case "A":
 *       doA();
 *       break;
 *     case "B":
 *       doB();
 *       break;
 *     default:
 *       assertNever(kind);
 *   }
 * }
 *
 * function doA() {
 *   // ...
 * }
 *
 * function doB() {
 *   // ...
 * }
 * ```
 *
 * @example Compile-time error when there is a missing case
 * ```ts expect-error ignore
 * import { assertNever } from "@std/assert/never";
 *
 * type Kinds = "A" | "B" | "C";
 *
 * function handleKind(kind: Kinds) {
 *   switch (kind) {
 *     case "A":
 *       doA();
 *       break;
 *     case "B":
 *       doB();
 *       break;
 *     default:
 *       // Type error since "C" is not handled
 *       assertNever(kind);
 *   }
 * }
 *
 * function doA() {
 *   // ...
 * }
 *
 * function doB() {
 *   // ...
 * }
 * ```
 *
 * @param x The value to be checked as never
 * @param msg The optional message to display if the assertion fails.
 * @return Never returns, always throws.
 * @throws
 */
const assertNever = _function_assertNever as typeof _function_assertNever
export { assertNever }
