import { apply } from "@libs/diff/apply"

/** Apply unified patch to a string */
export default async function (request: Request): Promise<Response> {
  if (request.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 })
  try {
    const { a, patch } = await request.json()
    return new Response(apply(a, patch), { headers: { "content-type": "text/plain" } })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
