// Imports
// deno-lint-ignore-file no-external-import
import type { Buffer } from "node:buffer"
// deno-lint-ignore-file no-external-import
import { brotliDecompressSync } from "node:zlib"
import { exists } from "@std/fs"
import { basename } from "@std/path"
import { UntarStream } from "@std/tar"
import { toArrayBuffer } from "@std/streams"

/** Locks. */
const locks = new Map<string, Promise<string>>()

/** Chromium download options. */
export type ChromiumOptions = {
  /** Chromium version. Default is `141.0.0`. */
  version?: string
  /** Path to save Chromium binary. Default is `/tmp/chromium`. */
  path?: string
  /** File permissions. Default is `0o755`. */
  permissions?: number
  /** System architecture. Default is current architecture. */
  arch?: typeof Deno.build.arch
  /** Download URL. */
  url?: string
}

/** Download Chromium binary for AWS Lambda environment. */
export function chromium({ version = "141.0.0", path = "/tmp/chromium", permissions = 0o755, arch = Deno.build.arch }: ChromiumOptions = {}): Promise<string> {
  // Prevent multiple downloads
  if (!locks.has(path)) {
    locks.set(
      path,
      // deno-lint-ignore no-async-promise-executor
      new Promise<string>(async (resolve, reject) => {
        try {
          if (!await exists(path)) {
            const url = `https://github.com/Sparticuz/chromium/releases/download/v${version}/chromium-v${version}-pack.${{ x86_64: "x64", aarch64: "arm64" }[arch] ?? "unknown"}.tar`
            for await (const entry of await fetch(url).then((response) => response.body!.pipeThrough(new UntarStream()))) {
              if ((!entry.readable) || (!/^chromium(?:\.br)$/.test(basename(entry.path)))) {
                entry.readable?.cancel()
                continue
              }
              let buffer = await toArrayBuffer(entry.readable) as ArrayBuffer | Buffer<ArrayBufferLike>
              if (entry.path.endsWith(".br")) {
                buffer = brotliDecompressSync(buffer)
              }
              await Deno.writeFile(path, new Uint8Array(buffer))
              await Deno.chmod(path, permissions)
            }
          }
          resolve(path)
        } catch (error) {
          reject(error)
        }
      }),
    )
  }
  return locks.get(path)!
}
