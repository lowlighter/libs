#!/usr/bin/env DENO_DIR=/tmp deno run
import { qrcode } from "jsr:@libs/qrcode"
import { otpauth} from "jsr:@libs/crypto/totp"
import { STATUS_CODE, STATUS_TEXT } from "jsr:@std/http"

/** Generate QR Code for OTP secret */
export default  function (request: Request) {
  if (request.method !== "GET") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  try {    const url = new URL(request.url)
    const issuer = url.searchParams.get("issuer") ?? ""
    const account = url.searchParams.get("account") ?? ""
    const secret = url.searchParams.get("secret") ?? ""
    const image = url.searchParams.get("image") ?? ""
    return new Response(qrcode(otpauth({issuer, account, image, secret}).href, {output:"svg"}), {headers:{"content-type":"image/svg+xml"}})
  }
  catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
