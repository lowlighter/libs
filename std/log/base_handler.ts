import type { LevelName as _typeAlias_LevelName } from "jsr:@std/log@0.224.9/base-handler"
/**
 * Union of valid log level names
 */
type LevelName = _typeAlias_LevelName
export type { LevelName }

import type { LogLevel as _typeAlias_LogLevel } from "jsr:@std/log@0.224.9/base-handler"
/**
 * Union of valid log levels
 */
type LogLevel = _typeAlias_LogLevel
export type { LogLevel }

import { LogRecord as _class_LogRecord } from "jsr:@std/log@0.224.9/base-handler"
/**
 * An object that encapsulates provided message and arguments as well some
 * metadata that can be later used when formatting a message.
 *
 * @example Usage
 * ```ts
 * import { LogRecord } from "@std/log/logger";
 * import { LogLevels } from "@std/log/levels";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const record = new LogRecord({
 *   msg: "Hello, world!",
 *   args: ["foo", "bar"],
 *   level: LogLevels.INFO,
 *   loggerName: "example",
 * });
 *
 * assertEquals(record.msg, "Hello, world!");
 * assertEquals(record.args, ["foo", "bar"]);
 * assertEquals(record.level, LogLevels.INFO);
 * assertEquals(record.loggerName, "example");
 * ```
 */
class LogRecord extends _class_LogRecord {}
export { LogRecord }

import type { FormatterFunction as _typeAlias_FormatterFunction } from "jsr:@std/log@0.224.9/base-handler"
/**
 * A function type that defines the structure of a formatter function.
 *
 * @param logRecord The log record that needs to be formatted.
 * @return A string representation of the log record.
 */
type FormatterFunction = _typeAlias_FormatterFunction
export type { FormatterFunction }

import type { BaseHandlerOptions as _interface_BaseHandlerOptions } from "jsr:@std/log@0.224.9/base-handler"
/**
 * Options for {@linkcode BaseHandler}.
 */
interface BaseHandlerOptions extends _interface_BaseHandlerOptions {}
export type { BaseHandlerOptions }

import { BaseHandler as _class_BaseHandler } from "jsr:@std/log@0.224.9/base-handler"
/**
 * A base class for all log handlers.
 *
 * This class is abstract and should not be instantiated directly. Instead, it
 * should be extended by other classes that implement the `log` method.
 *
 * @example Usage
 * ```ts
 * import { BaseHandler } from "@std/log/base-handler";
 * import { assertInstanceOf } from "@std/assert/instance-of";
 *
 * class MyHandler extends BaseHandler {
 *   log(msg: string) {
 *     console.log(msg);
 *   }
 * }
 *
 * const handler = new MyHandler("INFO");
 * assertInstanceOf(handler, BaseHandler);
 * ```
 */
abstract class BaseHandler extends _class_BaseHandler {}
export { BaseHandler }
