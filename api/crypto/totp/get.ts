#!/usr/bin/env DENO_DIR=/tmp deno run --version=v2.0.6
import { totp } from "@libs/crypto/totp"
import { STATUS_CODE, STATUS_TEXT } from "@std/http/status"

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
