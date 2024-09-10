/**
 * Logging library with the support for terminal and file outputs. Also provides
 * interfaces for building custom loggers.
 *
 * ## Loggers
 *
 * Loggers are objects that you interact with. When you use a logger method it
 * constructs a `LogRecord` and passes it down to its handlers for output. To
 * create custom loggers, specify them in `loggers` when calling `log.setup`.
 *
 * ## Custom message format
 *
 * If you want to override default format of message you can define `formatter`
 * option for handler. It can a function that takes `LogRecord`
 * as argument and outputs string.
 *
 * The default log format is `{levelName} {msg}`.
 *
 * ### Logging Structured JSON Lines
 *
 * To output logs in a structured JSON format you can configure most handlers
 * with a formatter that produces a JSON string. Either use the premade
 * `log.formatters.jsonFormatter` or write your own function that takes a
 * {@linkcode LogRecord} and returns a JSON.stringify'd object.
 * If you want the log to go to stdout then use {@linkcode ConsoleHandler} with
 * the configuration `useColors: false` to turn off the ANSI terminal colours.
 *
 * ```ts
 * import * as log from "@std/log";
 *
 * log.setup({
 *   handlers: {
 *     default: new log.ConsoleHandler("DEBUG", {
 *       formatter: log.formatters.jsonFormatter,
 *       useColors: false,
 *     }),
 *   },
 * });
 * ```
 *
 * The first argument passed to a log function is always treated as the
 * message and will be stringified differently. To have arguments JSON.stringify'd
 * you must pass them after the first.
 *
 * ```ts
 * import * as log from "@std/log";
 *
 * log.info("This is the message", { thisWillBe: "JSON.stringify'd"});
 * // {"level":"INFO","datetime":1702501580505,"message":"This is the message","args":{"thisWillBe":"JSON.stringify'd"}}
 *
 * log.info({ thisWontBe: "JSON.stringify'd"}, "This is an argument");
 * // {"level":"INFO","datetime":1702501580505,"message":"{\"thisWontBe\":\"JSON.stringify'd\"}","args":"This is an argument"}
 * ```
 *
 * ## Inline Logging
 *
 * Log functions return the data passed in the `msg` parameter. Data is returned
 * regardless if the logger actually logs it.
 *
 * ## Lazy Log Evaluation
 *
 * Some log statements are expensive to compute. In these cases, you can use
 * lazy log evaluation to prevent the computation taking place if the logger
 * won't log the message.
 *
 * > NOTE: When using lazy log evaluation, `undefined` will be returned if the
 * > resolver function is not called because the logger won't log it. It is an
 * > antipattern use lazy evaluation with inline logging because the return value
 * > depends on the current log level.
 *
 * ## For module authors
 *
 * The authors of public modules can let the users display the internal logs of the
 * module by using a custom logger:
 *
 * ```ts
 * import { getLogger } from "@std/log";
 *
 * function logger() {
 *   return getLogger("my-awesome-module");
 * }
 *
 * export function sum(a: number, b: number) {
 *   logger().debug(`running ${a} + ${b}`);
 *   return a + b;
 * }
 *
 * export function mult(a: number, b: number) {
 *   logger().debug(`running ${a} * ${b}`);
 *   return a * b;
 * }
 * ```
 *
 * The user of the module can then display the internal logs with:
 *
 * ```ts, ignore
 * import * as log from "@std/log";
 * import { sum } from "<the-awesome-module>/mod.ts";
 *
 * log.setup({
 *   handlers: {
 *     console: new log.ConsoleHandler("DEBUG"),
 *   },
 *
 *   loggers: {
 *     "my-awesome-module": {
 *       level: "DEBUG",
 *       handlers: ["console"],
 *     },
 *   },
 * });
 *
 * sum(1, 2); // prints "running 1 + 2" to the console
 * ```
 *
 * Please note that, due to the order of initialization of the loggers, the
 * following won't work:
 *
 * ```ts
 * import { getLogger } from "@std/log";
 *
 * const logger = getLogger("my-awesome-module");
 *
 * export function sum(a: number, b: number) {
 *   logger.debug(`running ${a} + ${b}`); // no message will be logged, because getLogger() was called before log.setup()
 *   return a + b;
 * }
 * ```
 *
 * @example ```ts
 * import * as log from "@std/log";
 *
 * // Simple default logger out of the box. You can customize it
 * // by overriding logger and handler named "default", or providing
 * // additional logger configurations. You can log any data type.
 * log.debug("Hello world");
 * log.info(123456);
 * log.warn(true);
 * log.error({ foo: "bar", fizz: "bazz" });
 * log.critical("500 Internal server error");
 *
 * // custom configuration with 2 loggers (the default and `tasks` loggers).
 * log.setup({
 *   handlers: {
 *     console: new log.ConsoleHandler("DEBUG"),
 *
 *     file: new log.FileHandler("WARN", {
 *       filename: "./log.txt",
 *       // you can change format of output message using any keys in `LogRecord`.
 *       formatter: (record) => `${record.levelName} ${record.msg}`,
 *     }),
 *   },
 *
 *   loggers: {
 *     // configure default logger available via short-hand methods above.
 *     default: {
 *       level: "DEBUG",
 *       handlers: ["console", "file"],
 *     },
 *
 *     tasks: {
 *       level: "ERROR",
 *       handlers: ["console"],
 *     },
 *   },
 * });
 *
 * let logger;
 *
 * // get default logger.
 * logger = log.getLogger();
 * logger.debug("fizz"); // logs to `console`, because `file` handler requires "WARN" level.
 * logger.warn(41256); // logs to both `console` and `file` handlers.
 *
 * // get custom logger
 * logger = log.getLogger("tasks");
 * logger.debug("fizz"); // won't get output because this logger has "ERROR" level.
 * logger.error({ productType: "book", value: "126.11" }); // log to `console`.
 *
 * // if you try to use a logger that hasn't been configured
 * // you're good to go, it gets created automatically with level set to 0
 * // so no message is logged.
 * const unknownLogger = log.getLogger("mystery");
 * unknownLogger.info("foobar"); // no-op
 * ```
 *
 * @example Custom message format example
 * ```ts
 * import * as log from "@std/log";
 *
 * log.setup({
 *   handlers: {
 *     stringFmt: new log.ConsoleHandler("DEBUG", {
 *       formatter: (record) => `[${record.levelName}] ${record.msg}`,
 *     }),
 *
 *     functionFmt: new log.ConsoleHandler("DEBUG", {
 *       formatter: (logRecord) => {
 *         let msg = `${logRecord.level} ${logRecord.msg}`;
 *
 *         logRecord.args.forEach((arg, index) => {
 *           msg += `, arg${index}: ${arg}`;
 *         });
 *
 *         return msg;
 *       },
 *     }),
 *
 *     anotherFmt: new log.ConsoleHandler("DEBUG", {
 *       formatter: (record) => `[${record.loggerName}] - ${record.levelName} ${record.msg}`,
 *     }),
 *   },
 *
 *   loggers: {
 *     default: {
 *       level: "DEBUG",
 *       handlers: ["stringFmt", "functionFmt"],
 *     },
 *     dataLogger: {
 *       level: "INFO",
 *       handlers: ["anotherFmt"],
 *     },
 *   },
 * });
 *
 * // calling:
 * log.debug("Hello, world!", 1, "two", [3, 4, 5]);
 * // results in: [DEBUG] Hello, world!
 * // output from "stringFmt" handler.
 * // 10 Hello, world!, arg0: 1, arg1: two, arg3: [3, 4, 5] // output from "functionFmt" formatter.
 *
 * // calling:
 * log.getLogger("dataLogger").error("oh no!");
 * // results in:
 * // [dataLogger] - ERROR oh no! // output from anotherFmt handler.
 * ```
 *
 * @example JSON to stdout with no color example
 * ```ts
 * import * as log from "@std/log";
 *
 * log.setup({
 *   handlers: {
 *     jsonStdout: new log.ConsoleHandler("DEBUG", {
 *       formatter: log.formatters.jsonFormatter,
 *       useColors: false,
 *     }),
 *   },
 *
 *   loggers: {
 *     default: {
 *       level: "DEBUG",
 *       handlers: ["jsonStdout"],
 *     },
 *   },
 * });
 *
 * // calling:
 * log.info("Hey");
 * // results in:
 * // {"level":"INFO","datetime":1702481922294,"message":"Hey"}
 *
 * // calling:
 * log.info("Hey", { product: "nail" });
 * // results in:
 * // {"level":"INFO","datetime":1702484111115,"message":"Hey","args":{"product":"nail"}}
 *
 * // calling:
 * log.info("Hey", 1, "two", [3, 4, 5]);
 * // results in:
 * // {"level":"INFO","datetime":1702481922294,"message":"Hey","args":[1,"two",[3,4,5]]}
 * ```
 *
 * @example Custom JSON example
 * ```ts
 * import * as log from "@std/log";
 *
 * log.setup({
 *   handlers: {
 *     customJsonFmt: new log.ConsoleHandler("DEBUG", {
 *       formatter: (record) => JSON.stringify({
 *         lvl: record.level,
 *         msg: record.msg,
 *         time: record.datetime.toISOString(),
 *         name: record.loggerName,
 *       }),
 *       useColors: false,
 *     }),
 *   },
 *
 *   loggers: {
 *     default: {
 *       level: "DEBUG",
 *       handlers: ["customJsonFmt"],
 *     },
 *   },
 * });
 *
 * // calling:
 * log.info("complete");
 * // results in:
 * // {"lvl":20,"msg":"complete","time":"2023-12-13T16:38:27.328Z","name":"default"}
 * ```
 *
 * @example Inline Logging
 * ```ts
 * import * as logger from "@std/log";
 *
 * const stringData: string = logger.debug("hello world");
 * const booleanData: boolean = logger.debug(true, 1, "abc");
 * const fn = (): number => {
 *   return 123;
 * };
 * const resolvedFunctionData: number = logger.debug(fn());
 * console.log(stringData); // 'hello world'
 * console.log(booleanData); // true
 * console.log(resolvedFunctionData); // 123
 * ```
 *
 * @example Lazy Log Evaluation
 * ```ts
 * import * as log from "@std/log";
 *
 * log.setup({
 *   handlers: {
 *     console: new log.ConsoleHandler("DEBUG"),
 *   },
 *
 *   loggers: {
 *     tasks: {
 *       level: "ERROR",
 *       handlers: ["console"],
 *     },
 *   },
 * });
 *
 * function someExpensiveFn(num: number, bool: boolean) {
 *   // do some expensive computation
 * }
 *
 * // not logged, as debug < error.
 * const data = log.debug(() => someExpensiveFn(5, true));
 * console.log(data); // undefined
 * ```
 *
 * Handlers are responsible for actual output of log messages. When a handler is
 * called by a logger, it firstly checks that {@linkcode LogRecord}'s level is
 * not lower than level of the handler. If level check passes, handlers formats
 * log record into string and outputs it to target.
 *
 * ## Custom handlers
 *
 * Custom handlers can be implemented by subclassing {@linkcode BaseHandler} or
 * {@linkcode WriterHandler}.
 *
 * {@linkcode BaseHandler} is bare-bones handler that has no output logic at all,
 *
 * {@linkcode WriterHandler} is an abstract class that supports any target with
 * `Writer` interface.
 *
 * During setup async hooks `setup` and `destroy` are called, you can use them
 * to open and close file/HTTP connection or any other action you might need.
 *
 * For examples check source code of {@linkcode FileHandler}`
 * and {@linkcode TestHandler}.
 *
 * @module
 */
import type { FormatterFunction as _typeAlias_FormatterFunction } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
type FormatterFunction = _typeAlias_FormatterFunction
export type { FormatterFunction }

import type { BaseHandlerOptions as _interface_BaseHandlerOptions } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
interface BaseHandlerOptions extends _interface_BaseHandlerOptions {}
export type { BaseHandlerOptions }

import { BaseHandler as _class_BaseHandler } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
abstract class BaseHandler extends _class_BaseHandler {}
export { BaseHandler }

import type { ConsoleHandlerOptions as _interface_ConsoleHandlerOptions } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
interface ConsoleHandlerOptions extends _interface_ConsoleHandlerOptions {}
export type { ConsoleHandlerOptions }

import { ConsoleHandler as _class_ConsoleHandler } from "jsr:@std/log@0.224.7"
/**
 * This is the default logger. It will output color coded log messages to the
 * console via `console.log()`.
 */
class ConsoleHandler extends _class_ConsoleHandler {}
export { ConsoleHandler }

import type { LogMode as _typeAlias_LogMode } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
type LogMode = _typeAlias_LogMode
export type { LogMode }

import type { FileHandlerOptions as _interface_FileHandlerOptions } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
interface FileHandlerOptions extends _interface_FileHandlerOptions {}
export type { FileHandlerOptions }

import { FileHandler as _class_FileHandler } from "jsr:@std/log@0.224.7"
/**
 * This handler will output to a file using an optional mode (default is `a`,
 * e.g. append). The file will grow indefinitely. It uses a buffer for writing
 * to file. Logs can be manually flushed with `fileHandler.flush()`. Log
 * messages with a log level greater than error are immediately flushed. Logs
 * are also flushed on process completion.
 *
 * Behavior of the log modes is as follows:
 *
 * - `'a'` - Default mode. Appends new log messages to the end of an existing log
 *   file, or create a new log file if none exists.
 * - `'w'` - Upon creation of the handler, any existing log file will be removed
 *   and a new one created.
 * - `'x'` - This will create a new log file and throw an error if one already
 *   exists.
 *
 * This handler requires `--allow-write` permission on the log file.
 */
class FileHandler extends _class_FileHandler {}
export { FileHandler }

import { RotatingFileHandler as _class_RotatingFileHandler } from "jsr:@std/log@0.224.7"
/**
 * This handler extends the functionality of the {@linkcode FileHandler} by
 * "rotating" the log file when it reaches a certain size. `maxBytes` specifies
 * the maximum size in bytes that the log file can grow to before rolling over
 * to a new one. If the size of the new log message plus the current log file
 * size exceeds `maxBytes` then a roll-over is triggered. When a roll-over
 * occurs, before the log message is written, the log file is renamed and
 * appended with `.1`. If a `.1` version already existed, it would have been
 * renamed `.2` first and so on. The maximum number of log files to keep is
 * specified by `maxBackupCount`. After the renames are complete the log message
 * is written to the original, now blank, file.
 *
 * Example: Given `log.txt`, `log.txt.1`, `log.txt.2` and `log.txt.3`, a
 * `maxBackupCount` of 3 and a new log message which would cause `log.txt` to
 * exceed `maxBytes`, then `log.txt.2` would be renamed to `log.txt.3` (thereby
 * discarding the original contents of `log.txt.3` since 3 is the maximum number
 * of backups to keep), `log.txt.1` would be renamed to `log.txt.2`, `log.txt`
 * would be renamed to `log.txt.1` and finally `log.txt` would be created from
 * scratch where the new log message would be written.
 *
 * This handler uses a buffer for writing log messages to file. Logs can be
 * manually flushed with `fileHandler.flush()`. Log messages with a log level
 * greater than ERROR are immediately flushed. Logs are also flushed on process
 * completion.
 *
 * Additional notes on `mode` as described above:
 *
 * - `'a'` Default mode. As above, this will pick up where the logs left off in
 *   rotation, or create a new log file if it doesn't exist.
 * - `'w'` in addition to starting with a clean `filename`, this mode will also
 *   cause any existing backups (up to `maxBackupCount`) to be deleted on setup
 *   giving a fully clean slate.
 * - `'x'` requires that neither `filename`, nor any backups (up to
 *   `maxBackupCount`), exist before setup.
 *
 * This handler requires both `--allow-read` and `--allow-write` permissions on
 * the log files.
 */
class RotatingFileHandler extends _class_RotatingFileHandler {}
export { RotatingFileHandler }

import { LogLevels as _variable_LogLevels } from "jsr:@std/log@0.224.7"
/**
 * Use this to retrieve the numeric log level by it's associated name.
 * Defaults to INFO.
 */
const LogLevels = _variable_LogLevels as typeof _variable_LogLevels
export { LogLevels }

import type { LogLevel as _typeAlias_LogLevel } from "jsr:@std/log@0.224.7"
/**
 * Union of valid log levels
 */
type LogLevel = _typeAlias_LogLevel
export type { LogLevel }

import type { LevelName as _typeAlias_LevelName } from "jsr:@std/log@0.224.7"
/**
 * Union of valid log level names
 */
type LevelName = _typeAlias_LevelName
export type { LevelName }

import { LogLevelNames as _variable_LogLevelNames } from "jsr:@std/log@0.224.7"
/**
 * Permitted log level names
 */
const LogLevelNames = _variable_LogLevelNames as typeof _variable_LogLevelNames
export { LogLevelNames }

import { getLevelByName as _function_getLevelByName } from "jsr:@std/log@0.224.7"
/**
 * Returns the numeric log level associated with the passed,
 * stringy log level name.
 */
const getLevelByName = _function_getLevelByName as typeof _function_getLevelByName
export { getLevelByName }

import { getLevelName as _function_getLevelName } from "jsr:@std/log@0.224.7"
/**
 * Returns the stringy log level name provided the numeric log level.
 */
const getLevelName = _function_getLevelName as typeof _function_getLevelName
export { getLevelName }

import type { GenericFunction as _typeAlias_GenericFunction } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
type GenericFunction = _typeAlias_GenericFunction
export type { GenericFunction }

import type { LogRecordOptions as _interface_LogRecordOptions } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
interface LogRecordOptions extends _interface_LogRecordOptions {}
export type { LogRecordOptions }

import { LoggerConfig as _class_LoggerConfig } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
class LoggerConfig extends _class_LoggerConfig {}
export { LoggerConfig }

import type { LogConfig as _interface_LogConfig } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
interface LogConfig extends _interface_LogConfig {}
export type { LogConfig }

import { LogRecord as _class_LogRecord } from "jsr:@std/log@0.224.7"
/**
 * An object that encapsulates provided message and arguments as well some
 * metadata that can be later used when formatting a message.
 */
class LogRecord extends _class_LogRecord {}
export { LogRecord }

import type { LoggerOptions as _interface_LoggerOptions } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
interface LoggerOptions extends _interface_LoggerOptions {}
export type { LoggerOptions }

import { Logger as _class_Logger } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
class Logger extends _class_Logger {}
export { Logger }

import { jsonFormatter as _function_jsonFormatter } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
const jsonFormatter = _function_jsonFormatter as typeof _function_jsonFormatter
export { jsonFormatter }

import { formatters as _variable_formatters } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
const formatters = _variable_formatters as typeof _variable_formatters
export { formatters }

import { critical as _function_critical } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
const critical = _function_critical as typeof _function_critical
export { critical }

import { debug as _function_debug } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
const debug = _function_debug as typeof _function_debug
export { debug }

import { error as _function_error } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
const error = _function_error as typeof _function_error
export { error }

import { getLogger as _function_getLogger } from "jsr:@std/log@0.224.7"
/**
 * Get a logger instance. If not specified `name`, get the default logger.
 */
const getLogger = _function_getLogger as typeof _function_getLogger
export { getLogger }

import { info as _function_info } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
const info = _function_info as typeof _function_info
export { info }

import { setup as _function_setup } from "jsr:@std/log@0.224.7"
/**
 * Setup logger config.
 */
const setup = _function_setup as typeof _function_setup
export { setup }

import { warn as _function_warn } from "jsr:@std/log@0.224.7"
/** UNDOCUMENTED */
const warn = _function_warn as typeof _function_warn
export { warn }
