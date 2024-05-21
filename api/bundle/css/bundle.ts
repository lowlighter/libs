#!/usr/bin/env DENO_DIR=/tmp deno run
import { bundle } from "jsr:@libs/bundle/css"
import { STATUS_CODE, STATUS_TEXT } from "jsr:@std/http/status"

/** Bundle CSS */
export default async function (request: Request) {
  if (request.method !== "POST") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  try {
    const { code, ...options } = await request.json()
    return new Response(await bundle(code, options), { headers: { "content-type": "text/css" } })
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
