#!/usr/bin/env DENO_DIR=/tmp deno run --version=v2.1.2
import { diff } from "@libs/diff/diff"
import { STATUS_CODE, STATUS_TEXT } from "@std/http/status"

/** Diff */
export default async function (request: Request) {
  if (request.method !== "POST") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  try {
    const { a, b } = await request.json()
    return new Response(diff(a, b), { headers: { "content-type": "text/plain" } })
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
