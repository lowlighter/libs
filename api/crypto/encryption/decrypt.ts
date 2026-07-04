import { decrypt } from "@libs/crypto/encryption"

/** Decrypt message */
export default async function (request: Request): Promise<Response> {
  if (request.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 })
  try {
    const { message, key } = await request.json()
    return new Response(JSON.stringify(await decrypt(message, { key })), { headers: { "content-type": "application/json" } })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
