import { copy, emptyDir, ensureDir, exists } from "@std/fs"
import { basename, dirname, join } from "@std/path"
import { gray, green, red } from "@std/fmt/colors"
export { basename, dirname, exists, join }

/** Build files and directories. */
export async function build(descriptions: BuildDescription[], { log = console }: BuildOptions = {}) {
  for (const { output, empty, files } of descriptions) {
    // Prepare the output directory
    log?.debug(gray(`output directory: ${output}`))
    await ensureDir(output)
    if (empty) {
      log?.debug(gray(`cleaning output directory: ${output}`))
      await emptyDir(output)
    }
    // Process each file
    for (const { name, ...action } of files) {
      const path = join(output, name)
      await ensureDir(dirname(path))
      log?.debug(gray(`processing: ${path}`))
      // Raw content
      if ("content" in action) {
        const { content } = action
        log?.debug(gray(`writing: ${name}`))
        if (typeof content === "string")
          await Deno.writeTextFile(path, content)
        else
          await Deno.writeFile(path, content)
        log?.info(green(`wrote: ${name}`))
      }
      // Copy
      if ("copy" in action) {
        const { copy: source } = action
        log?.debug(gray(`copying: ${source} -> ${name}`))
        await copy(source, path, { overwrite: true })
        log?.info(green(`copied: ${source} -> ${name}`))
      }
      // Fetch
      if ("fetch" in action) {
        const { fetch: source } = action
        log?.debug(gray(`fetching: ${source} -> ${name}`))
        const response = await fetch(source)
        await Deno.writeFile(path, new Uint8Array(await response.arrayBuffer()))
        log?.info(green(`fetched: ${source} -> ${name}`))
      }
      // Callback
      if ("call" in action) {
        const { call } = action
        log?.debug(gray(`calling: ${name}`))
        const content = await call()
        if (typeof content === "string")
          await Deno.writeTextFile(path, content)
        else
          await Deno.writeFile(path, content)
        log?.info(green(`called: ${name}`))
      }
      // Bundle
      if ("bundle" in action) {
        const { bundle: source, platform = "browser", minify = true } = action
        log?.debug(gray(`bundling: ${path}`))
        const { success, outputFiles, errors } = await Deno.bundle({ entrypoints: [source], platform, minify, write: false })
        errors.forEach(({ text }) => log?.error(red(`${text}`)))
        if (!success) {
          log?.error(red(`bundling failed: ${path}`))
          continue
        }
        if (!outputFiles?.length) {
          log?.error(red(`bundling produced no output: ${path}`))
          continue
        }
        const content = outputFiles[0].text()
        log?.info(green(`bundled: ${path} (${content.length} bytes)`))
        await Deno.writeTextFile(path, content)
      }
    }
  }
}

/** Options for the `build()` function. */
export type BuildOptions = {
  /** Optional console to use for logging. Defaults to the global console. */
  log?: null | {
    debug: (...args: unknown[]) => void
    info: (...args: unknown[]) => void
    error: (...args: unknown[]) => void
  }
}

/** A build file description. */
export type BuildFileDescription =
  & {
    /** The file name, relative to the output directory. */
    name: string
  }
  & (
    | {
      /** The raw content of the file. */
      content: string | Uint8Array | ReadableStream<Uint8Array>
    }
    | {
      /** The path to copy the file or directory from. */
      copy: string
    }
    | {
      /** The URL to fetch the file from. */
      fetch: string | URL
    }
    | {
      /** A callback to generate the file content. */
      call: () => Promise<string | Uint8Array | ReadableStream<Uint8Array>>
    }
    | {
      /** The path to bundle the file from. */
      bundle: string
      /** Whether to minify the output. Defaults to true. */
      minify?: boolean
      /** The platform for which to bundle the file. */
      platform?: Deno.bundle.Platform
    }
  )

/** A build description. */
export type BuildDescription = {
  /** The output directory. */
  output: string
  /** Whether to empty the output directory before writing files. */
  empty?: boolean
  /** The files to write. */
  files: BuildFileDescription[]
}
