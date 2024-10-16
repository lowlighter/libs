import { Logger as _class_Logger } from "jsr:@std/log@0.224.9/get-logger"
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

import { getLogger as _function_getLogger } from "jsr:@std/log@0.224.9/get-logger"
/**
 * Get a logger instance. If not specified `name`, get the default logger.
 *
 * @param name The name of the logger.
 * @return The logger instance.
 *
 * @example Usage (without defined name and minimal setup)
 * ```ts
 * import { getLogger } from "@std/log/get-logger";
 * import "@std/log/setup";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const logger = getLogger();
 * const result = logger.info("Hello world!"); // Prints "INFO Hello world!" in blue
 *
 * assertEquals(result, "Hello world!");
 * ```
 *
 * @example Usage (without defined name and custom setup)
 * ```ts
 * import { getLogger } from "@std/log/get-logger";
 * import { ConsoleHandler } from "@std/log/console-handler";
 * import { setup } from "@std/log/setup";
 * import { assertEquals } from "@std/assert/equals";
 *
 * setup({
 *   handlers: {
 *     console: new ConsoleHandler("DEBUG"),
 *   },
 *   loggers: {
 *     default: {
 *       level: "DEBUG",
 *       handlers: ["console"],
 *     },
 *   },
 * });
 *
 * const logger = getLogger();
 *
 * const result = logger.info("Hello world!"); // Prints "INFO Hello world!" in blue
 *
 * assertEquals(result, "Hello world!");
 * ```
 *
 * @example Usage (with defined name)
 * ```ts
 * import { getLogger } from "@std/log/get-logger";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const logger = getLogger("my-logger");
 * const result = logger.info("Hello world!");
 *
 * assertEquals(result, "Hello world!");
 * ```
 */
const getLogger = _function_getLogger as typeof _function_getLogger
export { getLogger }
