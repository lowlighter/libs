#!/usr/bin/env DENO_DIR=/tmp deno run
import { totp } from "jsr:@libs/crypto/totp"
import { STATUS_CODE, STATUS_TEXT } from "jsr:@std/http"

/** Get OTP */
export default async function (request: Request) {
  if (request.method !== "GET") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  try {
    const url = new URL(request.url)
    const secret = url.searchParams.get("secret") ?? ""
    const t = Number(url.searchParams.get("t") ?? "")
    return new Response(JSON.stringify(await totp(secret, { t })), { headers: { "content-type": "application/json" } })
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
