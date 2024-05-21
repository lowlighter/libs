#!/usr/bin/env DENO_DIR=/tmp deno run
import * as XML from "jsr:@libs/xml/stringify"
import { STATUS_CODE, STATUS_TEXT } from "jsr:@std/http/status"

/** Stringify XML */
export default async function (request: Request) {
  if (request.method !== "POST") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  try {
    return new Response(XML.stringify(JSON.parse(await request.text())), { headers: { "content-type": "application/xml" } })
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
