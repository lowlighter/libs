// Imports
import type { Nullable } from "@libs/typing"
import { command } from "@libs/run/command"
export type { Nullable }

/**
 * Parse the output of `git blame --line-porcelain`.
 */
export function blame(path: string, { stdout = "" } = {} as BlameOptions): BlameEntry[] {
  if (!stdout) {
    ;({ stdout } = command("git", ["blame", "--line-porcelain", path], { sync: true, throw: true }))
  }
  const entries = []
  const porcelain = stdout.trim().split("\n")
  while (porcelain.length) {
    entries.push({
      sha: porcelain.shift()!.substring(0, 40),
      author: {
        name: porcelain.shift()!.substring("author ".length),
        mail: porcelain.shift()!.substring("author-mail ".length),
        time: Number(porcelain.shift()!.substring("author-time ".length)),
        tz: Number(porcelain.shift()!.substring("author-tz ".length)),
      },
      committer: {
        name: porcelain.shift()!.substring("committer ".length),
        mail: porcelain.shift()!.substring("committer-mail ".length),
        time: Number(porcelain.shift()!.substring("committer-time ".length)),
        tz: Number(porcelain.shift()!.substring("committer-tz ".length)),
      },
      summary: porcelain.shift()!.substring("summary ".length),
      boundary: porcelain[0].startsWith("boundary") ? (porcelain.shift(), true) : false,
      previous: porcelain[0].startsWith("previous ") ? porcelain.shift()!.substring("previous ".length) : null,
      filename: porcelain.shift()!.substring("filename ".length),
      content: porcelain.shift()!.substring(1),
    })
  }
  return entries
}

/** Options for {@linkcode blame()}. */
export type BlameOptions = {
  /**
   * The output returned by `git blame --line-porcelain`.
   *
   * If empty, the function will run `git blame --line-porcelain` synchronously to populate this field.
   */
  stdout?: string
}

/** Git blame entry. */
export type BlameEntry = {
  sha: string
  author: {
    name: string
    mail: string
    time: number
    tz: number
  }
  committer: {
    name: string
    mail: string
    time: number
    tz: number
  }
  summary: string
  boundary: boolean
  previous: Nullable<string>
  filename: string
  content: string
}
