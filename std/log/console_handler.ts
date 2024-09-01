import type { ConsoleHandlerOptions as _interface_ConsoleHandlerOptions } from "jsr:@std/log@0.224.6/console-handler"
/** UNDOCUMENTED */
interface ConsoleHandlerOptions extends _interface_ConsoleHandlerOptions {}
export type { ConsoleHandlerOptions }

import { ConsoleHandler as _class_ConsoleHandler } from "jsr:@std/log@0.224.6/console-handler"
/**
 * This is the default logger. It will output color coded log messages to the
 * console via `console.log()`.
 */
class ConsoleHandler extends _class_ConsoleHandler {}
export { ConsoleHandler }
