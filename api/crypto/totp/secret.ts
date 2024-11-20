#!/usr/bin/env DENO_DIR=/tmp deno run
import { otpsecret } from "@libs/crypto/totp"
import { STATUS_CODE, STATUS_TEXT } from "@std/http/status"

/** Generate OTP secret */
export default function (request: Request) {
  if (request.method !== "GET") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  try {
    return new Response(JSON.stringify(otpsecret()), { headers: { "content-type": "application/json" } })
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
