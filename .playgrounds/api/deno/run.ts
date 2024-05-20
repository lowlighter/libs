#!/usr/bin/env DENO_DIR=/tmp deno run
import { STATUS_CODE, STATUS_TEXT } from "jsr:@std/http"

/** Maximum runtime execution */
const TIMEOUT = 6 * 1000

/** Text encoder */
const encoder = new TextEncoder()

/** Text decoder */
const decoder = new TextDecoder()

/** Execute deno script */
export default async function (request: Request) {
  if (request.method !== "POST") {
    return new Response(STATUS_TEXT[STATUS_CODE.MethodNotAllowed], { status: STATUS_CODE.MethodNotAllowed })
  }
  try {
    // Spawn deno process
    const script = await request.text()
    const command = new Deno.Command("deno", { args: ["run", "--no-check", "--no-prompt", "--quiet", "-"], stdin: "piped", stdout: "piped", stderr: "piped", env: { DENO_DIR: "/tmp/.deno" } })
    await using process = command.spawn()
    const writer = process.stdin.getWriter()
    await writer.write(encoder.encode(script))
    writer.releaseLock()
    await process.stdin.close()

    // Wait for process to finish
    const time = performance.now()
    let killed = false
    const timeout = setTimeout(() => {
      killed = true
      process.kill("SIGKILL")
    }, TIMEOUT)
    const { success, code, stdout, stderr } = await process.output()
    clearTimeout(timeout)
    const duration = performance.now() - time

    // Return result
    return new Response(
      JSON.stringify({
        success,
        code: killed ? -1 : code,
        duration,
        stdout: decoder.decode(stdout),
        stderr: decoder.decode(stderr),
      }),
      { headers: { "content-type": "application/json" } },
    )
  } catch (error) {
    return new Response(error.message, { status: STATUS_CODE.InternalServerError })
  }
}
