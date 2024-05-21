#!/usr/bin/env DENO_DIR=/tmp deno run
import { qrcode } from "jsr:@libs/qrcode"
import { STATUS_CODE, STATUS_TEXT } from "jsr:@std/http/status"

/** Generate QR code */
export default function (request: Request) {
  if (request.method !== "GET") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  try {
    const url = new URL(request.url)
    const content = url.searchParams.get("content") ?? ""
    return new Response(qrcode(content, { output: "svg", border: 2 }), { headers: { "content-type": "image/svg+xml" } })
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
