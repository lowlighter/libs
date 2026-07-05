import { diff } from "@libs/diff/diff"

/** Compute unified patch between two strings */
export default async function (request: Request): Promise<Response> {
  if (request.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 })
  try {
    const { a, b } = await request.json()
    return new Response(diff(a, b), { headers: { "content-type": "text/plain" } })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
