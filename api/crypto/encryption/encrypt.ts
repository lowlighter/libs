import { encrypt } from "@libs/crypto/encryption"

/** Encrypt message */
export default async function (request: Request): Promise<Response> {
  if (request.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 })
  try {
    const { message, key } = await request.json()
    return new Response(JSON.stringify(await encrypt(message, { key })), { headers: { "content-type": "application/json" } })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
