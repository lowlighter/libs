import { jsonFormatter as _function_jsonFormatter } from "jsr:@std/log@0.224.9/formatters"
/**
 * JSON log formatter.
 *
 * @example Usage
 * ```ts
 * import { LogRecord } from "@std/log/logger";
 * import { jsonFormatter } from "@std/log/formatters";
 * import { LogLevels } from "@std/log/levels";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const record = new LogRecord({
 *   msg: "Hello, world!",
 *   args: ["foo", "bar"],
 *   level: LogLevels.INFO,
 *   loggerName: "example",
 * });
 * const formatted = jsonFormatter(record);
 *
 * assertEquals(
 *   formatted,
 *   `{"level":"INFO","datetime":${record.datetime.getTime()},"message":"Hello, world!","args":["foo","bar"]}`,
 * );
 * ```
 *
 * @param logRecord Log record to format.
 * @return JSON string representation of the log record.
 */
const jsonFormatter = _function_jsonFormatter as typeof _function_jsonFormatter
export { jsonFormatter }

import { formatters as _variable_formatters } from "jsr:@std/log@0.224.9/formatters"
/**
 * Formatters for log records.
 */
const formatters = _variable_formatters as typeof _variable_formatters
export { formatters }
