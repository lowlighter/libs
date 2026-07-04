import { stringify } from "@libs/xml/stringify"

/** Stringify XML */
export default async function (request: Request): Promise<Response> {
  if (request.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 })
  try {
    return new Response(stringify(JSON.parse(await request.text())), { headers: { "content-type": "application/xml" } })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
