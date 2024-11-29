#!/usr/bin/env DENO_DIR=/tmp deno run --version=v2.1.2
import { qrcode } from "@libs/qrcode"
import { otpauth } from "@libs/crypto/totp"
import { STATUS_CODE, STATUS_TEXT } from "@std/http/status"

/** Generate QR Code for OTP secret */
export default function (request: Request) {
  if (request.method !== "GET") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  try {
    const url = new URL(request.url)
    const issuer = url.searchParams.get("issuer") ?? ""
    const account = url.searchParams.get("account") ?? ""
    const secret = url.searchParams.get("secret") ?? ""
    const image = url.searchParams.get("image") ?? ""
    return new Response(qrcode(otpauth({ issuer, account, image, secret }).href, { output: "svg" }), { headers: { "content-type": "image/svg+xml" } })
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
