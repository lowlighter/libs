import type { Ansi as _typeAlias_Ansi } from "jsr:@std/cli@1.0.6/unstable-spinner"
/**
 * This is a hack to allow us to use the same type for both the color name and
 * an ANSI escape code.
 *
 * @see {@link https://github.com/microsoft/TypeScript/issues/29729#issuecomment-460346421}
 *
 * @internal
 */
type Ansi = _typeAlias_Ansi
export type { Ansi }

import type { Color as _typeAlias_Color } from "jsr:@std/cli@1.0.6/unstable-spinner"
/**
 * Color options for {@linkcode SpinnerOptions.color}.
 *
 * @experimental
 */
type Color = _typeAlias_Color
export type { Color }

import type { SpinnerOptions as _interface_SpinnerOptions } from "jsr:@std/cli@1.0.6/unstable-spinner"
/**
 * Options for {@linkcode Spinner}.
 *
 * @experimental
 */
interface SpinnerOptions extends _interface_SpinnerOptions {}
export type { SpinnerOptions }

import { Spinner as _class_Spinner } from "jsr:@std/cli@1.0.6/unstable-spinner"
/**
 * A spinner that can be used to indicate that something is loading.
 *
 * @experimental
 * @example Usage
 * ```ts no-eval
 * import { Spinner } from "@std/cli/unstable-spinner";
 *
 * const spinner = new Spinner({ message: "Loading...", color: "yellow" });
 * spinner.start();
 *
 * setTimeout(() => {
 *  spinner.stop();
 *  console.log("Finished loading!");
 * }, 3_000);
 * ```
 */
class Spinner extends _class_Spinner {}
export { Spinner }
