#!/usr/bin/env -S deno run --no-lock --allow-read=. --allow-run=deno
//@vercel: --include=@libs/*/deno.jsonc
import { type Route, route } from "@std/http/unstable-route"
import denoRun from "./_routes/deno/run.ts"
import diffDiff from "./_routes/diff/diff.ts"
import diffPatch from "./_routes/diff/patch.ts"
import qrcodeGet from "./_routes/qrcode/get.ts"
import xmlParse from "./_routes/xml/parse.ts"
import xmlStringify from "./_routes/xml/stringify.ts"
import encryptionDecrypt from "./_routes/crypto/encryption/decrypt.ts"
import encryptionEncrypt from "./_routes/crypto/encryption/encrypt.ts"
import encryptionKey from "./_routes/crypto/encryption/key.ts"
import totpGet from "./_routes/crypto/totp/get.ts"
import totpQrcode from "./_routes/crypto/totp/qrcode.ts"
import totpSecret from "./_routes/crypto/totp/secret.ts"
import totpVerify from "./_routes/crypto/totp/verify.ts"

/** API routes */
const routes: Route[] = [
  { pattern: new URLPattern({ pathname: "/api/deno/run" }), method: "POST", handler: denoRun },
  { pattern: new URLPattern({ pathname: "/api/diff/diff" }), method: "POST", handler: diffDiff },
  { pattern: new URLPattern({ pathname: "/api/diff/patch" }), method: "POST", handler: diffPatch },
  { pattern: new URLPattern({ pathname: "/api/qrcode/get" }), method: "GET", handler: qrcodeGet },
  { pattern: new URLPattern({ pathname: "/api/xml/parse" }), method: "POST", handler: xmlParse },
  { pattern: new URLPattern({ pathname: "/api/xml/stringify" }), method: "POST", handler: xmlStringify },
  { pattern: new URLPattern({ pathname: "/api/crypto/encryption/decrypt" }), method: "POST", handler: encryptionDecrypt },
  { pattern: new URLPattern({ pathname: "/api/crypto/encryption/encrypt" }), method: "POST", handler: encryptionEncrypt },
  { pattern: new URLPattern({ pathname: "/api/crypto/encryption/key" }), method: "GET", handler: encryptionKey },
  { pattern: new URLPattern({ pathname: "/api/crypto/totp/get" }), method: "GET", handler: totpGet },
  { pattern: new URLPattern({ pathname: "/api/crypto/totp/qrcode" }), method: "GET", handler: totpQrcode },
  { pattern: new URLPattern({ pathname: "/api/crypto/totp/secret" }), method: "GET", handler: totpSecret },
  { pattern: new URLPattern({ pathname: "/api/crypto/totp/verify" }), method: "GET", handler: totpVerify },
]

/** Dispatch request to matching route (unmatched methods on known routes yield 405, unknown routes yield 404) */
export default route(routes, (request: Request) => {
  if (routes.some(({ pattern }) => pattern.test(request.url)))
    return new Response("Method Not Allowed", { status: 405 })
  return new Response("Not Found", { status: 404 })
})
