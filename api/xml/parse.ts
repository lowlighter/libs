#!/usr/bin/env DENO_DIR=/tmp deno run --version=v2.1.2
import * as XML from "@libs/xml/parse"
import { STATUS_CODE, STATUS_TEXT } from "@std/http"

/** Parse XML */
export default async function (request: Request) {
  if (request.method !== "POST") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  try {
    return new Response(JSON.stringify(XML.parse(await request.text()), null, 2), { headers: { "content-type": "application/json" } })
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
