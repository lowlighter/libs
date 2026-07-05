import { totp } from "@libs/crypto/totp"

/** Get OTP */
export default async function (request: Request): Promise<Response> {
  if (request.method !== "GET")
    return new Response("Method Not Allowed", { status: 405 })
  try {
    const url = new URL(request.url)
    const secret = url.searchParams.get("secret") ?? ""
    const t = url.searchParams.has("t") ? Number(url.searchParams.get("t")) : undefined
    return new Response(JSON.stringify(await totp(secret, { t })), { headers: { "content-type": "application/json" } })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
