#!/usr/bin/env DENO_DIR=/tmp deno run --version=v2.1.2
import { bundle } from "@libs/bundle/ts"
import { STATUS_CODE, STATUS_TEXT } from "@std/http/status"

/** Bundle TypeScript */
export default async function (request: Request) {
  if (request.method !== "POST") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  try {
    const { code, ...options } = await request.json()
    return new Response(await bundle(code, options), { headers: { "content-type": "text/javascript" } })
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
