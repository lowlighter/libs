#!/usr/bin/env DENO_DIR=/tmp deno run --version=v2.0.6
import { compatibility } from "@libs/bundle/css"
import { STATUS_CODE, STATUS_TEXT } from "@std/http/status"

/** CSS compatibility report */
export default async function (request: Request) {
  if (request.method !== "POST") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  try {
    const { code, query } = await request.json()
    return new Response(await compatibility(code, { query, view: "browsers", output: "html", verbose: true }), { headers: { "content-type": "text/html" } })
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
