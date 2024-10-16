import { STATUS_CODE as _variable_STATUS_CODE } from "jsr:@std/http@1.0.8/status"
/**
 * Contains the {@linkcode STATUS_CODE} object which contains standard HTTP
 * status codes and provides several type guards for handling status codes
 * with type safety.
 *
 * @example The status code and status text
 * ```ts
 * import {
 *   STATUS_CODE,
 *   STATUS_TEXT,
 * } from "@std/http/status";
 *
 * console.log(STATUS_CODE.NotFound); // Returns 404
 * console.log(STATUS_TEXT[STATUS_CODE.NotFound]); // Returns "Not Found"
 * ```
 *
 * @example Checking the status code type
 * ```ts
 * import { isErrorStatus } from "@std/http/status";
 *
 * const res = await fetch("https://example.com/");
 *
 * if (isErrorStatus(res.status)) {
 *   // error handling here...
 * }
 *
 * await res.body?.cancel();
 * ```
 *
 * @module
 */
const STATUS_CODE = _variable_STATUS_CODE as typeof _variable_STATUS_CODE
export { STATUS_CODE }

import type { StatusCode as _typeAlias_StatusCode } from "jsr:@std/http@1.0.8/status"
/**
 * An HTTP status code.
 */
type StatusCode = _typeAlias_StatusCode
export type { StatusCode }

import { STATUS_TEXT as _variable_STATUS_TEXT } from "jsr:@std/http@1.0.8/status"
/**
 * A record of all the status codes text.
 */
const STATUS_TEXT = _variable_STATUS_TEXT as typeof _variable_STATUS_TEXT
export { STATUS_TEXT }

import type { StatusText as _typeAlias_StatusText } from "jsr:@std/http@1.0.8/status"
/**
 * An HTTP status text.
 */
type StatusText = _typeAlias_StatusText
export type { StatusText }

import type { InformationalStatus as _typeAlias_InformationalStatus } from "jsr:@std/http@1.0.8/status"
/**
 * An HTTP status that is a informational (1XX).
 */
type InformationalStatus = _typeAlias_InformationalStatus
export type { InformationalStatus }

import type { SuccessfulStatus as _typeAlias_SuccessfulStatus } from "jsr:@std/http@1.0.8/status"
/**
 * An HTTP status that is a success (2XX).
 */
type SuccessfulStatus = _typeAlias_SuccessfulStatus
export type { SuccessfulStatus }

import type { RedirectStatus as _typeAlias_RedirectStatus } from "jsr:@std/http@1.0.8/status"
/**
 * An HTTP status that is a redirect (3XX).
 */
type RedirectStatus = _typeAlias_RedirectStatus
export type { RedirectStatus }

import type { ClientErrorStatus as _typeAlias_ClientErrorStatus } from "jsr:@std/http@1.0.8/status"
/**
 * An HTTP status that is a client error (4XX).
 */
type ClientErrorStatus = _typeAlias_ClientErrorStatus
export type { ClientErrorStatus }

import type { ServerErrorStatus as _typeAlias_ServerErrorStatus } from "jsr:@std/http@1.0.8/status"
/**
 * An HTTP status that is a server error (5XX).
 */
type ServerErrorStatus = _typeAlias_ServerErrorStatus
export type { ServerErrorStatus }

import type { ErrorStatus as _typeAlias_ErrorStatus } from "jsr:@std/http@1.0.8/status"
/**
 * An HTTP status that is an error (4XX and 5XX).
 */
type ErrorStatus = _typeAlias_ErrorStatus
export type { ErrorStatus }

import { isStatus as _function_isStatus } from "jsr:@std/http@1.0.8/status"
/**
 * Returns whether the provided number is a valid HTTP status code.
 *
 * @example Usage
 * ```ts
 * import { isStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isStatus(404));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is a valid status code.
 */
const isStatus = _function_isStatus as typeof _function_isStatus
export { isStatus }

import { isInformationalStatus as _function_isInformationalStatus } from "jsr:@std/http@1.0.8/status"
/**
 * A type guard that determines if the status code is informational.
 *
 * @example Usage
 * ```ts
 * import { isInformationalStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isInformationalStatus(100));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is an informational status code.
 */
const isInformationalStatus = _function_isInformationalStatus as typeof _function_isInformationalStatus
export { isInformationalStatus }

import { isSuccessfulStatus as _function_isSuccessfulStatus } from "jsr:@std/http@1.0.8/status"
/**
 * A type guard that determines if the status code is successful.
 *
 * @example Usage
 * ```ts
 * import { isSuccessfulStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isSuccessfulStatus(200));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is a successful status code.
 */
const isSuccessfulStatus = _function_isSuccessfulStatus as typeof _function_isSuccessfulStatus
export { isSuccessfulStatus }

import { isRedirectStatus as _function_isRedirectStatus } from "jsr:@std/http@1.0.8/status"
/**
 * A type guard that determines if the status code is a redirection.
 *
 * @example Usage
 * ```ts
 * import { isRedirectStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isRedirectStatus(302));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is a redirect status code.
 */
const isRedirectStatus = _function_isRedirectStatus as typeof _function_isRedirectStatus
export { isRedirectStatus }

import { isClientErrorStatus as _function_isClientErrorStatus } from "jsr:@std/http@1.0.8/status"
/**
 * A type guard that determines if the status code is a client error.
 *
 * @example Usage
 * ```ts
 * import { isClientErrorStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isClientErrorStatus(404));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is a client error status code.
 */
const isClientErrorStatus = _function_isClientErrorStatus as typeof _function_isClientErrorStatus
export { isClientErrorStatus }

import { isServerErrorStatus as _function_isServerErrorStatus } from "jsr:@std/http@1.0.8/status"
/**
 * A type guard that determines if the status code is a server error.
 *
 * @example Usage
 * ```ts
 * import { isServerErrorStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isServerErrorStatus(502));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is a server error status code.
 */
const isServerErrorStatus = _function_isServerErrorStatus as typeof _function_isServerErrorStatus
export { isServerErrorStatus }

import { isErrorStatus as _function_isErrorStatus } from "jsr:@std/http@1.0.8/status"
/**
 * A type guard that determines if the status code is an error.
 *
 * @example Usage
 * ```ts
 * import { isErrorStatus } from "@std/http/status";
 * import { assert } from "@std/assert";
 *
 * assert(isErrorStatus(502));
 * ```
 *
 * @param status The status to assert against.
 * @return Whether or not the provided status is an error status code.
 */
const isErrorStatus = _function_isErrorStatus as typeof _function_isErrorStatus
export { isErrorStatus }
