import type { ConsoleHandlerOptions as _interface_ConsoleHandlerOptions } from "jsr:@std/log@0.224.9/console-handler"
/**
 * Options for {@linkcode ConsoleHandler}.
 */
interface ConsoleHandlerOptions extends _interface_ConsoleHandlerOptions {}
export type { ConsoleHandlerOptions }

import { ConsoleHandler as _class_ConsoleHandler } from "jsr:@std/log@0.224.9/console-handler"
/**
 * Default logger that outputs log messages to the console via
 * {@linkcode console.log}.
 *
 * @example Usage
 * ```ts no-assert
 * import { ConsoleHandler } from "@std/log/console-handler";
 *
 * const handler = new ConsoleHandler("INFO");
 * handler.log("Hello, world!"); // Prints "Hello, world!"
 * ```
 */
class ConsoleHandler extends _class_ConsoleHandler {}
export { ConsoleHandler }
