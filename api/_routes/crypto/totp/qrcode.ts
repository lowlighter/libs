import { qrcode } from "@libs/qrcode"
import { otpauth } from "@libs/crypto/totp"

/** Generate QR Code for OTP secret */
export default function (request: Request): Response {
  if (request.method !== "GET")
    return new Response("Method Not Allowed", { status: 405 })
  try {
    const url = new URL(request.url)
    const issuer = url.searchParams.get("issuer") ?? ""
    const account = url.searchParams.get("account") ?? ""
    const secret = url.searchParams.get("secret") ?? ""
    const image = url.searchParams.get("image") ?? ""
    return new Response(qrcode(otpauth({ issuer, account, image, secret }).href, { output: "svg", border: 2 }), { headers: { "content-type": "image/svg+xml" } })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
