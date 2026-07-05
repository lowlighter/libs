import { qrcode } from "@libs/qrcode"

/** Generate QR Code (SVG or PNG) */
export default function (request: Request): Response {
  if (request.method !== "GET")
    return new Response("Method Not Allowed", { status: 405 })
  try {
    const url = new URL(request.url)
    const content = url.searchParams.get("content") ?? ""
    const format = url.searchParams.get("format") ?? "svg"
    switch (format) {
      case "svg":
        return new Response(qrcode(content, { output: "svg", border: 2 }), { headers: { "content-type": "image/svg+xml" } })
      case "png":
        return new Response(new Uint8Array(qrcode(content, { output: "png", border: 2, scale: 8 })), { headers: { "content-type": "image/png" } })
      default:
        return new Response(`Unsupported format: ${format}`, { status: 400 })
    }
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
