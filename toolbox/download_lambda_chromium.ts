// Imports
// deno-lint-ignore-file no-console no-external-import
import type { Buffer } from "node:buffer"
import { brotliDecompressSync } from "node:zlib"
import { ensureDir, exists } from "@std/fs"
import { basename, dirname, join, resolve } from "@std/path"
import { UntarStream } from "@std/tar"
import { toArrayBuffer } from "@std/streams"
import { parseArgs } from "@std/cli"

/** Locks. */
const locks = new Map<string, Promise<string>>()

/** Chromium download options. */
export type ChromiumOptions = {
  /** Chromium version. Default is `141.0.0`. */
  version?: string
  /** Path to save Chromium binary. Default is `/tmp/chromium`. */
  path?: string
  /** System architecture. Default is current architecture. */
  arch?: typeof Deno.build.arch
  /** Download URL. */
  url?: string
  /** Force download even if file exists. */
  force?: boolean
  /** Set environment variables for `FONTCONFIG_PATH` and `LD_LIBRARY_PATH` (requires --allow-env). Default is `true`. */
  env?: boolean
  /** Enable debugging. */
  debug?: boolean
}

/** Download Chromium binary for AWS Lambda environment. */
export function chromium({ version = "141.0.0", path = "/tmp/chromium", arch = Deno.build.arch, force = false, env = true, debug = false }: ChromiumOptions = {}): Promise<string> {
  // Install browseer
  path = resolve(path)
  if (!locks.has(path)) {
    locks.set(
      path,
      // deno-lint-ignore no-async-promise-executor
      new Promise<string>(async (resolve, reject) => {
        try {
          if ((!await exists(path)) || force) {
            const url = `https://github.com/Sparticuz/chromium/releases/download/v${version}/chromium-v${version}-pack.${{ x86_64: "x64", aarch64: "arm64" }[arch] ?? "unknown"}.tar`
            if (debug) {
              console.debug(`Downloading Chromium v${version} from ${url}`)
            }
            await extract(await fetch(url).then((response) => response.body!), { path: dirname(path), debug })
          }
          resolve(path)
        } catch (error) {
          reject(error)
        }
      }),
    )
  }
  // Set environment variables
  if (env) {
    if (!Deno.env.get("FONTCONFIG_PATH")) {
      Deno.env.set("FONTCONFIG_PATH", join(dirname(path), "fonts"))
      if (debug) {
        console.debug(`Set FONTCONFIG_PATH to ${Deno.env.get("FONTCONFIG_PATH")}`)
      }
    }
    if (!Deno.env.get("LD_LIBRARY_PATH")?.includes(join(dirname(path), "al2023"))) {
      Deno.env.set("LD_LIBRARY_PATH", [join(dirname(path), "al2023"), Deno.env.get("LD_LIBRARY_PATH")].join(":"))
      if (debug) {
        console.debug(`Set LD_LIBRARY_PATH to ${Deno.env.get("LD_LIBRARY_PATH")}`)
      }
    }
  }

  return locks.get(path)!
}

/** Extract tar stream. */
async function extract(stream: ReadableStream<Uint8Array<ArrayBuffer>>, { path, debug }: { path: string; debug?: boolean }) {
  for await (const entry of stream.pipeThrough(new UntarStream())) {
    if (!entry.readable) {
      continue
    }
    let name = basename(entry.path)
    let buffer = await toArrayBuffer(entry.readable) as ArrayBuffer | Buffer<ArrayBufferLike>
    if (name.endsWith(".br")) {
      name = basename(name, ".br")
      buffer = brotliDecompressSync(buffer, { chunkSize: 2 ** 21 })
    }
    if (name.endsWith(".tar")) {
      name = basename(name, ".tar")
      await extract(ReadableStream.from([new Uint8Array(buffer)]), { path: name === "swiftshader" ? path : join(path, name), debug })
      continue
    }
    name = join(path, name)
    await ensureDir(dirname(name))
    await Deno.writeFile(name, new Uint8Array(buffer))
    await Deno.chmod(name, 0o700)
    if (debug) {
      console.debug(`Extracted ${name}`)
    }
  }
}

if (import.meta.main) {
  const args = parseArgs(Deno.args, { string: ["version", "path", "arch"], boolean: ["env", "force", "debug", "help"], alias: { v: "version", p: "path", a: "arch", e: "env", f: "force", d: "debug", h: "help" } })
  if (args.help) {
    console.log(`Downloads Chromium binary for AWS Lambda environment.

Usage:
  deno run jsr:@libs/toolbox/download-lambda-chromium [options]

Options:
  -v, --version       Chromium version. Default is 141.0.0
  -p, --path          Path to save Chromium binary. Default is /tmp/chromium
  -a, --arch          System architecture. Default is current architecture
  -e, --env           Set environment variables for FONTCONFIG_PATH and LD_LIBRARY_PATH (requires --allow-env). Default is true
  -f, --force         Force download even if file exists
  -d, --debug         Enable debug logging
  -h, --help          Show this help message
`)
    Deno.exit(0)
  }
  const path = await chromium({ version: args.version, path: args.path, arch: args.arch as typeof Deno.build.arch, env: args.env, force: args.force, debug: args.debug })
  console.log(path)
}
