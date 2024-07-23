import { writeAll as _function_writeAll } from "jsr:@std/io@0.224.3/write-all"
/**
 * Write all the content of the array buffer (`arr`) to the writer (`w`).
 *
 * @example ```ts
 * import { writeAll } from "@std/io/write-all";
 *
 * // Example writing to stdout
 * let contentBytes = new TextEncoder().encode("Hello World");
 * await writeAll(Deno.stdout, contentBytes);
 *
 * // Example writing to file
 * contentBytes = new TextEncoder().encode("Hello World");
 * using file = await Deno.open('test.file', {write: true});
 * await writeAll(file, contentBytes);
 * ```
 */
const writeAll = _function_writeAll
export { writeAll }

import { writeAllSync as _function_writeAllSync } from "jsr:@std/io@0.224.3/write-all"
/**
 * Synchronously write all the content of the array buffer (`arr`) to the
 * writer (`w`).
 *
 * @example ```ts
 * import { writeAllSync } from "@std/io/write-all";
 *
 * // Example writing to stdout
 * let contentBytes = new TextEncoder().encode("Hello World");
 * writeAllSync(Deno.stdout, contentBytes);
 *
 * // Example writing to file
 * contentBytes = new TextEncoder().encode("Hello World");
 * using file = Deno.openSync('test.file', {write: true});
 * writeAllSync(file, contentBytes);
 * ```
 */
const writeAllSync = _function_writeAllSync
export { writeAllSync }
