import { exportKey } from "@libs/crypto/encryption"

/** Derive encryption key from seed and salt */
export default async function (request: Request): Promise<Response> {
  if (request.method !== "GET")
    return new Response("Method Not Allowed", { status: 405 })
  try {
    const url = new URL(request.url)
    const seed = url.searchParams.get("seed") ?? ""
    const salt = url.searchParams.get("salt") ?? ""
    return new Response(JSON.stringify(await exportKey({ seed, salt })), { headers: { "content-type": "application/json" } })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
