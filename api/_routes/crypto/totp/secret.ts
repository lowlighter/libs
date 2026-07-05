import { otpsecret } from "@libs/crypto/totp"

/** Generate OTP secret */
export default function (request: Request): Response {
  if (request.method !== "GET")
    return new Response("Method Not Allowed", { status: 405 })
  try {
    return new Response(JSON.stringify(otpsecret()), { headers: { "content-type": "application/json" } })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
