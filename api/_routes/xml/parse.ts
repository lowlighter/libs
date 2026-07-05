import { parse } from "@libs/xml/parse"

/** Parse XML */
export default async function (request: Request): Promise<Response> {
  if (request.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 })
  try {
    return new Response(JSON.stringify(parse(await request.text()), null, 2), { headers: { "content-type": "application/json" } })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
