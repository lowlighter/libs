import { LF as _variable_LF } from "jsr:@std/fs@1.0.1/eol"
/**
 * End-of-line character for POSIX platforms such as macOS and Linux.
 */
const LF = _variable_LF
export { LF }

import { CRLF as _variable_CRLF } from "jsr:@std/fs@1.0.1/eol"
/**
 * End-of-line character for Windows platforms.
 */
const CRLF = _variable_CRLF
export { CRLF }

import { EOL as _variable_EOL } from "jsr:@std/fs@1.0.1/eol"
/**
 * End-of-line character evaluated for the current platform.
 *
 * @example Usage
 * ```ts no-eval
 * import { EOL } from "@std/fs/eol";
 *
 * EOL; // "\n" on POSIX platforms and "\r\n" on Windows
 * ```
 */
const EOL = _variable_EOL
export { EOL }

import { detect as _function_detect } from "jsr:@std/fs@1.0.1/eol"
/**
 * Returns the detected EOL character(s) detected in the input string. If no EOL
 * character is detected, `null` is returned.
 *
 * @param content The input string to detect EOL characters.
 *
 * @return The detected EOL character(s) or `null` if no EOL character is detected.
 *
 * @example Usage
 * ```ts no-eval
 * import { detect } from "@std/fs/eol";
 *
 * detect("deno\r\nis not\r\nnode"); // "\r\n"
 * detect("deno\nis not\r\nnode"); // "\r\n"
 * detect("deno\nis not\nnode"); // "\n"
 * detect("deno is not node"); // null
 * ```
 */
const detect = _function_detect
export { detect }

import { format as _function_format } from "jsr:@std/fs@1.0.1/eol"
/**
 * Normalize the input string to the targeted EOL.
 *
 * @param content The input string to normalize.
 * @param eol The EOL character(s) to normalize the input string to.
 *
 * @return The input string normalized to the targeted EOL.
 *
 * @example Usage
 * ```ts no-eval
 * import { LF, format } from "@std/fs/eol";
 *
 * const CRLFinput = "deno\r\nis not\r\nnode";
 *
 * format(CRLFinput, LF); // "deno\nis not\nnode"
 * ```
 */
const format = _function_format
export { format }
