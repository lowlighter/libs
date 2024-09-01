import type { LogMode as _typeAlias_LogMode } from "jsr:@std/log@0.224.6/file-handler"
/** UNDOCUMENTED */
type LogMode = _typeAlias_LogMode
export type { LogMode }

import type { FileHandlerOptions as _interface_FileHandlerOptions } from "jsr:@std/log@0.224.6/file-handler"
/** UNDOCUMENTED */
interface FileHandlerOptions extends _interface_FileHandlerOptions {}
export type { FileHandlerOptions }

import { FileHandler as _class_FileHandler } from "jsr:@std/log@0.224.6/file-handler"
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
