import type { GenericFunction as _typeAlias_GenericFunction } from "jsr:@std/log@0.224.9/logger"
/**
 * Any function that can be called with any arguments and return any value.
 */
type GenericFunction = _typeAlias_GenericFunction
export type { GenericFunction }

import type { LogRecordOptions as _interface_LogRecordOptions } from "jsr:@std/log@0.224.9/logger"
/**
 * Options for {@linkcode LogRecord}.
 */
interface LogRecordOptions extends _interface_LogRecordOptions {}
export type { LogRecordOptions }

import { LoggerConfig as _class_LoggerConfig } from "jsr:@std/log@0.224.9/logger"
/** UNDOCUMENTED */
class LoggerConfig extends _class_LoggerConfig {}
export { LoggerConfig }

import type { LogConfig as _interface_LogConfig } from "jsr:@std/log@0.224.9/logger"
/** UNDOCUMENTED */
interface LogConfig extends _interface_LogConfig {}
export type { LogConfig }

import { LogRecord as _class_LogRecord } from "jsr:@std/log@0.224.9/logger"
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

import type { LoggerOptions as _interface_LoggerOptions } from "jsr:@std/log@0.224.9/logger"
/**
 * Options for {@linkcode Logger}.
 */
interface LoggerOptions extends _interface_LoggerOptions {}
export type { LoggerOptions }

import { Logger as _class_Logger } from "jsr:@std/log@0.224.9/logger"
/**
 * A logger that can log messages at different levels.
 *
 * @example Usage
 * ```ts
 * import { Logger } from "@std/log/logger";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const logger = new Logger("example", "INFO");
 * const result = logger.info("Hello, world!");
 *
 * assertEquals(result, "Hello, world!");
 * ```
 */
class Logger extends _class_Logger {}
export { Logger }
