// Copyright (c) - 2025+ the lowlighter/libs authors. AGPL-3.0-or-later
import type { Arg, Promisable } from "@libs/typing/types"
import type { Logger } from "@logtape/logtape"
import { is } from "@libs/is"
export { Status } from "@libs/testing"
export { faker } from "@libs/testing/faker"
export * from "@libs/is"
export type { Logger, Promisable }

/** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Response | Response} init with optional body init. */
export type ResponseInitWithBody = ResponseInit & { body?: BodyInit | Record<PropertyKey, unknown> | unknown[] }

/** Mock handler. */
export type Handler<Schema extends is.ZodType = is.ZodType> = (input: is.infer<Schema>, request: Request, _: { log: Logger; paths: string[] }) => Promisable<Response | ResponseInitWithBody>

/**
 * Mocks a {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Response | Response} return.
 *
 * ```ts
 * export default mock({ status: Status.OK, body: "foo" })
 * ```
 */
export function mock(response: ResponseInitWithBody): (request: Request) => Response
/**
 * Mocks a {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Response | Response} return using an handler function.
 *
 * ```ts
 * export default mock(() => ({ status: Status.OK, body: "foo" }))
 * ```
 */
export function mock<Schema extends is.ZodType = is.ZodType>(response: Handler<Schema>): (request: Request) => Promise<Response>
/**
 * Mocks a {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Response | Response} return using an handler function after validating the request body against the given schema.
 *
 * ```ts
 * export default mock(is.object({ foo: is.string() }), ({ foo }) => ({ status: Status.OK, body: foo }))
 * ```
 */
export function mock<Schema extends is.ZodType = is.ZodType>(schema: Schema, handler: Handler<Schema>): (request: Request) => Promise<Response>
/**
 * Mocks a {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Response | Response} return using an handler function after validating the request body against the given shape (treated as {@linkcode is.object()}).
 *
 * ```ts
 * export default mock({ foo: is.string() }, ({ foo }) => ({ status: Status.OK, body: foo }))
 * ```
 */
export function mock<Shape extends is.ZodRawShape = is.ZodRawShape>(schema: Shape, handler: Handler<is.ZodObject<Shape>>): (request: Request) => Promise<Response>
export function mock<SchemaOrShape extends (is.ZodType | is.ZodRawShape), Schema extends is.ZodType = SchemaOrShape extends is.ZodType ? SchemaOrShape : never>(arg0: ResponseInitWithBody | SchemaOrShape | Handler<Schema>, handler?: Handler<Schema>) {
  if (typeof arg0 === "function") {
    handler = arg0 as Handler<Schema>
    arg0 = is.any() as unknown as SchemaOrShape
  }
  if (handler) {
    const schema = arg0 as SchemaOrShape
    return async function (request: Request, options: Arg<Handler, 2>) {
      const input = request.body ? await request.clone().json() : undefined
      const init = await handler(("_zod" in schema ? (schema as is.ZodType) : is.object(schema as is.ZodRawShape)).parse(input) as is.infer<Schema>, request, options)
      return init instanceof Response ? init : respond(init as ResponseInitWithBody)
    }
  }
  const init = arg0 as ResponseInitWithBody
  return function (_: Request) {
    return respond(init)
  }
}

/** Creates a {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Response | Response} object from the given {@linkcode ResponseInitWithBody}. */
function respond(init: ResponseInitWithBody): Response {
  if ((init?.body) && ((typeof init.body === "string") || ([Uint8Array, FormData, URLSearchParams].some((type) => init.body instanceof type))))
    return new Response(init.body as BodyInit, init)
  return new Response(init?.body ? JSON.stringify(init.body) : null, init)
}
