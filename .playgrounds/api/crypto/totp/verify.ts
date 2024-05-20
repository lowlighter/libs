#!/usr/bin/env DENO_DIR=/tmp deno run
import { verify } from "jsr:@libs/crypto/totp"
import { STATUS_CODE, STATUS_TEXT } from "jsr:@std/http/status"

/** Get OTP */
export default async function (request: Request) {
  if (request.method !== "GET") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  try {
    const url = new URL(request.url)
    const secret = url.searchParams.get("secret") ?? ""
    const token = url.searchParams.get("token") ?? ""
    const tolerance = Number(url.searchParams.get("tolerance") ?? "")
    const t = Number(url.searchParams.get("t") ?? "")
    return new Response(JSON.stringify(await verify({ secret, token, tolerance, t })), { headers: { "content-type": "application/json" } })
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
