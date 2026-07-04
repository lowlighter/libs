import { verify } from "@libs/crypto/totp"

/** Verify OTP */
export default async function (request: Request): Promise<Response> {
  if (request.method !== "GET")
    return new Response("Method Not Allowed", { status: 405 })
  try {
    const url = new URL(request.url)
    const secret = url.searchParams.get("secret") ?? ""
    const token = url.searchParams.get("token") ?? ""
    const tolerance = url.searchParams.has("tolerance") ? Number(url.searchParams.get("tolerance")) : undefined
    const t = url.searchParams.has("t") ? Number(url.searchParams.get("t")) : undefined
    return new Response(JSON.stringify(await verify({ secret, token, tolerance, t })), { headers: { "content-type": "application/json" } })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
